import Canvas from "./canvas";

export default class CanvasChoosingBoard extends Canvas {
     constructor(_DOMElement: HTMLCanvasElement, _DOMParent: HTMLElement, _w: number, _h: number, _tileWidth: number, _tileHeight: number) {
          super(_DOMElement, _DOMParent, _w, _h, _tileWidth, _tileHeight);
     }

     // Fill board with image
     fillBoard(_Image: HTMLImageElement): void {
          this.DOMElement.getContext("2d").drawImage(_Image, 0, 0, _Image.width / 2, _Image.height, 0, 0, _Image.width / 4, _Image.height / 2);
          this.DOMElement.getContext("2d").drawImage(_Image, _Image.width / 2, 0, _Image.width / 2, _Image.height, 0, _Image.height / 2, _Image.width / 4, _Image.height / 2);
     }
}
