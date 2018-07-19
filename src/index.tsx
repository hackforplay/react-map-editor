import * as React from 'react';
import { Provider } from 'react-redux';
import { style } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import LayerView from './containers/LayerView';
import CanvasView from './containers/CanvasView';
import PaletteView from './containers/PaletteView';
import MenuBar from './containers/MenuBar';
import createStore from './redux/createStore';

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
      <Provider store={createStore()}>
        <div className={root}>
          <div className={container}>
            <LayerView />
            <CanvasView />
            <PaletteView />
          </div>
          <MenuBar />
        </div>
      </Provider>
    );
  }
}
