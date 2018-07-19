import * as React from 'react';
import { connect, MapStateToProps, MapDispatchToProps } from 'react-redux';
import PaletteView from '../components/PaletteView';
import { Store, palette } from '../redux';
import { Square } from '@hackforplay/next';

export type StateProps = {
  selected: Square | null;
  tileSet: Square[];
};

const mapStateToProps: MapStateToProps<StateProps, {}, Store> = state => {
  return {
    selected: state.palette.selected,
    tileSet: state.palette.tileSet
  };
};

export type DispatchProps = {
  onSquareClick: (square: Square) => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => {
  return {
    onSquareClick: square => dispatch(palette.actions.mousedown(square))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaletteView);
