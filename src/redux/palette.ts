import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { combineEpics, ActionsObservable } from 'redux-observable';
import { defer, from } from 'rxjs';
import { map, mergeMap, filter } from 'rxjs/operators';
import { StateObservable } from 'redux-observable';
import { values } from 'lodash';
import { Square, SceneAssets, loadImages, Scene } from '@hackforplay/next';
import { ofAction } from './typescript-fsa-redux-observable';
import { Epic } from '.';

const actionCreator = actionCreatorFactory('react-map-editor/palette');
export const actions = {
  mousedown: actionCreator<Square>('MOUSE_DOWN'),
  startSelection: actionCreator<Pos>('START_SELECTION'),
  updateSelection: actionCreator<Pos>('UPDATE_SELECTION'),
  confirmSelection: actionCreator('CONFIRM_SELECTION'),
  setSelection: actionCreator<Selection | null>('SET_SELECTION'),
  addTileset: actionCreator<Square[]>('ADD_TILESET'),
  setTilesetMap: actionCreator<{ [key: number]: Square }>('SET_TILESET_MAP')
};

export type Selection = {
  moving: boolean;
  start: Pos;
  end: Pos;
};

export type Pos = {
  row: number;
  col: number;
  num: number;
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

const startSelectionEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(actions.startSelection),
    map(action =>
      actions.setSelection({
        moving: true,
        start: action.payload,
        end: action.payload
      })
    )
  );

const updateSelectionEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(actions.updateSelection),
    filter(() => state$.value.palette.selection !== null),
    map(action => {
      const { selection } = state$.value.palette;
      if (!selection) throw 'nope';
      return {
        moving: selection.moving,
        start: selection.start,
        end: action.payload
      };
    }),
    filter(payload => payload.moving),
    map(payload => actions.setSelection(payload))
  );

const confirmSelectionEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(actions.confirmSelection),
    filter(() => state$.value.palette.selection !== null),
    map(action => {
      const { selection } = state$.value.palette;
      if (!selection) throw 'nope';
      return {
        moving: false,
        start: selection.start,
        end: selection.end
      };
    }),
    map(payload => actions.setSelection(payload))
  );

export const epics = combineEpics(
  addTilesetEpic,
  startSelectionEpic,
  updateSelectionEpic,
  confirmSelectionEpic
);
