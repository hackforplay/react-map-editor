import { Square } from '@hackforplay/next';

export type CursorMode = 'nope' | 'pen' | 'eraser';

export default class Cursor {
  x: number;
  y: number;
  mode: CursorMode;
  nib: Square[][] | null;
  _layer: number | null = null;
  dragId: number;

  constructor(
    x: number,
    y: number,
    mode: CursorMode,
    nib: Square[][] | null,
    dragId: number
  ) {
    this.x = x;
    this.y = y;
    this.mode = mode;
    this.nib = nib;
    this.dragId = dragId;

    if (this.mode === 'pen' && this.nib === null) {
      this.mode = 'nope';
    }
  }

  isEqual(other: Cursor) {
    return (
      this.x === other.x &&
      this.y === other.y &&
      this.mode === other.mode &&
      this.nib === other.nib &&
      this.dragId === other.dragId
    );
  }
}
