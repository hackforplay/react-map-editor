import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import PaletteView from '../components/PaletteView';
import { Store, palette } from '../redux';
import { Square } from '@hackforplay/next';

export type StateProps = {
  nib: Square | null;
  tileSet: Square[];
};

const mapStateToProps: MapStateToProps<StateProps, {}, Store> = state => {
  return {
    nib: state.mode.nib,
    tileSet: state.palette.tileSet
  };
};

export type DispatchProps = {
  startSelection: (pos: palette.Pos) => void;
  updateSelection: (pos: palette.Pos) => void;
  confirmSelection: () => void;
  unsetSelection: () => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => {
  return {
    startSelection: pos => dispatch(palette.actions.startSelection(pos)),
    updateSelection: pos => dispatch(palette.actions.updateSelection(pos)),
    confirmSelection: () => dispatch(palette.actions.confirmSelection()),
    unsetSelection: () => dispatch(palette.actions.setSelection(null))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaletteView);
