import { Placement, TileAuthor } from '@hackforplay/next';
import { combineEpics, Epic } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';
import actionCreatorFactory, { Action } from 'typescript-fsa';
import { CursorMode } from '../utils/cursor';
import { getMatrix, Selection } from '../utils/selection';
import { reducerWithImmer } from './reducerWithImmer';
import { ofAction } from './typescript-fsa-redux-observable';

export interface IPagesResult {
  pages: {
    [index: number]: IPage;
  };
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

const pagesEndpoint = 'https://tile.hackforplay.xyz/pages.json';

const nope: ITile = {
  index: -1,
  src: 'https://tile.hackforplay.xyz/nope.png',
  placement: {
    type: 'Nope'
  },
  author: {
    name: 'nope'
  }
};

const actionCreator = actionCreatorFactory('react-map-editor/palette');
export const actions = {
  loadPages: actionCreator.async<{}, IPagesResult>('LOAD_PAGES'),
  setSelection: actionCreator<Selection | null>('SET_SELECTION'),
  setCursorMode: actionCreator<CursorMode>('SET_CURSOR_MODE')
};

export interface State {
  pages: IPage[];
  selection: Selection | null;
  nib: ITile[][];
  cursorMode: CursorMode;
}

const initialState: State = {
  pages:
    process.env.NODE_ENV === 'production'
      ? []
      : Object.values(require('./dev.json').pages),
  selection: null,
  nib: [[]],
  cursorMode: 'nope'
};

export default reducerWithImmer(initialState)
  .case(actions.setSelection, (draft, payload) => {
    draft.selection = payload;
    if (payload) {
      // Update nib
      const page = draft.pages.find(page => page.index === payload.page);
      draft.nib = getMatrix(payload).map(row =>
        row.map(num => {
          if (!page) return nope;
          return page.tiles[num] || nope;
        })
      );
      draft.cursorMode = 'pen';
    }
  })
  .case(actions.setCursorMode, (draft, payload) => {
    // nib がセットされていないとペンモードにはならない
    if (payload === 'pen' && draft.nib[0].length < 1) return;
    draft.cursorMode = payload;
  })
  .case(actions.loadPages.done, (draft, payload) => {
    draft.pages = Object.values(payload.result.pages);
  })
  .toReducer();

export const epics = combineEpics<Epic<Action<any>, Action<any>, void, any>>(
  action$ =>
    action$.pipe(
      ofAction(actions.loadPages.started),
      take(1),
      mergeMap(action =>
        from(fetch(pagesEndpoint).then(response => response.json())).pipe(
          map(result =>
            actions.loadPages.done({ params: action.payload, result })
          ),
          catchError(error =>
            of(actions.loadPages.failed({ params: action.payload, error }))
          )
        )
      )
    )
);
