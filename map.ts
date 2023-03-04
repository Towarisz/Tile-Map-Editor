import Canvas from "./canvas";

export default class CanvasMap extends Canvas {
     constructor(_DOMElement: HTMLCanvasElement, _DOMParent: HTMLElement, _w: number, _h: number, _tileWidth: number, _tileHeight: number) {
          super(_DOMElement, _DOMParent, _w, _h, _tileWidth, _tileHeight);
     }

     drawGrid() {
          this.DOMElement.getContext("2d").strokeStyle = "#ffffff";
          for (let i = 0; i < this.width / this.tileWidth; i++) {
               for (let j = 0; j < this.height / this.tileHeight; j++) {
                    this.DOMElement.getContext("2d").strokeRect(i * this.tileWidth, j * this.tileHeight, 24, 24);
               }
          }
     }

     drawImage(canvas: HTMLCanvasElement, _x: number, _y: number, _xd: number, _yd: number): void {
          this.DOMElement.getContext("2d").drawImage(canvas, _x, _y, 24, 24, _xd, _yd, 24, 24);
     }
}
