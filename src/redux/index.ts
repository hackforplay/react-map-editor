import { Epic as BaseEpic } from 'redux-observable';
import { Action } from 'typescript-fsa';
import * as canvas from './canvas';
import * as mode from './mode';
import * as palette from './palette';

export { palette, canvas, mode };

export type StoreState = {
  canvas: canvas.State;
  palette: palette.State;
  mode: mode.State;
};

export type Epic = BaseEpic<Action<any>, Action<any>, StoreState, void>;
