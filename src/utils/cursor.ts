import { style } from 'typestyle/lib';
import { ITile } from '../redux/palette';

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
    cursor: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAKJJREFUOBFjYCAPuAO1PQbiLvK0Q3R5AKkfQPwfiieDhFlABInAEKieHUlPDpD9HYlPkAlySTxUVS2QhrkIRIO8SRSAeecvUHUCVAfMMJA3QWFGEMAMgbkA2bBKoG6QPEGAbgiyYfEEdUMV4DIEZBjIOxS5ZNQQ1EQGiyH6BiwoppEzIMwVJMUOyBAQQNYMYxPtHYgREBKmGUaTZQi6i8g2BAD572i5ZpqAbwAAAABJRU5ErkJggg==) 0 24, crosshair`
  }),
  eraser: style({
    cursor: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAKRJREFUOBFjYCAD/P//3wOIfwAxHJBsDFAnhiEg00gyCJchJBmEzxCg3A+iXETIEJA8QYNGDcEMogEPEyY0N0kA+axoYiDuTyAOYGRk3IFFDiEE9U4lSATITgDiv0AMA6A8RVQ6cQcqhGXAWjTDiDMEqukxzGoojWwYYZeADAEBoOYuNINAXLA3ISpIIIEaJyMZRrx3sNkBNAjkMpA33bHJExIDABX14Dr452agAAAAAElFTkSuQmCC) 0 24, crosshair`
  })
};
