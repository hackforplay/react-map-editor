import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { Scene } from '@hackforplay/next';
import CanvasView from '../components/CanvasView';
import { canvas, Store } from '../redux';

export type StateProps = {
  rootScene: Scene | null;
};

const mapStateToProps: MapStateToProps<StateProps, {}, Store> = (
  state,
  ownProps
) => {
  return {
    rootScene: state.canvas.rootScene
  };
};

export type DispatchProps = {
  init: () => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (
  dispatch,
  ownProps
) => {
  return {
    init: () => dispatch(canvas.actions.initScene())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasView);
