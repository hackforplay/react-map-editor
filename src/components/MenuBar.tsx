import * as csstips from 'csstips/lib';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { classes, style } from 'typestyle/lib';
import { useTypedSelector } from '../hooks/useTypedSelector';
import Edit from '../icons/Edit';
import Eraser from '../icons/Eraser';
import { actions } from '../redux/mode';

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
  enabled: style({
    color: '#ffffff',
    stroke: selectedColor
  }),
  disabled: style({
    color: '#ffffff',
    stroke: '#000000'
  })
};
const edit = {
  enabled: style({
    color: selectedColor
  }),
  disabled: style({
    color: '#000000'
  })
};

export function MenuBar() {
  const cursorMode = useTypedSelector(state => state.mode.cursorMode);

  const dispatch = useDispatch();
  const handleEraser = React.useCallback(() => {
    dispatch(actions.setEraser());
  }, []);
  const handlePen = React.useCallback(() => {
    dispatch(actions.setPen());
  }, []);

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
            cursorMode === 'eraser' ? eraser.enabled : eraser.disabled
          )}
          onClick={handleEraser}
        />
        <Edit
          className={classes(
            icons,
            cursorMode === 'pen' ? edit.enabled : edit.disabled
          )}
          onClick={handlePen}
        />
      </div>
      <div className={paletteView} />
    </div>
  );
}
