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
    ofAction(palette.actions.setSelection),
    filter(action => action.payload !== null),
    map(action => {
      if (!action.payload) throw 'nope';
      const { start, end } = action.payload;
      const nib = state$.value.palette.tileSet[end.num];
      if (!nib) throw new Error('Invalid selection');
      return actions.setNib(nib);
    })
  );

export const epics = combineEpics(nibEpic);
