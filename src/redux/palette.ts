import { Placement, Square, TileAuthor } from '@hackforplay/next';
import { values } from 'lodash';
import { combineEpics } from 'redux-observable';
import { map } from 'rxjs/operators';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { Epic } from '.';
import { Selection } from '../utils/selection';
import { ofAction } from './typescript-fsa-redux-observable';

export interface IPagesResult {
  pages: IPage[];
}

export interface IPage {
  /**
   * 全てのページで一意な番号。最大値はないが、欠番は存在する
   */
  index: number;
  /**
   * PaletteView で使うページ全体の画像 URL
   */
  src: string;
  /**
   * ページの行数。タイルの枚数が 100 を超えるとタイルの index が一意にならなくなるので、最大値は 12
   */
  row: number;
  /**
   * ページに含まれるタイルの情報。number は、左上が 0 で、その下は 8 である
   * undefined の場合は、透明な Nope タイルとして扱う
   */
  tiles: {
    [number: string]: ITile | undefined;
  };
}

export interface ITile {
  /**
   * 全てのタイルで一意な番号。 IPage["index"] * 100 + number で求められる
   */
  index: number;
  /**
   * このタイルだけの画像 URL
   */
  src: string;
  placement: Placement;
  author: TileAuthor;
}

const actionCreator = actionCreatorFactory('react-map-editor/palette');
export const actions = {
  setSelection: actionCreator<Selection | null>('SET_SELECTION'),
  addTileset: actionCreator<Square[]>('ADD_TILESET'),
  setTilesetMap: actionCreator<{ [key: number]: Square }>('SET_TILESET_MAP')
};

export interface State {
  pages: IPage[];
  tileSet: Square[];
  tileSetMap: { [key: number]: Square };
  selection: Selection | null;
}

const initialState: State = {
  pages: [
    {
      index: 100,
      src: 'https://tile.hackforplay.xyz/example/1.png',
      row: 4,
      tiles: {}
    }
  ],
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
