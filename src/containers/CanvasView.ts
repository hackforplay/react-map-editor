import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import CanvasView from '../components/CanvasView';
import { Store } from '../redux';

export type StateProps = {};

const mapStateToProps: MapStateToProps<StateProps, {}, Store> = (
  state,
  ownProps
) => {
  return {};
};

export type DispatchProps = {};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (
  dispatch,
  ownProps
) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasView);
