import { Scene, size } from '@hackforplay/next';
import { atom, DefaultValue, selector } from 'recoil';
import { request } from '../components/NetworkProvider';
import { CursorMode } from '../utils/cursor';
import { getMatrix, Selection } from '../utils/selection';
import { updateBase } from '../utils/updateBase';
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
  get: async ({ get }) => {
    const response = get(request(pagesEndpoint));
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

/**
 * 初期値が設定されるまで loading
 */
export const sceneMapState = atom<Scene['map']>({
  key: 'sceneMapState',
  default: new Promise(() => {})
});

/**
 * マップデータからスクリーンのサイズを計算する
 */
export const sceneScreenState = selector<Scene['screen']>({
  key: 'sceneScreenState',
  get: ({ get }) => {
    const { tables } = get(sceneMapState);
    const height = tables[0]?.length || 0;
    const width = tables[0]?.[0].length || 0;
    return {
      height: height * size,
      width: width * size
    };
  }
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

export const preloadNibState = selector({
  key: 'preloadNibState',
  get: ({ get }) => {
    const nib = get(paletteNibState);
    for (const row of nib) {
      for (const tile of row) {
        get(request(tile.src));
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
    if (newValue instanceof DefaultValue) {
      return; // リセットは定義できない（する必要もない）
    }
    const page = pages.find(item => item.index === newValue.page);
    const tile = page?.tiles[String(newValue.start.num)];
    if (!tile) return;
    set(editingState, curr => updateBase(curr, tile));
  }
});
