//reducer
import { createStore, applyMiddleware } from 'redux';

import actionCreatorFactory, { Action } from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { combineEpics, ActionsObservable } from 'redux-observable';
import { filter, map, mapTo, mergeMap, delay } from 'rxjs/operators';
import { StateObservable } from 'redux-observable';
import { Square } from '@hackforplay/next';
import { ofAction } from './typescript-fsa-redux-observable';

const actionCreator = actionCreatorFactory('react-map-editor/palette');
export const actions = {
  mousedown: actionCreator<Square>('MOUSE_DOWN'),
  select: actionCreator<Square>('SELECT')
};

export interface State {
  selected: Square | null;
}
const initialState: State = {
  selected: null
};

export default reducerWithInitialState(initialState).case(
  actions.select,
  (state, payload) => ({ ...state, selected: payload })
);

const paletteMousedownEpic = (actions$: ActionsObservable<Action<Square>>) =>
  actions$.pipe(
    ofAction(actions.mousedown),
    map(action => actions.select(action.payload))
  );

export const epics = combineEpics(paletteMousedownEpic);
