import Tile from "./tile";

export default class CanvasEvent {
     private lastMousePosition: Tile;
     private selectedTileFromCBPostition: Tile;
     private selectedTileFromMapPosition: Tile;
     private selectedTilesWithCtrl: Array<Tile>;
     private copiedTiles: Array<Tile>;
     private canvasCopiesToUndo: Array<HTMLCanvasElement>;
     private canvasCopiesToRedo: Array<HTMLCanvasElement>;
     private cutCanvas: HTMLCanvasElement;
     private mouseDown: Boolean;
     private ctrlDown: Boolean;
     private paste: Boolean;
     private cut: Boolean;
     constructor() {
          this.mouseDown = false;
          this.ctrlDown = false;
          this.paste = false;
          this.cut = false;
          this.lastMousePosition = new Tile();
          this.selectedTileFromCBPostition = new Tile();
          this.selectedTileFromMapPosition = new Tile();
          this.selectedTilesWithCtrl = [];
          this.copiedTiles = [];
          this.canvasCopiesToUndo = [];
          this.canvasCopiesToRedo = [];
     }

     cloneCanvas(oldCanvas: HTMLCanvasElement): HTMLCanvasElement {
          let newCanvas = document.createElement("canvas");
          let context = newCanvas.getContext("2d");

          newCanvas.width = oldCanvas.width;
          newCanvas.height = oldCanvas.height;

          context.drawImage(oldCanvas, 0, 0);

          return newCanvas;
     }

     saveCanvasToUndo(oldCanvas: HTMLCanvasElement) {
          if (this.canvasCopiesToUndo.length >= 5) this.canvasCopiesToUndo.pop();
          this.canvasCopiesToUndo.unshift(this.cloneCanvas(oldCanvas));
     }

     saveCanvasToRedo(oldCanvas: HTMLCanvasElement) {
          if (this.canvasCopiesToRedo.length >= 5) this.canvasCopiesToRedo.pop();
          this.canvasCopiesToRedo.unshift(this.cloneCanvas(oldCanvas));
     }
     undoChangesOnCanvas(_DOMElement: HTMLCanvasElement) {
          if (this.canvasCopiesToUndo.length > 0) {
               this.saveCanvasToRedo(_DOMElement);
               _DOMElement.getContext("2d").drawImage(this.canvasCopiesToUndo[0], 0, 0);
               this.canvasCopiesToUndo.shift();
          }
     }
     redoChangesOnCanvas(_DOMElement: HTMLCanvasElement) {
          if (this.canvasCopiesToRedo.length > 0) {
               this.saveCanvasToUndo(_DOMElement);
               _DOMElement.getContext("2d").drawImage(this.canvasCopiesToRedo[0], 0, 0);
               this.canvasCopiesToRedo.shift();
          }
     }

     mouseMoveOnCanvas(_DOMElement: HTMLCanvasElement, _drawGrid: Function) {
          _DOMElement.addEventListener("mousemove", (event) => {
               // coordinates snaped to grid
               let _x = event.offsetX - (event.offsetX % 24);
               let _y = event.offsetY - (event.offsetY % 24);

               // check if new coordinates
               if (this.lastMousePosition.x != _x || this.lastMousePosition.y != _y) {
                    //clear board from last select
                    _drawGrid();

                    //select new tile
                    _DOMElement.getContext("2d").strokeStyle = "red";
                    _DOMElement.getContext("2d").strokeRect(_x, _y, 24, 24);

                    //move coordinates to selected location
                    this.lastMousePosition.x = _x;
                    this.lastMousePosition.y = _y;
               }
          });
     }

     selectTile(_DOMElement: HTMLCanvasElement, _fillImage: Function) {
          _DOMElement.addEventListener("click", (event) => {
               _fillImage();
               let _x = event.offsetX - (event.offsetX % 24);
               let _y = event.offsetY - (event.offsetY % 24);

               _DOMElement.getContext("2d").strokeStyle = "white";
               _DOMElement.getContext("2d").lineWidth = 5;
               _DOMElement.getContext("2d").strokeRect(_x - 2, _y - 2, 26, 26);

               this.selectedTileFromCBPostition.x = _x;
               this.selectedTileFromCBPostition.y = _y;
          });
     }

     selectMultipleTiles(_DOMElement: HTMLCanvasElement, _Image: HTMLCanvasElement, _drawGrid: Function) {
          document.querySelector("body").addEventListener("keydown", (event) => {
               if (event.key == "Meta" || event.key == "Control") {
                    this.ctrlDown = true;
               } else if (event.key == "Delete") {
                    this.saveCanvasToUndo(_DOMElement);
                    _DOMElement.getContext("2d").fillStyle = "black";
                    if (this.ctrlDown) {
                         this.selectedTilesWithCtrl.forEach((tile: Tile) => {
                              _DOMElement.getContext("2d").fillRect(tile.x, tile.y, 24, 24);
                         });
                         this.selectedTilesWithCtrl = [];
                    } else {
                         _DOMElement.getContext("2d").fillRect(this.selectedTileFromMapPosition.x, this.selectedTileFromMapPosition.y, 24, 24);
                    }
               } else if (event.code == "KeyC" && this.ctrlDown) {
                    if (this.selectedTilesWithCtrl.length > 0) {
                         this.copiedTiles = this.selectedTilesWithCtrl;
                         this.selectedTilesWithCtrl = [];
                    }
               } else if (event.code == "KeyV" && this.ctrlDown) {
                    this.paste = true;
                    this.saveCanvasToUndo(_DOMElement);
               } else if (event.code == "KeyZ" && this.ctrlDown) {
                    this.undoChangesOnCanvas(_DOMElement);
               } else if (event.code == "KeyX" && this.ctrlDown) {
                    if (this.selectedTilesWithCtrl.length > 0) {
                         this.cutCanvas = this.cloneCanvas(_DOMElement);
                         this.saveCanvasToUndo(_DOMElement);
                         this.copiedTiles = this.selectedTilesWithCtrl;
                         this.selectedTilesWithCtrl.forEach((tile: Tile) => {
                              _DOMElement.getContext("2d").fillRect(tile.x, tile.y, 24, 24);
                         });
                         this.cut = true;
                         this.selectedTilesWithCtrl = [];
                    }
               } else if (event.code == "KeyY" && this.ctrlDown) {
                    this.redoChangesOnCanvas(_DOMElement);
               }
          });
          document.querySelector("body").addEventListener("keyup", (event) => {
               if (event.key == "Meta" || event.key == "Control") {
                    if (!this.paste) {
                         this.selectedTilesWithCtrl.forEach((tile: Tile) => {
                              _DOMElement.getContext("2d").drawImage(_Image, this.selectedTileFromCBPostition.x, this.selectedTileFromCBPostition.y, 24, 24, tile.x, tile.y, 24, 24);
                         });
                    }
                    this.ctrlDown = false;
                    this.selectedTilesWithCtrl = [];
               }
          });
          _DOMElement.addEventListener("contextmenu", (event) => {
               event.preventDefault();
          });
          _DOMElement.addEventListener("mousedown", (event) => {
               this.selectedTileFromMapPosition.x = event.offsetX - (event.offsetX % 24);
               this.selectedTileFromMapPosition.y = event.offsetY - (event.offsetY % 24);
               this.mouseDown = true;
          });
          _DOMElement.addEventListener("mousemove", (event) => {
               const _x = event.offsetX - (event.offsetX % 24);
               const _y = event.offsetY - (event.offsetY % 24);
               const xd = this.selectedTileFromMapPosition.x < _x ? this.selectedTileFromMapPosition.x : _x;
               const yd = this.selectedTileFromMapPosition.y < _y ? this.selectedTileFromMapPosition.y : _y;
               if (this.mouseDown) {
                    _drawGrid();
                    _DOMElement.getContext("2d").strokeStyle = "red";
                    for (let i = 0; i <= Math.abs(_x - this.selectedTileFromMapPosition.x) / 24; i++) {
                         for (let j = 0; j <= Math.abs(_y - this.selectedTileFromMapPosition.y) / 24; j++) {
                              _DOMElement.getContext("2d").strokeRect(i * 24 + xd, j * 24 + yd, 24, 24);
                         }
                    }
               }
               if (this.paste) {
                    _DOMElement.getContext("2d").drawImage(this.canvasCopiesToUndo[0], 0, 0);
                    this.copiedTiles.forEach((tile: Tile, i: number) => {
                         _DOMElement.getContext("2d").strokeRect(tile.x, tile.y, 24, 24);
                         _DOMElement.getContext("2d").strokeRect(_x + tile.x - this.copiedTiles[0].x, _y + tile.y - this.copiedTiles[0].y, 24, 24);
                         _DOMElement.getContext("2d").drawImage(this.cut ? this.cutCanvas : this.canvasCopiesToUndo[0], tile.x, tile.y, 24, 24, _x + tile.x - this.copiedTiles[0].x, _y + tile.y - this.copiedTiles[0].y, 24, 24);
                    });
               }
               if (this.ctrlDown) {
                    _DOMElement.getContext("2d").strokeStyle = "red";
                    this.selectedTilesWithCtrl.forEach((tile: Tile) => {
                         _DOMElement.getContext("2d").strokeRect(tile.x, tile.y, 24, 24);
                    });
               }
          });
          _DOMElement.addEventListener("mouseup", (event) => {
               this.mouseDown = false;
               const _x = event.offsetX - (event.offsetX % 24);
               const _y = event.offsetY - (event.offsetY % 24);
               const xd = this.selectedTileFromMapPosition.x < _x ? this.selectedTileFromMapPosition.x : _x;
               const yd = this.selectedTileFromMapPosition.y < _y ? this.selectedTileFromMapPosition.y : _y;

               if (this.paste) {
                    this.copiedTiles.forEach((tile: Tile, i: number) => {
                         _DOMElement.getContext("2d").drawImage(this.cut ? this.cutCanvas : this.canvasCopiesToUndo[0], tile.x, tile.y, 24, 24, _x + tile.x - this.copiedTiles[0].x, _y + tile.y - this.copiedTiles[0].y, 24, 24);
                    });
                    this.saveCanvasToUndo(_DOMElement);
                    this.copiedTiles = [];
                    this.paste = false;
                    this.cut = false;
               } else if (!this.ctrlDown) {
                    this.saveCanvasToUndo(_DOMElement);
                    for (let i = 0; i <= Math.abs(_x - this.selectedTileFromMapPosition.x) / 24; i++) {
                         for (let j = 0; j <= Math.abs(_y - this.selectedTileFromMapPosition.y) / 24; j++) {
                              _DOMElement.getContext("2d").drawImage(_Image, this.selectedTileFromCBPostition.x, this.selectedTileFromCBPostition.y, 24, 24, i * 24 + xd, j * 24 + yd, 24, 24);
                         }
                    }
               } else {
                    for (let i = 0; i <= Math.abs(_x - this.selectedTileFromMapPosition.x) / 24; i++) {
                         for (let j = 0; j <= Math.abs(_y - this.selectedTileFromMapPosition.y) / 24; j++) {
                              const x = i * 24 + xd;
                              const y = j * 24 + yd;
                              const index = this.selectedTilesWithCtrl.findIndex((tile: Tile) => tile.x == x && tile.y == y);
                              if (index == -1) {
                                   this.selectedTilesWithCtrl.push(new Tile(i * 24 + xd, j * 24 + yd));
                              } else {
                                   this.selectedTilesWithCtrl.splice(index, 1);
                              }
                         }
                    }
               }
          });
     }
}
