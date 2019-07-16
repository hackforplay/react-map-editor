import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import LayerView, { Props } from '../components/LayerView';
import { StoreState } from '../redux';

export type StateProps = {};

const mapStateToProps: MapStateToProps<StateProps, Props, StoreState> = (
  state,
  ownProps
) => {
  return {};
};

export type DispatchProps = {};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, Props> = (
  dispatch,
  ownProps
) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LayerView);
