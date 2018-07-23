import { Square, Placement } from '@hackforplay/next';

export type PenMode = 'pen' | 'eraser';

export default class Pen {
  x: number;
  y: number;
  mode: PenMode;
  nib: Square | null;
  _layer: number | null = null;
  dragId: number;

  constructor(
    x: number,
    y: number,
    mode: PenMode,
    nib: Square | null,
    dragId: number
  ) {
    this.x = x;
    this.y = y;
    this.mode = mode;
    this.nib = nib;
    this.dragId = dragId;
  }

  isEqual(other: Pen) {
    return (
      this.x === other.x &&
      this.y === other.y &&
      this.mode === other.mode &&
      this.nib === other.nib &&
      this.dragId === other.dragId
    );
  }

  /**
   * mode==='pen'の場合: 現在の nib に対して最適なレイヤーを決定する (オートレイヤー機能)
   * mode==='eraser'の場合: layer にセットされた値を返す
   */
  get layer(): number {
    if (this.mode === 'pen') {
      if (!this.nib) {
        throw new Error(`Auto layer is failed. nib is null`);
      }
      return autoLayer(this.nib.placement);
    } else {
      if (this._layer === null) {
        throw new Error(`No layer set. Do 'pen.layer = 0;'`);
      }
      return this._layer;
    }
  }

  set layer(value: number) {
    this._layer = value;
  }

  get index(): number {
    return this.mode === 'pen' && this.nib ? this.nib.index : -88; // とりあえず３桁にしたい
  }

  /**
   * ペンツールが選択されているのにペン先がない
   */
  get disabled(): boolean {
    return this.mode === 'pen' && this.nib === null;
  }
}

function autoLayer(placement: Placement): number {
  switch (placement.type) {
    case 'Ground':
      return 2;
    case 'Wall':
    case 'Road':
    case 'Rug':
    case 'Barrier':
      return 1;
    case 'Float':
    case 'Sky':
      return 0;
  }
}
