import { Placement, Square, TileAuthor } from '@hackforplay/next';
import { values } from 'lodash';
import { combineEpics } from 'redux-observable';
import { map } from 'rxjs/operators';
import actionCreatorFactory from 'typescript-fsa';
import { Epic } from '.';
import { getMatrix, Selection } from '../utils/selection';
import { reducerWithImmer } from './reducerWithImmer';
import { ofAction } from './typescript-fsa-redux-observable';
import { CursorMode } from '../utils/cursor';

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

const nope: ITile = {
  index: -1,
  src: 'https://tile.hackforplay.xyz/example/nope.png',
  placement: {
    type: 'Nope'
  },
  author: {
    name: 'nope'
  }
};

const actionCreator = actionCreatorFactory('react-map-editor/palette');
export const actions = {
  setSelection: actionCreator<Selection | null>('SET_SELECTION'),
  setCursorMode: actionCreator<CursorMode>('SET_CURSOR_MODE'),
  addTileset: actionCreator<Square[]>('ADD_TILESET'),
  setTilesetMap: actionCreator<{ [key: number]: Square }>('SET_TILESET_MAP')
};

export interface State {
  pages: IPage[];
  tileSet: Square[];
  tileSetMap: { [key: number]: Square };
  selection: Selection | null;
  nib: ITile[][];
  cursorMode: CursorMode;
}

const initialState: State = {
  pages: [
    {
      index: 100,
      src: 'https://tile.hackforplay.xyz/example/0.png',
      row: 1,
      tiles: {
        0: {
          index: 10000,
          src: 'https://tile.hackforplay.xyz/example/0/0.png',
          placement: {
            type: 'Ground'
          },
          author: {
            name: 'ぴぽや',
            url: 'http://blog.pipoya.net/'
          }
        },
        1: {
          index: 10001,
          src: 'https://tile.hackforplay.xyz/example/0/1.png',
          placement: {
            type: 'Ground'
          },
          author: {
            name: 'ぴぽや',
            url: 'http://blog.pipoya.net/'
          }
        },
        2: {
          index: 10002,
          src: 'https://tile.hackforplay.xyz/example/0/2.png',
          placement: {
            type: 'Ground'
          },
          author: {
            name: 'ぴぽや',
            url: 'http://blog.pipoya.net/'
          }
        },
        3: {
          index: 10003,
          src: 'https://tile.hackforplay.xyz/example/0/3.png',
          placement: {
            type: 'Ground'
          },
          author: {
            name: 'ぴぽや',
            url: 'http://blog.pipoya.net/'
          }
        },
        4: {
          index: 10004,
          src: 'https://tile.hackforplay.xyz/example/0/4.png',
          placement: {
            type: 'Ground'
          },
          author: {
            name: 'ぴぽや',
            url: 'http://blog.pipoya.net/'
          }
        },
        5: {
          index: 10005,
          src: 'https://tile.hackforplay.xyz/example/0/5.png',
          placement: {
            type: 'Ground'
          },
          author: {
            name: 'ぴぽや',
            url: 'http://blog.pipoya.net/'
          }
        },
        6: {
          index: 10006,
          src: 'https://tile.hackforplay.xyz/example/0/6.png',
          placement: {
            type: 'Ground'
          },
          author: {
            name: 'ぴぽや',
            url: 'http://blog.pipoya.net/'
          }
        },
        7: {
          index: 10007,
          src: 'https://tile.hackforplay.xyz/example/0/7.png',
          placement: {
            type: 'Ground'
          },
          author: {
            name: 'ぴぽや',
            url: 'http://blog.pipoya.net/'
          }
        }
      }
    },
    {
      index: 101,
      src: 'https://tile.hackforplay.xyz/example/1.png',
      row: 4,
      tiles: {}
    },
    {
      index: 102,
      src: 'https://tile.hackforplay.xyz/example/2.png',
      row: 1,
      tiles: {}
    },
    {
      index: 103,
      src: 'https://tile.hackforplay.xyz/example/3.png',
      row: 1,
      tiles: {}
    },
    {
      index: 104,
      src: 'https://tile.hackforplay.xyz/example/4.png',
      row: 1,
      tiles: {}
    },
    {
      index: 105,
      src: 'https://tile.hackforplay.xyz/example/5.png',
      row: 5,
      tiles: {}
    },
    {
      index: 106,
      src: 'https://tile.hackforplay.xyz/example/6.png',
      row: 5,
      tiles: {}
    },
    {
      index: 107,
      src: 'https://tile.hackforplay.xyz/example/7.png',
      row: 3,
      tiles: {}
    },
    {
      index: 108,
      src: 'https://tile.hackforplay.xyz/example/8.png',
      row: 6,
      tiles: {}
    }
  ],
  tileSet: [] as Square[],
  tileSetMap: {},
  selection: null,
  nib: [[]],
  cursorMode: 'nope'
};

export default reducerWithImmer(initialState)
  .case(actions.setTilesetMap, (draft, payload) => {
    draft.tileSetMap = payload;
    draft.tileSet = values(payload);
  })
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
  .toReducer();

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
