// Inspired by https://github.com/m0a/typescript-fsa-redux-observable
import { ActionsObservable } from 'redux-observable';
import { Action, ActionCreator } from 'typescript-fsa';
import { filter } from 'rxjs/operators';
import { MonoTypeOperatorFunction } from 'rxjs';

export function ofAction<P>(
  actionCreator: ActionCreator<P>
): MonoTypeOperatorFunction<Action<P>> {
  return function (actions$) {
    return actions$.pipe(filter(actionCreator.match)) as ActionsObservable<
      Action<P>
    >;
  };
}

export function ofActionWithPayload<P>(
  actionCreator: ActionCreator<P | null>
): MonoTypeOperatorFunction<Action<P>> {
  return function (actions$) {
    return actions$.pipe(
      filter(actionCreator.match),
      filter(action => action.payload !== null)
    ) as ActionsObservable<Action<P>>;
  };
}
