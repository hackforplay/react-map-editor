import { ListItemIcon, Menu, MenuItem, Typography } from '@material-ui/core';
import * as React from 'react';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';
import { style } from 'typestyle/lib';
import Colorize from '../icons/Colorize';
import Edit from '../icons/Edit';
import Edit1 from '../icons/Edit1';
import Edit2 from '../icons/Edit2';
import Edit3 from '../icons/Edit3';
import Edit4 from '../icons/Edit4';
import Edit5 from '../icons/Edit5';
import Eraser from '../icons/Eraser';
import FormatPaint from '../icons/FormatPaint';
import Nib1 from '../icons/Nib1';
import Nib2 from '../icons/Nib2';
import Nib3 from '../icons/Nib3';
import Nib4 from '../icons/Nib4';
import Nib5 from '../icons/Nib5';
import {
  cursorModeState,
  nibWidthState,
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

const NibIcons = [React.Fragment, Nib1, Nib2, Nib3, Nib4, Nib5];

export function MenuBar() {
  const [cursorMode, setCursorMode] = useRecoilState(cursorModeState);
  const [selection, setSelection] = useRecoilState(paletteSelectionState);
  const palettePageLoadable = useRecoilValueLoadable(palettePagesState);
  const [nibWidth, setNibWidth] = useRecoilState(nibWidthState);

  const handleEraser = React.useCallback(() => {
    setCursorMode('eraser');
    setNibWidth(1);
  }, []);

  const [nibAnchorEl, setNibAnchorEl] = React.useState<HTMLElement>();
  const handlePen = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (cursorMode === 'pen') {
        // ペンモードでもう一度アイコンを押すと大きさを変えられる
        setNibAnchorEl(e.currentTarget);
        return;
      }
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
      setCursorMode('pen');
      setNibWidth(1);
    },
    [cursorMode, selection, palettePageLoadable]
  );
  const handleBase = React.useCallback(() => {
    setCursorMode('base');
    setNibWidth(1);
  }, []);
  const handleDropper = React.useCallback(() => {
    setCursorMode('dropper');
    setNibWidth(1);
  }, []);

  return (
    <Paper id="rme-menu-bar" className={root}>
      <IconButton
        active={cursorMode === 'pen'}
        label="えんぴつ"
        margin
        disabled={palettePageLoadable.state !== 'hasValue'}
        onClick={handlePen}
      >
        {nibWidth === 1 ? (
          <Edit1 />
        ) : nibWidth === 2 ? (
          <Edit2 />
        ) : nibWidth === 3 ? (
          <Edit3 />
        ) : nibWidth === 4 ? (
          <Edit4 />
        ) : nibWidth === 5 ? (
          <Edit5 />
        ) : (
          <Edit />
        )}
      </IconButton>
      <Menu
        open={Boolean(nibAnchorEl)}
        anchorEl={nibAnchorEl}
        onClose={() => setNibAnchorEl(undefined)}
      >
        {NibIcons.map((Icon, size) =>
          size === 0 ? null : (
            <MenuItem
              key={size}
              selected={nibWidth === size}
              onClick={() => {
                setNibWidth(size);
                setNibAnchorEl(undefined);
              }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <Typography>えんぴつのサイズ {size}</Typography>
            </MenuItem>
          )
        )}
      </Menu>
      <IconButton
        active={cursorMode === 'eraser'}
        label="消しゴム"
        margin
        onClick={handleEraser}
      >
        <Eraser />
      </IconButton>
      <IconButton
        active={cursorMode === 'base'}
        label="じめん"
        margin
        onClick={handleBase}
      >
        <FormatPaint />
      </IconButton>
      <IconButton
        active={cursorMode === 'dropper'}
        label="スポイト"
        margin
        onClick={handleDropper}
      >
        <Colorize />
      </IconButton>
    </Paper>
  );
}
