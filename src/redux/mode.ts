import { Square } from '@hackforplay/next';
import { combineEpics } from 'redux-observable';
import { map } from 'rxjs/operators';
import actionCreatorFactory from 'typescript-fsa';
import { Epic, palette } from '.';
import { CursorMode } from '../utils/cursor';
import { getMatrix } from '../utils/selection';
import { reducerWithImmer } from './reducerWithImmer';
import { ofActionWithPayload } from './typescript-fsa-redux-observable';

const actionCreator = actionCreatorFactory('react-map-editor/mode');
export const actions = {
  setPen: actionCreator('USE_PEN'),
  setEraser: actionCreator('USE_ERASER'),
  setNib: actionCreator<Square[][]>('SET_NIB')
};

export interface State {
  cursorMode: CursorMode;
  nib: Square[][] | null;
}
const initialState: State = {
  cursorMode: 'nope',
  nib: null
};

export default reducerWithImmer(initialState)
  .case(actions.setPen, draft => {
    draft.cursorMode = draft.nib ? 'pen' : 'nope';
  })
  .case(actions.setEraser, draft => {
    draft.cursorMode = 'eraser';
  })
  .case(actions.setNib, (draft, payload) => {
    draft.nib = payload;
    draft.cursorMode = 'pen';
  })
  .toReducer();

const nibEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofActionWithPayload(palette.actions.setSelection),
    map(action => {
      const { tileSet } = state$.value.palette;
      const matrix = getMatrix(action.payload);
      const nib = matrix.map(row => row.map(num => tileSet[num]));
      return actions.setNib(nib);
    })
  );

export const epics = combineEpics(nibEpic);
