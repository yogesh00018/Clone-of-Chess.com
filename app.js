// Import required modules
const express = require("express"); // Express framework for handling HTTP requests
const socketIO = require("socket.io"); // Socket.IO for real-time communication
const http = require("http"); // HTTP module to create a server
const { Chess } = require("chess.js"); // Chess.js library for game logic
const path = require("path"); // Path module for handling file paths

const app = express(); // Initialize Express app
const server = http.createServer(app); // Create an HTTP server
const io = socketIO(server); // Attach Socket.IO to the server

const chess = new Chess(); // Initialize a new Chess game
let player = {}; // Stores both players' unique socket IDs
let currentPlayer = "w"; // White always starts first

// Set view engine to EJS for rendering HTML
app.set("view engine", "ejs");

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Define a route for the home page
app.get("/", (req, res) => {
    res.render("index", { title: "Chess Game" }); // Render 'index.ejs' with a title
});

// Handle WebSocket connections
io.on("connection", function (uniquesocket) {
    console.log("A player connected:", uniquesocket.id);

    // Assign players based on connection order
    if (!player.white) {
        player.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w"); // Assign white pieces
    } else if (!player.black) {
        player.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b"); // Assign black pieces
    } else {
        uniquesocket.emit("spectatorRole"); // If both slots are taken, assign spectator role
    }

    // Handle player disconnection
    uniquesocket.on("disconnect", function () {
        if (uniquesocket.id === player.white) {
            delete player.white; // Remove white player if they disconnect
        } else if (uniquesocket.id === player.black) {
            delete player.black; // Remove black player if they disconnect
        }
        console.log("A player disconnected:", uniquesocket.id);
    });

    // Handle player moves
    uniquesocket.on("move", (move) => {
        try {
            // Ensure the correct player is making a move
            if (chess.turn() === "w" && uniquesocket.id !== player.white) return;
            if (chess.turn() === "b" && uniquesocket.id !== player.black) return;

            const result = chess.move(move); // Attempt the move
            if (result) {
                currentPlayer = chess.turn(); // Update current player turn
                io.emit("move", move); // Notify all players of the move
                io.emit("boardState", chess.fen()); // Send the updated board state
            } else {
                console.log("Invalid move:", move);
                uniquesocket.emit("invalidMove", move); // Notify player of an invalid move
            }
        } catch (err) {
            console.log(err);
            uniquesocket.emit("invalidMove", move); // Handle errors gracefully
        }
    });
});
app.use(express.static("public"));

// Start the server on port 3000
server.listen(3000, function () {
    console.log("Server is running on port 3000");
});
