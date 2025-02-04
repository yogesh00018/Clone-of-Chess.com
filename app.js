const express = require("express");
const socket = require("socket.io");
const http = require("http");

const { Chess } = require ("chess.js");

//const { path } = require("express/lib/application");
const req = require("express/lib/request");
const res = require("express/lib/response");

const path = require("path");
const { title } = require("process");
const app = express();

const server = http.createServer(app);
const io  = socket(server);

const chess = new Chess();
let player = {}; //this will store both player id white and black with unique id
let currentPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.get("/", (req,res)=>{
    res.render("index", {title: "Chess Game"});
});

io.on("connection", function(uniquesocket) // uniquesocket is name to recive data form backe end
{
 console.log("connected");

// uniquesocket.on("disconnect", function(){
//     console.log("disconnected");
    
// })
// if any player joins first then he will get white side and if second player join
//  it will check wether any player had join or not if join then it will give black side to play
if(!player.white){
    players.white= uniquesocket.id;
    uniquesocket.emit("playerRole","w");// this line show the player that you wil play with white side
}
else if (!player.black){
    players.black = uniquesocket.id;
    uniquesocket.emit("playerRole","b");// this line show the player that you are playing with black side
}else{
    uniquesocket.emit("sepctatorRole"); // if third player join it will check the if there is first player is ther or not if not then it will conntinue as white 
    //and check for second player if it is there then it will conceder as spectator 
}

// if any player disconected or close the tab the game is pasue until the new player join
socket.on("disconnect", function(){
    if(uniquesocket.id === player.white){
        delete players.white;

    }
    else if (uniquesocket.id === players.black){
        delete players.black;

    }
})
});

server.listen(3000, function(){
    console.log("listening on port:3000");
    
});