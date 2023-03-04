import Tile from "./tile";

export default class Canvas {
     protected width: number;
     protected height: number;
     protected tileWidth: number;
     protected tileHeight: number;
     protected DOMElement: HTMLCanvasElement;

     constructor(_DOMElement: HTMLCanvasElement, _DOMParent: HTMLElement, _w: number, _h: number, _tileWidth: number, _tileHeight: number) {
          // Setting canvas variables
          this.width = _w;
          this.height = _h;
          this.DOMElement = _DOMElement;
          this.tileHeight = _tileHeight;
          this.tileWidth = _tileWidth;

          // Setting canvas DOMElement properties
          this.DOMElement.width = this.width;
          this.DOMElement.height = this.height;
          this.DOMElement.getContext("2d").fillRect(0, 0, this.width, this.height);
          // Appending canvas DOMElement To DOMParent
          _DOMParent.appendChild(this.DOMElement);
     }

     getDOMElement() {
          return this.DOMElement;
     }
}
