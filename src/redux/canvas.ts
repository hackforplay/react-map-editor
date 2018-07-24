import * as React from 'react';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { map, mergeMap, filter, distinctUntilChanged } from 'rxjs/operators';
import { Scene, SceneMap, Table, Square } from '@hackforplay/next';
import { ofAction } from './typescript-fsa-redux-observable';
import { Epic, input } from '.';
import Pen from '../utils/pen';

const actionCreator = actionCreatorFactory('react-map-editor/canvas');
export const actions = {
  initMap: actionCreator<SceneMap>('INIT_MAP'),
  draw: actionCreator<Pen>('DRAW'),
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
      return new Pen(
        ((e.clientX - e.currentTarget.offsetLeft) / 32) >> 0, // TODO: unit=32px に依存しない位置参照(@hackforplay/next)に
        ((e.clientY - e.currentTarget.offsetTop) / 32) >> 0,
        state$.value.mode.penMode,
        mode.nib,
        action.payload.id
      );
    }),
    filter(pen => !pen.disabled),
    distinctUntilChanged((x, y) => x.isEqual(y)),
    filter(pen => {
      // 更新の必要があるかどうかをチェックする
      const { tables } = state$.value.canvas;

      if (pen.mode === 'pen') {
        const current = tables[pen.layer][pen.y][pen.x];
        return pen.index !== current;
      } else {
        const topIndex = tables.findIndex(table => table[pen.y][pen.x] > -1);
        if (topIndex < 0) return false;
        if (topIndex === tables.length - 1) return false; // オートレイヤー状態では一番下のレイヤーは消せない
        pen.layer = topIndex;
        return true;
      }
    }),
    map(pen => actions.draw(pen))
  );

const penEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(actions.draw),
    filter(action => action.payload.mode === 'pen'),
    map(action => {
      const { tables, squares } = state$.value.canvas;
      const { nib } = action.payload;
      if (!nib) throw new Error('Nib is null');
      const add = squares.every(s => s.index !== nib.index);
      return {
        tables: mapArray3d(tables, [action.payload]),
        squares: add ? squares.concat(nib) : squares
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
        tables: mapArray3d(tables, [action.payload]),
        squares
      };
    }),
    map(map => actions.set(map))
  );

export const epics = combineEpics(dragEpic, penEpic, eraserEpic);

/**
 * ３次元配列を愚直に回して置き換える. もっとマシな方法を @hackforplay/next で実装したい
 * @param origin 元の３次元配列
 * @param pens 置き換える Pen の配列
 */
function mapArray3d(origin: number[][][], pens: Pen[]) {
  const result = [];
  for (let layer = 0; layer < origin.length; layer++) {
    const table = origin[layer];
    for (let y = 0; y < table.length; y++) {
      const row = table[y];
      for (let x = 0; x < row.length; x++) {
        let element = row[x];
        for (let i = 0; i < pens.length; i++) {
          if (pens[i].x === x && pens[i].y === y && pens[i].layer === layer) {
            element = pens[i].index;
            break;
          }
        }
        row[x] = element;
      }
      table[y] = row;
    }
    result[layer] = table;
  }
  return result;
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
