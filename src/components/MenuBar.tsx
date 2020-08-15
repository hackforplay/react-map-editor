import * as React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { style } from 'typestyle/lib';
import Edit from '../icons/Edit';
import Eraser from '../icons/Eraser';
import { cursorModeState, paletteSelectionState } from '../recoils';
import { IconButton } from './IconButton';
import { Paper } from './Paper';

const root = style({
  margin: 16,
  marginBottom: 8,
  height: 56,
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center'
});

export function MenuBar() {
  const [cursorMode, setCusrorMode] = useRecoilState(cursorModeState);
  const cannotSetPen = useRecoilValue(paletteSelectionState) === null;

  const handleEraser = React.useCallback(() => {
    setCusrorMode('eraser');
  }, []);
  const handlePen = React.useCallback(() => {
    if (cannotSetPen) return;
    setCusrorMode('pen');
  }, [cannotSetPen]);

  return (
    <Paper className={root}>
      <IconButton
        active={cursorMode === 'pen'}
        label="えんぴつ"
        margin
        onClick={handlePen}
      >
        <Edit />
      </IconButton>
      <IconButton
        active={cursorMode === 'eraser'}
        label="消しゴム"
        margin
        onClick={handleEraser}
      >
        <Eraser />
      </IconButton>
    </Paper>
  );
}
