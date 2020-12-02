import { style } from 'typestyle/lib';
import { dropper, eraser, pen } from '../cursors';
import { ITile } from '../recoils/types';

export type CursorMode = 'nope' | 'pen' | 'eraser' | 'base' | 'dropper';

export default class Cursor {
  x: number;
  y: number;
  mode: CursorMode;
  nib: ITile[][] | null;
  _layer: number | null = null;
  dragId: number;
  eraserWidth: number;

  constructor(
    x: number,
    y: number,
    mode: CursorMode,
    nib: ITile[][] | null,
    dragId: number,
    eraserSize = 1
  ) {
    this.x = x;
    this.y = y;
    this.mode = mode;
    this.nib = nib;
    this.dragId = dragId;
    this.eraserWidth = eraserSize;

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
      this.dragId === other.dragId &&
      this.eraserWidth === other.eraserWidth
    );
  }
}

export const cursorClasses: Record<CursorMode, string> = {
  nope: style({
    cursor: 'not-allowed'
  }),
  pen: style({
    cursor: `url(${pen}), pointer`
  }),
  eraser: style({
    cursor: `url(${eraser}), pointer`
  }),
  base: style({
    cursor: 'not-allowed'
  }),
  dropper: style({
    cursor: `url(${dropper}) 2 16, pointer`
  })
};
