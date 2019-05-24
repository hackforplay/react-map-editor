import {
  ImageAsset,
  loadImages,
  Scene,
  SceneAssets,
  Square
} from '@hackforplay/next';
import { flatten } from 'lodash';
import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { canvas, Epic } from '.';
import { ofAction } from './typescript-fsa-redux-observable';

const actionCreator = actionCreatorFactory('react-map-editor/asset');
export const actions = {
  loadAsset: actionCreator.async<Square[], ImageAsset[]>('LOAD_ASSET')
};

export interface State extends SceneAssets {
  loading: boolean;
}
const initialState: State = {
  loading: false,
  images: [] as ImageAsset[]
};

export default reducerWithInitialState(initialState)
  .case(actions.loadAsset.started, state => ({ ...state, loading: true }))
  .case(actions.loadAsset.done, (state, action) => ({
    ...state,
    loading: false,
    images: action.result
  }));

export const initMapEpic: Epic = action$ =>
  action$.pipe(
    ofAction(canvas.actions.initMap),
    map(action => actions.loadAsset.started(action.payload.squares))
  );

export const loadAssetEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(actions.loadAsset.started),
    mergeMap(action => {
      const input: Scene = {
        debug: true, // TODO: Switching UI
        map: {
          tables: [[[-1]]],
          squares: action.payload
        },
        assets: {
          images: state$.value.asset.images
        },
        screen: {
          width: 0,
          height: 0
        }
      };
      return from(loadImages(input)).pipe(
        map(scene =>
          actions.loadAsset.done({
            result: scene.assets.images,
            params: action.payload
          })
        )
      );
    })
  );

export const drawNewSquareEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(canvas.actions.draw),
    filter(action => action.payload.mode === 'pen'),
    map(action =>
      flatten(action.payload.nib).filter(square => {
        return (
          square.index > -1 &&
          state$.value.asset.images.every(img => img.index !== square.index)
        );
      })
    ),
    filter(array => array.length > 0),
    map(array => actions.loadAsset.started(array))
  );

export const epics = combineEpics(
  initMapEpic,
  loadAssetEpic,
  drawNewSquareEpic
);
