import * as React from 'react';
import { style, classes } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { StateProps, DispatchProps } from '../containers/MenuBar';
import Edit from '../icons/Edit';
import Eraser from '../icons/Eraser';

export type OwnProps = {
  className: string;
};

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {}

const container = style({
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

export default class MenuBar extends React.Component<Props, State> {
  render() {
    const { cursorMode, className } = this.props;
    return (
      <div className={classes(className, container)}>
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
            onClick={this.props.onClickEraser}
          />
          <Edit
            className={classes(
              icons,
              cursorMode === 'pen' ? edit.enabled : edit.disabled
            )}
            onClick={this.props.onClickEdit}
          />
        </div>
        <div className={paletteView} />
      </div>
    );
  }
}
