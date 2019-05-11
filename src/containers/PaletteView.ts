import { Square } from '@hackforplay/next';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { PaletteView } from '../components/PaletteView';
import { palette, Store } from '../redux';
import { Pos } from '../utils/selection';

export type StateProps = {
  nib: Square[][] | null;
  tileSet: Square[];
};

const mapStateToProps: MapStateToProps<StateProps, {}, Store> = state => {
  return {
    nib: state.mode.nib,
    tileSet: state.palette.tileSet
  };
};

export type DispatchProps = {
  startSelection: (pos: Pos) => void;
  updateSelection: (pos: Pos) => void;
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
