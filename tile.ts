interface tile{
     x: number;
     y:number ;
}

export default class Tile implements tile{
     x: number;
     y: number ;
     constructor(_x: number = -100, _y: number = -100) {
          this.x = _x;
          this.y = _y;
     }
}
