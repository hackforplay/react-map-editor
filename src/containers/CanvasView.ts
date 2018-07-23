import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import { Scene } from '@hackforplay/next';
import CanvasView from '../components/CanvasView';
import { canvas, input, Store } from '../redux';

export type StateProps = {
  rootScene: Scene;
  loading: boolean;
};

const mapStateToProps: MapStateToProps<StateProps, {}, Store> = (
  state,
  ownProps
) => {
  return {
    rootScene: {
      map: state.canvas,
      assets: state.asset,
      screen: {
        width: 320,
        height: 192
      }
    },
    loading: state.asset.loading
  };
};

export type DispatchProps = {
  init: () => void;
  onCanvasMouseEnter: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseLeave: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseUp: (e: React.MouseEvent<HTMLCanvasElement>) => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (
  dispatch,
  ownProps
) => {
  return {
    init: () => dispatch(canvas.actions.initScene(canvas.init())),
    onCanvasMouseEnter: e => dispatch(input.actions.mouseEnter(e)),
    onCanvasMouseLeave: e => dispatch(input.actions.mouseLeave(e)),
    onCanvasMouseDown: e => dispatch(input.actions.mouseDown(e)),
    onCanvasMouseMove: e => dispatch(input.actions.mouseMove(e)),
    onCanvasMouseUp: e => dispatch(input.actions.mouseUp(e))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasView);
