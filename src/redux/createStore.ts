import * as redux from 'redux';
import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { Action } from 'typescript-fsa';
import { asset, canvas, mode, palette, StoreState } from '.';

export const rootEpic = combineEpics(
  palette.epics,
  canvas.epics,
  mode.epics,
  asset.epics
);

export const rootReducer = redux.combineReducers<StoreState>({
  palette: palette.default,
  canvas: canvas.default,
  mode: mode.default,
  asset: asset.default
});

const epicMiddleware = createEpicMiddleware<Action<any>, any, StoreState>();

export default function createStore() {
  const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;

  const logger = createLogger({});

  const store = redux.createStore(
    rootReducer,
    process.env.NODE_ENV === 'production'
      ? redux.applyMiddleware(epicMiddleware)
      : composeEnhancers(redux.applyMiddleware(epicMiddleware, logger))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
