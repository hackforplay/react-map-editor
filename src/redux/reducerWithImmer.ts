import produce from 'immer';
import { Action, ActionCreator } from 'typescript-fsa';

type AnyAction = Action<any>;

interface ReducerBuilder<State> {
  case<Payload>(
    actionCreator: ActionCreator<Payload>,
    handler: (draft: State, payload: Payload) => void
  ): ReducerBuilder<State>;
  reset(actionCreator: ActionCreator<any>): ReducerBuilder<State>;
  toReducer(): (state: State | undefined, action: AnyAction) => State;
}

/**
 * reducerWithImmer({})
 *  .case(actions.hoge, draft => {
 *    draft.fuga ++;
 *  })
 */
export function reducerWithImmer<State>(
  initialState: State
): ReducerBuilder<State> {
  const cases: {
    [type: string]: (draft: State, payload: any) => void;
  } = {};
  const resets: string[] = [];

  const builder: ReducerBuilder<State> = {
    case(actionCreator, handler) {
      if (process.env.NODE_ENV !== 'production') {
        if (typeof actionCreator.type !== 'string') {
          throw new Error(`ActionCreator must has string member "type"`);
        }
        if (actionCreator.type in cases) {
          throw new Error(`${actionCreator.type} is already set in reducer!`);
        }
        if (typeof handler !== 'function') {
          throw new Error(`Invalid handler set with "${actionCreator.type}"`);
        }
      }
      cases[actionCreator.type] = handler;
      return builder;
    },
    reset(actionCreator) {
      resets.push(actionCreator.type);
      return builder;
    },
    toReducer() {
      return (state, action) => {
        if (resets.includes(action.type)) {
          return initialState;
        }
        const handler = cases[action.type];
        return handler
          ? produce<State, State>(state || initialState, draft =>
              handler(draft, action.payload)
            )
          : state || initialState;
      };
    }
  };
  return builder;
}
