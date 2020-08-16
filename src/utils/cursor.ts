import { style } from 'typestyle/lib';
import { ITile } from '../recoils/types';

export type CursorMode = 'nope' | 'pen' | 'eraser';

export default class Cursor {
  x: number;
  y: number;
  mode: CursorMode;
  nib: ITile[][] | null;
  _layer: number | null = null;
  dragId: number;

  constructor(
    x: number,
    y: number,
    mode: CursorMode,
    nib: ITile[][] | null,
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

export const cursorClasses: Record<CursorMode, string> = {
  nope: style({
    cursor: 'not-allowed'
  }),
  pen: style({
    cursor: `url(${require('../cursors/pen.png')}), pointer`
  }),
  eraser: style({
    cursor: `url(${require('../cursors/eraser.png')}), pointer`
  })
};
