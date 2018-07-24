import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import MenuBar from '../components/MenuBar';
import { Store, mode } from '../redux';
import { CursorMode } from '../utils/cursor';

export type StateProps = {
  cursorMode: CursorMode;
};

const mapStateToProps: MapStateToProps<StateProps, {}, Store> = (
  state,
  ownProps
) => {
  return {
    cursorMode: state.mode.cursorMode
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
