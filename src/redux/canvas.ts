import { Scene } from '@hackforplay/next';
import produce from 'immer';
import { combineEpics } from 'redux-observable';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import Cursor from '../utils/cursor';
import { initScene } from '../utils/initScene';
import { updateScene } from '../utils/updateScene';

const actionCreator = actionCreatorFactory('react-map-editor/canvas');
export const actions = {
  shallowSet: actionCreator<Partial<Scene>>('SHALLOW_SET'),
  draw: actionCreator<Cursor>('DRAW')
};

export interface State extends Scene {}
const initialState: State = initScene();

export default reducerWithInitialState(initialState)
  .case(
    actions.shallowSet,
    produce((state: Scene, payload: Partial<Scene>) => {
      Object.assign(state, payload);
    })
  )
  .case(actions.draw, updateScene);

export const epics = combineEpics();
