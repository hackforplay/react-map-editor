import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { SceneMap, Square } from '@hackforplay/next';
import Root from '../components/Root';
import { canvas, palette, Store } from '../redux';

export type StateProps = {};

const mapStateToProps: MapStateToProps<StateProps, {}, Store> = (
  state,
  ownProps
) => {
  return {};
};

export type DispatchProps = {
  initMap: (map: SceneMap) => void;
  addTileset: (tileset: Square[]) => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (
  dispatch,
  ownProps
) => {
  return {
    initMap: map => dispatch(canvas.actions.initMap(map)),
    addTileset: tileset => dispatch(palette.actions.addTileset(tileset))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
