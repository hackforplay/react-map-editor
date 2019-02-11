import * as React from 'react';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { map, mergeMap, filter, distinctUntilChanged } from 'rxjs/operators';
import { Scene, SceneMap, Table, Square, Placement } from '@hackforplay/next';
import { cloneDeep, flattenDepth } from 'lodash';
import { ofAction } from './typescript-fsa-redux-observable';
import { Epic, input } from '.';
import Cursor from '../utils/cursor';

const actionCreator = actionCreatorFactory('react-map-editor/canvas');
export const actions = {
  initMap: actionCreator<SceneMap>('INIT_MAP'),
  draw: actionCreator<Cursor>('DRAW'),
  set: actionCreator<SceneMap>('SET')
};

export interface State extends SceneMap {}
const initialState: State = init();

export default reducerWithInitialState(initialState)
  .case(actions.initMap, (state, payload) => payload)
  .case(actions.set, (state, payload) => payload);

const dragEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(input.actions.drag),
    map(action => {
      const e = action.payload.event;
      const { mode } = state$.value;
      return new Cursor(
        ((e.clientX - e.currentTarget.offsetLeft) / 32) >> 0, // TODO: unit=32px に依存しない位置参照(@hackforplay/next)に
        ((e.clientY - e.currentTarget.offsetTop) / 32) >> 0,
        state$.value.mode.cursorMode,
        mode.nib,
        action.payload.id
      );
    }),
    filter(cursor => cursor.mode !== 'nope'),
    distinctUntilChanged((x, y) => x.isEqual(y)),
    map(pen => actions.draw(pen))
  );

const penEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(actions.draw),
    filter(action => action.payload.mode === 'pen'),
    map(action => {
      let { tables, squares } = state$.value.canvas;
      const { nib } = action.payload;
      if (!nib) throw new Error('Nib is null');
      let addFlag = false;
      for (const item of flattenDepth<Square>(nib, 2)) {
        if (squares.every(s => s.index !== item.index)) {
          addFlag = true;
          squares = squares.concat(item);
        }
      }
      return {
        tables: draw(tables, action.payload),
        squares
      };
    }),
    map(map => actions.set(map))
  );

const eraserEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(actions.draw),
    filter(action => action.payload.mode === 'eraser'),
    map(action => {
      const { tables, squares } = state$.value.canvas;
      return {
        tables: draw(tables, action.payload),
        squares
      };
    }),
    map(map => actions.set(map))
  );

export const epics = combineEpics(dragEpic, penEpic, eraserEpic);

/**
 * ３次元配列を置き換える.
 * @param origin 元の３次元配列
 * @param cursor 置き換える Cursor
 */
export function draw(origin: number[][][], cursor: Cursor) {
  switch (cursor.mode) {
    case 'pen':
      if (!cursor.nib) return origin;
      const result = cloneDeep(origin);
      cursor.nib.forEach((row, y) =>
        row.forEach((square, x) => {
          const layer = autoLayer(square.placement);
          const X = cursor.x + x;
          const Y = cursor.y + y;
          if (
            layer < result.length &&
            Y < result[layer].length &&
            X < result[layer][Y].length
          ) {
            result[layer][Y][X] = square.index;
          }
        })
      );
      return result;
    case 'eraser':
      for (const [layer, table] of origin.entries()) {
        if (table[cursor.y][cursor.x] > -1) {
          // 空白じゃないマスを見つけた.
          // しかし, オートレイヤー状態では一番下のレイヤーは消せない
          if (layer !== origin.length - 1) {
            const result = cloneDeep(origin);
            result[layer][cursor.y][cursor.x] = -888; // ４桁にしたい
            return result;
          }
        }
      }
      return origin; // 見つからなかった
    case 'nope':
      return origin;
  }
}

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
