import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import MenuBar, { Props } from '../components/MenuBar';
import { Store } from '../redux';

export type StateProps = {};

const mapStateToProps: MapStateToProps<StateProps, Props, Store> = (
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
)(MenuBar);
