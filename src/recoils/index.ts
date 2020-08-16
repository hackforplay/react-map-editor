import { Scene } from '@hackforplay/next';
import { Patch } from 'immer';
import { atom, DefaultValue, selector, selectorFamily } from 'recoil';
import Cursor, { CursorMode } from '../utils/cursor';
import { initSceneMap, initSceneScreen } from '../utils/initScene';
import { getMatrix, Selection } from '../utils/selection';
import { IEditing, IPage, ITile } from './types';

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

export const paletteSelectionIsNull = selector<boolean>({
  key: 'paletteSelectionIsNull',
  get: ({ get }) => get(paletteSelectionState) === null
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

const undoPatchesState = atom<Patch[][]>({
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
