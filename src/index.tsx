import * as React from 'react';
import LayerView from './components/LayerView';
import CanvasView from './components/CanvasView';
import PaletteView from './components/PaletteView';
import { style } from 'typestyle';
import * as csstips from 'csstips';

const root = style(csstips.vertical, {
  height: '100%'
});
const container = style(csstips.flex, csstips.horizontal, {
  backgroundColor: 'lightgrey'
});
const menu = style(csstips.content, {
  height: 64
});

export default class Main extends React.Component {
  render() {
    return (
      <div className={root}>
        <div className={container}>
          <LayerView />
          <CanvasView />
          <PaletteView />
        </div>
        <div className={menu}>Menu</div>
      </div>
    );
  }
}
