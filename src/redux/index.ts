import { Observable } from 'rxjs';
import { Action } from 'typescript-fsa';
import {
  ActionsObservable,
  StateObservable,
  Epic as BaseEpic
} from 'redux-observable';
import * as palette from './palette';
import * as canvas from './canvas';

export { palette, canvas };

export type Store = {
  canvas: canvas.State;
  palette: palette.State;
};

export type Epic = BaseEpic<Action<any>, Action<any>, Store, void>;

// (
//   action$: ActionsObservable<Action<any>>,
//   state$: StateObservable<Store>
// ) => Observable<Action<any>>;
