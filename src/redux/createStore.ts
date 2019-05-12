import * as redux from 'redux';
import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { Action } from 'typescript-fsa';
import { asset, canvas, mode, palette, Store } from '.';

export const rootEpic = combineEpics(
  palette.epics,
  canvas.epics,
  mode.epics,
  asset.epics
);

export const rootReducer = redux.combineReducers<Store>({
  palette: palette.default,
  canvas: canvas.default,
  mode: mode.default,
  asset: asset.default
});

const epicMiddleware = createEpicMiddleware<Action<any>, any, Store>();

export default function createStore() {
  const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;

  const ignoreLogger = [palette.actions.updateSelection];

  const logger = createLogger({
    predicate: (getState, action) => !ignoreLogger.some(ac => ac.match(action))
  });

  const store = redux.createStore(
    rootReducer,
    process.env.NODE_ENV === 'production'
      ? redux.applyMiddleware(epicMiddleware)
      : composeEnhancers(redux.applyMiddleware(epicMiddleware, logger))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
