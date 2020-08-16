import { applyPatches } from 'immer';
import { IEditing } from '../recoils/types';

export function undoEditing(editing: IEditing) {
  const [head, ...last] = editing.undoPatches;
  if (!head) {
    return editing;
  }

  const next = applyPatches(editing.sceneMap, head);

  return {
    sceneMap: next,
    undoPatches: last
  };
}
