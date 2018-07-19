import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import MenuBar, { Props } from '../components/MenuBar';
import { Store, mode } from '../redux';

export type StateProps = {
  penMode: mode.PenMode;
};

const mapStateToProps: MapStateToProps<StateProps, {}, Store> = (
  state,
  ownProps
) => {
  return {
    penMode: state.mode.penMode
  };
};

export type DispatchProps = {
  onClickEdit: () => void;
  onClickEraser: () => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (
  dispatch,
  ownProps
) => {
  return {
    onClickEdit: () => dispatch(mode.actions.setPen()),
    onClickEraser: () => dispatch(mode.actions.setEraser())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuBar);
