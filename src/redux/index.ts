import { Epic as BaseEpic } from 'redux-observable';
import { Action } from 'typescript-fsa';
import * as canvas from './canvas';
import * as palette from './palette';

export { palette, canvas };

export type StoreState = {
  canvas: canvas.State;
  palette: palette.State;
};

export type Epic = BaseEpic<Action<any>, Action<any>, StoreState, void>;
