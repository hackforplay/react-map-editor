import * as React from 'react';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { combineEpics } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import { ofAction } from './typescript-fsa-redux-observable';
import { Epic } from '.';

export type PenMode = 'pen' | 'eraser';

const actionCreator = actionCreatorFactory('react-map-editor/mode');
export const actions = {
  setPen: actionCreator('USE_PEN'),
  setEraser: actionCreator('USE_ERASER')
};

export interface State {
  penMode: PenMode;
}
const initialState: State = {
  penMode: 'eraser'
};

export default reducerWithInitialState(initialState)
  .case(actions.setPen, state => ({ ...state, penMode: 'pen' }))
  .case(actions.setEraser, state => ({ ...state, penMode: 'eraser' }));

export const epics = combineEpics();
