import * as React from 'react';
import { style } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { Square } from '@hackforplay/next';
import LayerView from '../containers/LayerView';
import CanvasView from '../containers/CanvasView';
import PaletteView from '../containers/PaletteView';
import MenuBar from '../containers/MenuBar';
import { StateProps, DispatchProps } from '../containers/Root';

export type OwnProps = {
  tileset?: Square[];
};
export type Props = StateProps & DispatchProps & OwnProps;

const root = style(csstips.vertical, {
  height: '100%'
});
const container = style(csstips.flex, csstips.horizontal, {
  backgroundColor: 'lightgrey'
});
const menu = style(csstips.content, {
  height: 64
});

export default class Root extends React.Component<Props> {
  componentDidMount() {
    this.props.init();
  }

  render() {
    return (
      <div className={root}>
        <div className={container}>
          <LayerView />
          <CanvasView />
          <PaletteView tileset={this.props.tileset} />
        </div>
        <MenuBar />
      </div>
    );
  }
}
