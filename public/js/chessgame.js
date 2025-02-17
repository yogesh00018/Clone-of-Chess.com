const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourcesquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML="";
    board.forEach((row, rowindex) => {
     row.forEach((square, squareindex)=>{
     const squareElement = document.createElement("div");
      squareElement.classList.add("square",
         (rowindex + squareindex) % 2=== 0 ? "Light" : "dark"
    );
    squareElement.dataset.row = rowindex;
    squareElement.dataset.col = squareindex;

    if (square){
      const pieceElement = document.createElement("div");
      pieceElement.classList.add
        ("piece",
             square.color === 'w' ? "white" : "black");
             pieceElement.innerText = getPieceUnicode(square.type, square.color);
             pieceElement.draggable = playerRole === square.color;

             pieceElement.addEventListener("dragstart", () =>{
                if (pieceElement.draggable) {
                    draggedPiece = pieceElement;
                    sourceSquare = { row: rowindex, col: squareindex };
                    e.dataTransfer.setData("text/plain", "");
                }
             });

             pieceElement.addEventListener("dragend", (e) => {
                draggedPiece = null;
                sourceSquare = null;
             });

             squareElement.appendChild
             (pieceElement);
    }
    squareElement.addEventListener("drop", function (e) {
      e.preventDefault();
      if(draggedPiece){
         const targetSource = {
            row: parseInt(squareElement.dataset.row),
            col: parseInt(squareElement.dataset.col),
         };
         handleMove(sourceSquare, targetSource);
      }
    } )
     });     
    });  
};

const handleMove = () => {};

const getPieceUnicode = () => {};

renderBoard ();