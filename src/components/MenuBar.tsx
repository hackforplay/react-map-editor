import * as React from 'react';
import { style } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { StateProps, DispatchProps } from '../containers/MenuBar';
import Edit from '../icons/Edit';
import Eraser from '../icons/Eraser';

export type Props = StateProps & DispatchProps;

export interface State {}

const container = style(csstips.horizontal, {
  height: 48,
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
  height: '1em'
});

export default class CanvasView extends React.Component<Props, State> {
  render() {
    return (
      <div className={container}>
        <div className={layerView} />
        <div className={canvasView}>
          {/* 仮設置 */}
          <div className={icons} />
          <div className={icons} />
          <div className={icons} />
          {/* 仮設置 */}
          <Eraser className={icons} color="white" stroke="black" />
          <Edit className={icons} />
        </div>
        <div className={paletteView} />
      </div>
    );
  }
}
