import * as React from 'react';
import { style } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { SceneMap, Square } from '@hackforplay/next';
import LayerView from '../containers/LayerView';
import CanvasView from '../containers/CanvasView';
import PaletteView from '../containers/PaletteView';
import MenuBar from '../containers/MenuBar';
import { StateProps, DispatchProps } from '../containers/Root';

export type OwnProps = {
  tileset?: Square[];
  map?: SceneMap;
};
export type Props = StateProps & DispatchProps & OwnProps;

const menuBarHeight = 48;

const root = style({
  height: '100%'
});
const container = style(csstips.flex, csstips.horizontal, {
  height: `calc(100% - ${menuBarHeight}px)`,
  backgroundColor: 'lightgrey'
});
const menu = style(csstips.content, {
  height: menuBarHeight
});

export default class Root extends React.Component<Props> {
  componentDidMount() {
    if (this.props.map) {
      this.props.initMap(this.props.map);
    }
    if (this.props.tileset) {
      this.props.addTileset(this.props.tileset);
    }
  }

  render() {
    return (
      <div className={root}>
        <div className={container}>
          <LayerView />
          <CanvasView />
          <PaletteView />
        </div>
        <MenuBar className={menu} />
      </div>
    );
  }
}
