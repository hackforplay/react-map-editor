import { Scene } from '@hackforplay/next';
import produce from 'immer';
import Cursor from './cursor';

export const updateScene = produce(
  ({ map: { tables, squares } }: Scene, cursor: Cursor) => {
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
          // オートレイヤー
          if (tile.placement.type === 'Ground') {
            // Ground だけは例外的に最も下のレイヤーに塗り重ねる
            tables[bottom][Y][X] = tile.index;
          } else {
            // 上のレイヤーから塗っていく. 既存のレイヤーは Ground 以外を下にずらし, FIFO.
            if (tables[0][Y][X] === tile.index) continue; // 同じタイル
            for (let layer = bottom - 1; layer > 0; layer--) {
              const above = tables[layer - 1][Y][X];
              if (above > 0) {
                tables[layer][Y][X] = above;
              }
            }
            tables[0][Y][X] = tile.index;
          }

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
      for (const [layer, table] of tables.entries()) {
        const tableRow = table && table[cursor.y];
        const index = tableRow && tableRow[cursor.x];
        if (index > -1) {
          // 空白じゃないマスを見つけた.
          // しかし, オートレイヤー状態では一番下のレイヤーは消せない
          if (layer < bottom) {
            tableRow[cursor.x] = -88888; // ６桁にしたい
            break;
          }
        }
      }
    }
  }
);