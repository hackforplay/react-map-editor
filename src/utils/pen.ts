export default class Pen {
  x: number;
  y: number;
  layer: number;
  index: number;

  constructor(x: number, y: number, layer: number, index: number) {
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.index = index;
  }

  isEqual(other: Pen) {
    return (
      this.x === other.x &&
      this.y === other.y &&
      this.layer === other.layer &&
      this.index === other.index
    );
  }
}
