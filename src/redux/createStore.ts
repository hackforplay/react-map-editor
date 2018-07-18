import * as redux from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';
import { palette } from './index';

export const rootEpic = combineEpics(palette.epics);

export const rootReducer = redux.combineReducers({
  palette: palette.default
});

const epicMiddleware = createEpicMiddleware();

export default function createStore() {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;

  const store = redux.createStore(
    rootReducer,
    composeEnhancers(redux.applyMiddleware(epicMiddleware, logger))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
