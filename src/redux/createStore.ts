import * as redux from 'redux';
import { Action } from 'typescript-fsa';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { createLogger } from 'redux-logger';
import { palette, canvas, input, mode, asset, Store } from '.';

export const rootEpic = combineEpics(
  palette.epics,
  canvas.epics,
  input.epics,
  mode.epics,
  asset.epics
);

export const rootReducer = redux.combineReducers<Store>({
  palette: palette.default,
  canvas: canvas.default,
  input: input.default,
  mode: mode.default,
  asset: asset.default
});

const epicMiddleware = createEpicMiddleware<Action<any>, any, Store>();

export default function createStore() {
  const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;

  const ignoreLogger = [
    input.actions.mouseMove,
    input.actions.mouseEnter,
    input.actions.mouseLeave,
    input.actions.drag,
    palette.actions.updateSelection
  ];

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
