import { Square } from '@hackforplay/next';

export type PenMode = 'pen' | 'eraser';

export default class Pen {
  x: number;
  y: number;
  mode: PenMode;
  nib: Square | null;

  constructor(x: number, y: number, mode: PenMode, nib: Square | null) {
    this.x = x;
    this.y = y;
    this.mode = mode;
    this.nib = nib;
  }

  isEqual(other: Pen) {
    return (
      this.x === other.x &&
      this.y === other.y &&
      this.mode === other.mode &&
      this.nib === other.nib
    );
  }

  /**
   * TODO: palette.selected が指すタイルの placement によって決定 (オートタイル機能)
   */
  get layer(): number {
    return 0;
  }

  get index(): number {
    return this.nib ? this.nib.index : -88; // とりあえず３桁にしたい
  }

  /**
   * ペンツールが選択されているのにペン先がない
   */
  get disabled(): boolean {
    return this.mode === 'pen' && this.nib === null;
  }
}
