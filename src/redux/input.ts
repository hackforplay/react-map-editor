import * as React from 'react';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { combineEpics } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import { ofAction } from './typescript-fsa-redux-observable';
import { Epic } from '.';

const actionCreator = actionCreatorFactory('react-map-editor/input');
export const actions = {
  mouseEnter: actionCreator<React.MouseEvent<HTMLElement>>('MOUSE_ENTER'),
  mouseLeave: actionCreator<React.MouseEvent<HTMLElement>>('MOUSE_LEAVE'),
  mouseDown: actionCreator<React.MouseEvent<HTMLElement>>('MOUSE_DOWN'),
  mouseMove: actionCreator<React.MouseEvent<HTMLElement>>('MOUSE_MOVE'),
  mouseUp: actionCreator<React.MouseEvent<HTMLElement>>('MOUSE_UP'),
  drag: actionCreator<React.MouseEvent<HTMLElement>>('DRAG')
};

export interface State {
  isPressed: boolean;
}
const initialState: State = {
  isPressed: false
};

export default reducerWithInitialState(initialState)
  .case(actions.mouseDown, state => ({ ...state, isPressed: true }))
  .case(actions.mouseUp, state => ({ ...state, isPressed: false }));

const mouseDownEpic: Epic = action$ =>
  action$.pipe(
    ofAction(actions.mouseDown),
    map(action => actions.drag(action.payload))
  );

const mouseMoveEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(actions.mouseMove),
    filter(() => state$.value.input.isPressed),
    map(action => actions.drag(action.payload))
  );

export const epics = combineEpics(mouseDownEpic, mouseMoveEpic);
