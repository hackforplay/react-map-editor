import * as React from 'react';
import actionCreatorFactory from 'typescript-fsa';
import { reducerWithInitialState } from 'typescript-fsa-reducers/dist';
import { combineEpics } from 'redux-observable';
import { from } from 'rxjs';
import { map, mergeMap, filter } from 'rxjs/operators';
import {
  Scene,
  Square,
  SceneAssets,
  ImageAsset,
  loadImages
} from '@hackforplay/next';
import { ofAction } from './typescript-fsa-redux-observable';
import { Epic, palette, canvas } from '.';

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

export const initSceneAssetEpic: Epic = action$ =>
  action$.pipe(
    ofAction(canvas.actions.initScene),
    map(action => actions.loadAsset.started(action.payload.squares))
  );

export const loadAssetEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofAction(actions.loadAsset.started),
    mergeMap(action => {
      const input: Scene = {
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
    map(action => action.payload.nib),
    filter(nib => {
      if (!nib) throw new Error('Nib is null');
      return (
        nib.index > -1 &&
        state$.value.asset.images.every(img => img.index !== nib.index)
      );
    }),
    map(nib => actions.loadAsset.started([nib as Square]))
  );

export const epics = combineEpics(
  initSceneAssetEpic,
  loadAssetEpic,
  drawNewSquareEpic
);
