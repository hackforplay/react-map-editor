import { atom, useRecoilCallback } from 'recoil';
import {
  cursorModeState,
  palettePagesState,
  paletteSelectionState,
  sceneMapState
} from '../recoils';

/**
 * 最後にスポイトで選択された page number を保持する Atom
 * useEffect の参照一致を潜り抜けるためにオブジェクトにする
 */
export const dropperPageAtom = atom<{ index: number }>({
  key: 'dropperPageAtom',
  default: { index: 0 }
});

export function useDropper() {
  return useRecoilCallback(({ getLoadable, set }, x: number, y: number) => {
    const sceneMapLoadable = getLoadable(sceneMapState);
    const sceneMap =
      sceneMapLoadable.state === 'hasValue'
        ? sceneMapLoadable.contents
        : undefined;
    if (!sceneMap) return;
    const pagesLoadable = getLoadable(palettePagesState);
    const pages =
      pagesLoadable.state === 'hasValue' ? pagesLoadable.contents : undefined;
    if (!pages) return;

    for (let layer = sceneMap.tables.length - 1; layer >= 0; layer--) {
      const index = sceneMap.tables[layer][y][x];
      if (index > 0) {
        // index から page を見つける
        for (const page of pages) {
          for (let y = 0; y < page.row; y++) {
            for (let x = 0; x < 8; x++) {
              const num = y * 8 + x;
              const tile = page.tiles[num];
              if (tile?.index === index) {
                set(paletteSelectionState, {
                  page: page.index,
                  start: { col: x, row: y, num },
                  end: { col: x, row: y, num }
                });
                set(cursorModeState, 'pen');
                set(dropperPageAtom, { index: page.index });
                return;
              }
            }
          }
        }
        return;
      }
    }
  }, []);
}
