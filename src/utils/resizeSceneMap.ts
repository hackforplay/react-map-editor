import produce, { Patch } from 'immer';
import { IEditing } from '../recoils/types';

/**
 * マップの大きさを変更する
 * @param editing state
 * @param rows 新しい行の数
 * @param cols 新しい列の数
 */
export function resizeSceneMap(
  editing: IEditing,
  rows: number,
  cols: number
): IEditing {
  let patches: Patch[] = [];

  const sceneMap = produce(
    editing.sceneMap,
    draft => {
      for (const table of draft.tables) {
        const diffRows = rows - table.length;
        if (diffRows > 0) {
          // 足りない行を追加
          for (let y = 0; y < diffRows; y++) {
            table.push(Array.from({ length: cols }).map(() => -1));
          }
        }
        if (diffRows < 0) {
          // 多い行を削る
          table.length = rows;
        }

        for (const row of table) {
          const diffCols = cols - row.length;
          if (diffCols > 0) {
            // 足りない列を追加
            for (let x = 0; x < diffCols; x++) {
              row.push(-1);
            }
          }
          if (diffCols < 0) {
            // 多い列を削る
            row.length = cols;
          }
        }
      }
    },
    (_, invertPatches) => {
      patches = invertPatches;
    }
  );

  if (patches.length === 0) {
    return editing;
  }

  return {
    sceneMap,
    undoPatches: editing.undoPatches.concat({
      patches
    })
  };
}
