import { Scene } from '@hackforplay/next';
import { atom, DefaultValue, selector, selectorFamily } from 'recoil';
import Cursor, { CursorMode } from '../utils/cursor';
import { initSceneMap, initSceneScreen } from '../utils/initScene';
import { getMatrix, Selection } from '../utils/selection';
import { IEditing, IEditPatch, IPage, ITile } from './types';

const pagesEndpoint = 'https://tile.hackforplay.xyz/pages.json';

/**
 * パレットが選択されていない状態ではペンにしないこと
 * パレットが選択されたらペンに変更すること
 */
export const cursorModeState = atom<CursorMode>({
  key: 'cursorModeState',
  default: 'nope'
});

export const palettePagesState = selector<IPage[]>({
  key: 'palettePageState',
  get: async () => {
    const response = await fetch(pagesEndpoint);
    const result = await response.json();
    return Object.values<IPage>(result.pages);
  }
});

export const paletteSelectionState = atom<Selection | null>({
  key: 'paletteSelectionState',
  default: null
});

export const paletteNibState = selector<ITile[][]>({
  key: 'paletteNibState',
  get: async ({ get }) => {
    const selection = get(paletteSelectionState);
    if (!selection) return [[]]; // 空のペン先
    const pages = get(palettePagesState);
    const page = pages.find(page => page.index === selection.page);
    const matrix = getMatrix(selection);
    const nib = matrix.map(row =>
      row.map(num => {
        const tile = page?.tiles[num];
        if (!tile) {
          const info = JSON.stringify(selection);
          throw new Error(`Tile not found: ${info}`);
        }
        return tile;
      })
    );
    return nib;
  }
});

export const debugState = atom<boolean>({
  key: 'debugState',
  default: true
});

export const sceneMapState = atom<Scene['map']>({
  key: 'sceneMapState',
  default: initSceneMap()
});

export const sceneScreenState = atom<Scene['screen']>({
  key: 'sceneScreenState',
  default: initSceneScreen()
});

export const sceneState = selector<Scene>({
  key: 'sceneState',
  get: ({ get }) => {
    const debug = get(debugState);
    const map = get(sceneMapState);
    const screen = get(sceneScreenState);
    return { debug, map, screen };
  }
});

export const undoPatchesState = atom<IEditPatch[]>({
  key: 'undoPatchesState',
  default: []
});

export const editingState = selector<IEditing>({
  key: 'editingState',
  get: ({ get }) => {
    return {
      sceneMap: get(sceneMapState),
      undoPatches: get(undoPatchesState)
    };
  },
  set: ({ set, reset }, payload) => {
    if (payload instanceof DefaultValue) {
      reset(sceneMapState);
      reset(undoPatchesState);
    } else {
      set(sceneMapState, payload.sceneMap);
      set(undoPatchesState, payload.undoPatches);
    }
  }
});

export const cursorState = atom<Cursor | null>({
  key: 'cursorState',
  default: null
});

const preloadSrcState = selectorFamily<any, string>({
  key: 'preloadSrcState',
  get: src => () => fetch(src)
});

export const preloadNibState = selector({
  key: 'preloadNibState',
  get: ({ get }) => {
    const nib = get(paletteNibState);
    for (const row of nib) {
      for (const tile of row) {
        get(preloadSrcState(tile.src));
      }
    }
  }
});

/**
 * 【注意】
 * Scene['map']['base'] が表すタイルがパレット上のどこにあるかを表す
 * パレットとシーンの間でタイルの index を共通にすることを暗黙的な前提としている
 * しかし設計上そのような制約はないため、この Selection は疑わしい値とすべき
 * 例えば base の初期値はパレットに存在しない草原なので、本来表示することはできないが、
 * 便宜上、最も若い page の最も左上の座標を baseSelection として提供する
 */
export const baseSelectionState = selector<Selection>({
  key: 'baseSelectionState',
  get: ({ get }) => {
    const pages = get(palettePagesState);
    const { base } = get(sceneMapState);

    for (const item of pages) {
      for (const [number, tile] of Object.entries(item.tiles)) {
        if (tile?.index === base) {
          // 同じ index が見つかった
          const num = parseInt(number);
          const col = num % 8;
          const row = Math.floor(num / 8);
          return {
            page: item.index,
            start: { col, row, num },
            end: { col, row, num }
          };
        }
      }
    }

    // 見つからないので最も若い page の最も左上の座標を返す
    return {
      page: pages[0].index,
      start: { col: 0, row: 0, num: 0 },
      end: { col: 0, row: 0, num: 0 }
    };
  },
  set: ({ get, set }, newValue) => {
    const pages = get(palettePagesState);
    let { squares } = get(sceneMapState);
    if (newValue instanceof DefaultValue) {
      // squares の一番先頭の値をセットする
      const tile = squares[0];
      if (tile) {
        set(sceneMapState, prevValue => ({
          ...prevValue,
          base: tile.index
        }));
      }
      return;
    }
    const page = pages.find(item => item.index === newValue.page);
    const tile = page?.tiles[String(newValue.start.num)];
    if (!tile) return;
    if (squares.every(item => item.index !== tile.index)) {
      // タイルが存在しなかったので追加
      squares = squares.concat({
        index: tile.index,
        placement: tile.placement,
        tile: {
          size: [32, 32],
          image: {
            type: 'url',
            src: tile.src
          },
          author: tile.author
        }
      });
    }
    set(sceneMapState, prevValue => ({
      ...prevValue,
      base: tile.index,
      squares
    }));
  }
});
