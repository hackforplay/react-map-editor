import { Placement, Scene, TileAuthor } from '@hackforplay/next';
import { Patch } from 'immer';

export interface IEditPatch {
  /**
   * １回のドラッグ（スワイプ）によって行われた変更をグルーピングするための識別子
   */
  dragId?: number;
  patches: Patch[];
}

/**
 * 現在の状態と undo のヒストリーをアトミックに変更するための
 * インターフェース
 */
export interface IEditing {
  sceneMap: Scene['map'];
  /**
   * ImmerJS の invertPatches を記録したヒストリー
   * 新しいものをどんどん末尾に追加していく
   * Cursor::dragId ごとにマージする
   */
  undoPatches: IEditPatch[];
}

export interface ITile {
  /**
   * 全てのタイルで一意な番号。 IPage["index"] * 100 + number で求められる
   */
  index: number;
  /**
   * このタイルだけの画像 URL
   */
  src: string;
  placement: Placement;
  author: TileAuthor;
}

export interface IPage {
  /**
   * 全てのページで一意な番号。最大値はないが、欠番は存在する
   */
  index: number;
  /**
   * PaletteView で使うページ全体の画像 URL
   */
  src: string;
  /**
   * ページの行数。タイルの枚数が 100 を超えるとタイルの index が一意にならなくなるので、最大値は 12
   */
  row: number;
  /**
   * ページに含まれるタイルの情報。number は、左上が 0 で、その下は 8 である
   * undefined の場合は、透明な Nope タイルとして扱う
   */
  tiles: {
    [number: string]: ITile | undefined;
  };
}
