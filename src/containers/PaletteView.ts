import { Square } from '@hackforplay/next';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { PaletteView } from '../components/PaletteView';
import { palette, Store } from '../redux';
import { Selection } from '../utils/selection';

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
  setSelection: (selection: Selection | null) => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => {
  return {
    setSelection: selection => dispatch(palette.actions.setSelection(selection))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaletteView);
