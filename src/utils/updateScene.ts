import { Scene } from '@hackforplay/next';
import produce, { Patch } from 'immer';
import { last } from 'lodash-es';
import { IEditing, IEditPatch } from '../recoils/types';
import Cursor from './cursor';

/**
 * カーソルに応じた変更をマップに加える
 * immer を使うことで変更の履歴を生成する
 * 変更がない場合は履歴を追加しない
 */
export function editWithCursor(editing: IEditing, cursor: Cursor) {
  const invertPatches: Patch[] = [];
  const next = produce(
    editing.sceneMap,
    draft => {
      const { tables, squares } = draft;
      if (!cursor.nib || !Array.isArray(tables)) return;
      const bottom = tables.length - 1; // 最下層のレイヤー
      const height = tables && tables[0].length;
      const width = tables && tables[0] && tables[0][0].length;

      if (cursor.mode === 'pen') {
        for (const [y, row] of cursor.nib.entries()) {
          for (const [x, tile] of row.entries()) {
            if (tile.placement.type === 'Nope') continue; // skip
            const X = cursor.x + x;
            const Y = cursor.y + y;
            const contains = 0 <= X && X < width && 0 <= Y && Y < height;
            if (!contains) continue; // 領域外
            // 上のレイヤーから塗っていく. 既存のレイヤーを下にずらし, FIFO.
            if (tables[0][Y][X] === tile.index) continue; // 同じタイル
            for (let layer = bottom; layer > 0; layer--) {
              const above = tables[layer - 1][Y][X];
              if (above > 0) {
                tables[layer][Y][X] = above;
              }
            }
            tables[0][Y][X] = tile.index;

            // add tile info
            if (squares.every(s => s.index !== tile.index)) {
              squares.push({
                index: tile.index,
                placement: tile.placement,
                tile: {
                  size: [32, 32],
                  image: {
                    type: 'url',
                    src: tile.src
                  },
                  author: tile.author
                }
              });
            }
          }
        }
      }

      if (cursor.mode === 'eraser') {
        for (let dy = 0; dy < cursor.eraserWidth; dy++) {
          for (let dx = 0; dx < cursor.eraserWidth; dx++) {
            for (const table of tables.values()) {
              const tableRow = table?.[cursor.y + dy];
              const index = tableRow?.[cursor.x + dx];
              if (index === undefined) {
                break;
              }
              if (index > -1) {
                tableRow[cursor.x + dx] = -1;
                break;
              }
            }
          }
        }
      }
    },
    (_, _invertPatches) => {
      invertPatches.push(..._invertPatches);
    }
  );
  return {
    sceneMap: next,
    undoPatches: mergeUndoPatches(
      editing.undoPatches,
      invertPatches,
      cursor.dragId
    )
  };
}

export const updateScene = (scene: Scene, cursor: Cursor) => {
  const { sceneMap } = editWithCursor(
    { sceneMap: scene.map, undoPatches: [] },
    cursor
  );
  return sceneMap === scene.map ? scene : { ...scene, map: sceneMap };
};

function mergeUndoPatches(
  undoPatches: IEditPatch[],
  invertPatches: Patch[],
  dragId?: number
) {
  if (invertPatches.length === 0) {
    return undoPatches; // 変更がない
  }
  const lastUndo = last(undoPatches);
  if (dragId === undefined || !lastUndo || lastUndo.dragId !== dragId) {
    // ユニットを追加
    return undoPatches.concat({
      dragId,
      patches: invertPatches
    });
  }

  // 末尾のユニットにパッチを追加
  return undoPatches.slice(0, undoPatches.length - 1).concat({
    dragId,
    patches: lastUndo.patches.concat(invertPatches)
  });
}
