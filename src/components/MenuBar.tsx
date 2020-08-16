import * as React from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { style } from 'typestyle/lib';
import Edit from '../icons/Edit';
import Eraser from '../icons/Eraser';
import {
  cursorModeState,
  palettePagesState,
  paletteSelectionState
} from '../recoils';
import { Pos } from '../utils/selection';
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
  const [selection, setSelection] = useRecoilState(paletteSelectionState);
  const palettePageLoadable = useRecoilValueLoadable(palettePagesState);

  const handleEraser = React.useCallback(() => {
    setCusrorMode('eraser');
  }, []);
  const handlePen = React.useCallback(() => {
    if (selection === null) {
      // 一番左上のひとつ右隣を自動的に選ぶ
      const pages =
        palettePageLoadable.state === 'hasValue'
          ? palettePageLoadable.contents
          : undefined;
      if (!pages) return; // type hint
      const pos: Pos = { row: 0, col: 1, num: 1 };
      setSelection({
        page: pages[0].index,
        start: pos,
        end: pos
      });
    }
    setCusrorMode('pen');
  }, [selection, palettePageLoadable]);

  return (
    <Paper className={root}>
      <IconButton
        active={cursorMode === 'pen'}
        label="えんぴつ"
        margin
        disabled={palettePageLoadable.state !== 'hasValue'}
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
