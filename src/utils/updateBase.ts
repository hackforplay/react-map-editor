import produce, { Patch } from 'immer';
import { IEditing, ITile } from '../recoils/types';

export function updateBase(editing: IEditing, baseTile: ITile): IEditing {
  let patches: Patch[] = [];
  const sceneMap = produce(
    editing.sceneMap,
    draft => {
      draft.base = baseTile.index;

      const exists = draft.squares.some(item => item.index === baseTile.index);
      if (exists) {
        return; // 既に存在するタイルなので何もしない
      }
      // タイルが存在しなかったので追加
      draft.squares.push({
        index: baseTile.index,
        placement: baseTile.placement,
        tile: {
          size: [32, 32],
          image: {
            type: 'url',
            src: baseTile.src
          },
          author: baseTile.author
        }
      });
    },
    (_, invertPatches) => {
      patches = invertPatches;
    }
  );

  if (patches.length === 0) {
    return editing;
  }

  return {
    sceneMap,
    undoPatches: editing.undoPatches.concat({
      patches
    })
  };
}
