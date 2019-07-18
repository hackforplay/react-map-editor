import { Placement, SceneMap } from '@hackforplay/next';
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

  if (cursor.mode === 'pen') {
    for (const [y, row] of cursor.nib.entries()) {
      for (const [x, tile] of row.entries()) {
        // drawing
        const layer = autoLayer(tile.placement);
        const X = cursor.x + x;
        const Y = cursor.y + y;

        const table = tables && tables[layer];
        const tableRow = table && table[Y];
        if (0 <= X && X < tableRow.length) {
          tableRow[X] = tile.index;
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
        if (layer !== tables.length - 1) {
          tableRow[cursor.x] = -888; // ４桁にしたい
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
    tables: [table(), table(), table()],
    squares: []
  };
}

function autoLayer(placement: Placement): number {
  switch (placement.type) {
    case 'Nope':
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
