import { Scene } from '@hackforplay/next';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { CanvasView } from '../components/CanvasView';
import { StoreState } from '../redux';
import { actions } from '../redux/canvas';
import * as mode from '../redux/mode';
import Cursor from '../utils/cursor';

export type StateProps = {
  rootScene: Scene;
  loading: boolean;
  mode: mode.State;
};

const mapStateToProps: MapStateToProps<StateProps, {}, StoreState> = (
  state,
  ownProps
) => {
  return {
    rootScene: {
      debug: true,
      map: state.canvas,
      assets: state.asset,
      screen: {
        width: 320,
        height: 192
      }
    },
    loading: state.asset.loading,
    mode: state.mode
  };
};

export type DispatchProps = {
  draw: (cursor: Cursor) => void;
};

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => {
  return {
    draw: cursor => dispatch(actions.draw(cursor))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CanvasView);
