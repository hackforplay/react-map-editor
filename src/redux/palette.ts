import { Square } from '@hackforplay/next';
import { values } from 'lodash';
import { combineEpics } from 'redux-observable';
import { map } from 'rxjs/operators';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { Epic } from '.';
import { Selection } from '../utils/selection';
import { ofAction } from './typescript-fsa-redux-observable';

const actionCreator = actionCreatorFactory('react-map-editor/palette');
export const actions = {
  setSelection: actionCreator<Selection | null>('SET_SELECTION'),
  addTileset: actionCreator<Square[]>('ADD_TILESET'),
  setTilesetMap: actionCreator<{ [key: number]: Square }>('SET_TILESET_MAP')
};

export interface State {
  tileSet: Square[];
  tileSetMap: { [key: number]: Square };
  selection: Selection | null;
}

const initialState: State = {
  tileSet: [] as Square[],
  tileSetMap: {},
  selection: null
};

export default reducerWithInitialState(initialState)
  .case(actions.setTilesetMap, (state, payload) => ({
    ...state,
    tileSetMap: payload,
    tileSet: values(payload)
  }))
  .case(actions.setSelection, (state, payload) => ({
    ...state,
    selection: payload
  }));

const addTilesetEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(actions.addTileset),
    map(action => action.payload.map(square => ({ [square.index]: square }))),
    map(array =>
      Object.assign({ ...state$.value.palette.tileSetMap }, ...array)
    ),
    map(tilesetMap => actions.setTilesetMap(tilesetMap))
  );

export const epics = combineEpics(addTilesetEpic);
