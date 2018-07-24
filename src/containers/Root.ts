import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import Root from '../components/Root';
import { canvas, Store } from '../redux';

export type StateProps = {};

const mapStateToProps: MapStateToProps<StateProps, {}, Store> = (
  state,
  ownProps
) => {
  return {};
};

export type DispatchProps = {
  init: () => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (
  dispatch,
  ownProps
) => {
  return {
    init: () => dispatch(canvas.actions.initScene(canvas.init()))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
