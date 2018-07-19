import * as redux from 'redux';
import { Action } from 'typescript-fsa';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';
import { palette, canvas, Store } from '.';

export const rootEpic = combineEpics(palette.epics, canvas.epics);

export const rootReducer = redux.combineReducers<Store>({
  palette: palette.default,
  canvas: canvas.default
});

const epicMiddleware = createEpicMiddleware<Action<any>, any, Store>();

export default function createStore() {
  const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;

  const store = redux.createStore(
    rootReducer,
    composeEnhancers(redux.applyMiddleware(epicMiddleware, logger))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
