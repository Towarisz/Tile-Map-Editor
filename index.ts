import CanvasEvent from "./events";
import CanvasChoosingBoard from "./choosingBoard";
import CanvasMap from "./map";

let events = new CanvasEvent();

// Creating Board to choose images from
let choosingBoard = new CanvasChoosingBoard(document.createElement("canvas"), document.querySelector("#board"), 384, 960, 24, 24);

// Creating Canvas to draw on
let drawBoard = new CanvasMap(document.createElement("canvas"), document.querySelector("#map"), 960, 960, 24, 24);
drawBoard.drawGrid();

let boardImage: HTMLImageElement = new Image();
boardImage.src = "sprites.png";
boardImage.onload = () => choosingBoard.fillBoard(boardImage);

// Add events to canvas
events.mouseMoveOnCanvas(drawBoard.getDOMElement(), () => drawBoard.drawGrid());
events.selectTile(choosingBoard.getDOMElement(), () => choosingBoard.fillBoard(boardImage));
events.selectMultipleTiles(drawBoard.getDOMElement(), choosingBoard.getDOMElement(), () => drawBoard.drawGrid());
