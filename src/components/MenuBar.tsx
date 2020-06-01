import * as csstips from 'csstips/lib';
import * as React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { classes, style } from 'typestyle/lib';
import Edit from '../icons/Edit';
import Eraser from '../icons/Eraser';
import { cursorModeState, paletteSelectionState } from '../recoils';

export const menuBarHeight = 48;

const container = style(csstips.content, {
  height: menuBarHeight,
  position: 'relative',
  zIndex: 1,
  fontSize: 24 // SVG アイコンのサイズ
});
const layerView = style(csstips.flex1, {
  minWidth: 120
});
const canvasView = style(
  csstips.flex8,
  csstips.horizontal,
  csstips.aroundJustified
);
const paletteView = style(csstips.flex1, {
  minWidth: 120
});
const icons = style({
  marginTop: (48 - 24) / 2,
  width: '1em',
  height: '1em',
  overflow: 'visible !important'
});

export const selectedColor = '#2196f3';

const eraser = {
  on: style({
    color: '#ffffff',
    stroke: selectedColor
  }),
  off: style({
    color: '#ffffff',
    stroke: '#000000'
  })
};
const edit = {
  on: style({
    color: selectedColor
  }),
  off: style({
    color: '#000000'
  }),
  disabled: style({
    opacity: 0.5,
    pointerEvents: 'none'
  })
};

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
    <div className={classes(container)}>
      <div className={layerView} />
      <div className={canvasView}>
        {/* 仮設置 */}
        <div className={icons} />
        <div className={icons} />
        <div className={icons} />
        {/* 仮設置 */}
        <Eraser
          className={classes(
            icons,
            cursorMode === 'eraser' ? eraser.on : eraser.off
          )}
          onClick={handleEraser}
        />
        <Edit
          className={classes(
            icons,
            cursorMode === 'pen' ? edit.on : edit.off,
            cannotSetPen && edit.disabled
          )}
          onClick={handlePen}
        />
      </div>
      <div className={paletteView} />
    </div>
  );
}
