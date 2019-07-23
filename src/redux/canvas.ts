import { SceneMap } from '@hackforplay/next';
import produce from 'immer';
import { combineEpics } from 'redux-observable';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import Cursor from '../utils/cursor';

const actionCreator = actionCreatorFactory('react-map-editor/canvas');
export const actions = {
  initMap: actionCreator<SceneMap>('INIT_MAP'),
  draw: actionCreator<Cursor>('DRAW'),
  set: actionCreator<SceneMap>('SET')
};

export interface State extends SceneMap {}
const initialState: State = init();

export const draw = produce(({ tables, squares }: SceneMap, cursor: Cursor) => {
  if (!cursor.nib || !Array.isArray(tables)) return;
  const bottom = tables.length - 1; // 最下層のレイヤー

  if (cursor.mode === 'pen') {
    for (const [y, row] of cursor.nib.entries()) {
      for (const [x, tile] of row.entries()) {
        if (tile.placement.type === 'Nope') continue; // skip
        const X = cursor.x + x;
        const Y = cursor.y + y;
        try {
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
        } catch (error) {
          // 領域外
          continue;
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
          tableRow[cursor.x] = -888; // ４桁にしたい
          break;
        }
      }
    }
  }
});

export default reducerWithInitialState(initialState)
  .case(actions.initMap, (state, payload) => payload)
  .case(actions.set, (state, payload) => payload)
  .case(actions.draw, draw);

export const epics = combineEpics();

/**
 * マップの初期値
 */
export function init(): SceneMap {
  const row = () => Array.from({ length: 10 }).map(() => -1);
  const table = () => Array.from({ length: 10 }).map(() => row());

  return {
    base: -1,
    tables: [table(), table(), table()],
    squares: []
  };
}
