import { Action } from 'typescript-fsa';
import { Epic as BaseEpic } from 'redux-observable';
import * as palette from './palette';
import * as canvas from './canvas';
import * as input from './input';
import * as mode from './mode';
import * as asset from './asset';

export { palette, canvas, input, mode, asset };

export type Store = {
  canvas: canvas.State;
  palette: palette.State;
  input: input.State;
  mode: mode.State;
  asset: asset.State;
};

export type Epic = BaseEpic<Action<any>, Action<any>, Store, void>;
