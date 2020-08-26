import { applyPatches } from 'immer';
import { last } from 'lodash-es';
import { IEditing } from '../recoils/types';

export function undoEditing(editing: IEditing) {
  const lastUndo = last(editing.undoPatches);
  if (!lastUndo) {
    return editing;
  }

  const next = applyPatches(editing.sceneMap, lastUndo.patches);

  return {
    sceneMap: next,
    undoPatches: editing.undoPatches.slice(0, editing.undoPatches.length - 1)
  };
}
