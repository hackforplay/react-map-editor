import * as React from 'react';
import { style } from 'typestyle';
import * as csstips from 'csstips';

const container = style(csstips.flex8);

export default class CanvasView extends React.Component {
  render() {
    return <div className={container}>CanvasView</div>;
  }
}
