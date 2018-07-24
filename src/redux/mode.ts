import * as React from 'react';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { combineEpics } from 'redux-observable';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';
import { Square } from '@hackforplay/next';
import {
  ofAction,
  ofActionWithPayload
} from './typescript-fsa-redux-observable';
import { Epic, palette } from '.';
import { CursorMode } from '../utils/cursor';
import { getMatrix } from '../utils/selection';

const actionCreator = actionCreatorFactory('react-map-editor/mode');
export const actions = {
  setPen: actionCreator('USE_PEN'),
  setEraser: actionCreator('USE_ERASER'),
  setNib: actionCreator<Square[][]>('SET_NIB')
};

export interface State {
  cursorMode: CursorMode;
  nib: Square[][] | null;
}
const initialState: State = {
  cursorMode: 'nope',
  nib: null
};

export default reducerWithInitialState(initialState)
  .case(actions.setPen, state => ({
    ...state,
    cursorMode: state.nib ? 'pen' : 'nope'
  }))
  .case(actions.setEraser, state => ({ ...state, cursorMode: 'eraser' }))
  .case(actions.setNib, (state, payload) => ({
    ...state,
    nib: payload,
    cursorMode: 'pen'
  }));

const nibEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofActionWithPayload(palette.actions.setSelection),
    map(action => {
      const { tileSet } = state$.value.palette;
      const matrix = getMatrix(action.payload);
      const nib = matrix.map(row => row.map(num => tileSet[num]));
      return actions.setNib(nib);
    })
  );

export const epics = combineEpics(nibEpic);
