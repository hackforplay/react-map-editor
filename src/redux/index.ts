import { Action } from 'typescript-fsa';
import { Epic as BaseEpic } from 'redux-observable';
import * as palette from './palette';
import * as canvas from './canvas';

export { palette, canvas };

export type Store = {
  canvas: canvas.State;
  palette: palette.State;
};

export type Epic = BaseEpic<Action<any>, Action<any>, Store, void>;
