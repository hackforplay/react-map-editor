import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { style } from 'typestyle/lib';
import GridOn from '../icons/GridOn';
import Undo from '../icons/Undo';
import { debugState, editingState, undoPatchesState } from '../recoils';
import { undoEditing } from '../utils/undoEditing';
import { IconButton } from './IconButton';
import { Paper } from './Paper';

const root = style({
  paddingTop: 16,
  paddingRight: 16
});
const container = style({
  display: 'flex',
  alignItems: 'center',
  height: 56,
  minWidth: 120
});

export function SettingView() {
  const [debug, setDebug] = useRecoilState(debugState);
  const toggleDebug = React.useCallback(() => {
    setDebug(debug => !debug);
  }, []);

  const setEditing = useSetRecoilState(editingState);
  const undo = React.useCallback(() => {
    setEditing(current => undoEditing(current));
  }, []);
  const undoPatches = useRecoilValue(undoPatchesState);

  return (
    <div className={root}>
      <Paper className={container}>
        <IconButton
          label="もどす"
          margin
          disabled={undoPatches.length === 0}
          onClick={undo}
        >
          <Undo />
        </IconButton>
        <IconButton
          active={debug}
          label="はんてい"
          margin
          onClick={toggleDebug}
        >
          <GridOn />
        </IconButton>
      </Paper>
    </div>
  );
}
