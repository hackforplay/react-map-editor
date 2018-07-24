import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { combineEpics, ActionsObservable } from 'redux-observable';
import { defer, from } from 'rxjs';
import { map, first, mergeMap, catchError } from 'rxjs/operators';
import { StateObservable } from 'redux-observable';
import { Square, SceneAssets, loadImages, Scene } from '@hackforplay/next';
import { ofAction } from './typescript-fsa-redux-observable';
import { Epic } from '.';
import pipoya from '../tilesets/pipoya';

const actionCreator = actionCreatorFactory('react-map-editor/palette');
export const actions = {
  mousedown: actionCreator<Square>('MOUSE_DOWN'),
  addTileset: actionCreator<Square[]>('ADD_TILESET')
};

export interface State {
  tileSet: Square[];
}
const initialState: State = {
  tileSet: [] as Square[]
};

export default reducerWithInitialState(initialState).case(
  actions.addTileset,
  (state, payload) => ({ ...state, tileSet: [...state.tileSet, ...payload] })
);

export const epics = combineEpics();
