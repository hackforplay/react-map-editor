import * as React from 'react';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { combineEpics } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import { Square } from '@hackforplay/next';
import { ofAction } from './typescript-fsa-redux-observable';
import { Epic, palette } from '.';
import { CursorMode } from '../utils/cursor';

const actionCreator = actionCreatorFactory('react-map-editor/mode');
export const actions = {
  setPen: actionCreator('USE_PEN'),
  setEraser: actionCreator('USE_ERASER'),
  setNib: actionCreator<Square>('SET_NIB')
};

export interface State {
  cursorMode: CursorMode;
  nib: Square | null;
}
const initialState: State = {
  cursorMode: 'pen',
  nib: null
};

export default reducerWithInitialState(initialState)
  .case(actions.setPen, state => ({ ...state, cursorMode: 'pen' }))
  .case(actions.setEraser, state => ({ ...state, cursorMode: 'eraser' }))
  .case(actions.setNib, (state, payload) => ({ ...state, nib: payload }));

const nibEpic: Epic = action$ =>
  action$.pipe(
    ofAction(palette.actions.mousedown),
    map(action => actions.setNib(action.payload))
  );

const setPenWhenSetNibEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(actions.setNib),
    filter(() => state$.value.mode.cursorMode === 'eraser'),
    map(() => actions.setPen())
  );

export const epics = combineEpics(nibEpic, setPenWhenSetNibEpic);
