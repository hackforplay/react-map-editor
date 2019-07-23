import * as React from 'react';
import { Provider } from 'react-redux';
import { Root, RootProps } from './components/Root';
import createStore from './redux/createStore';

export type Props = RootProps;

export const store = createStore();

export default class Main extends React.Component<Props> {
  /**
   * Escape hatch
   */
  export = () => {
    const state = store.getState();
    return state.canvas;
  };

  render() {
    return (
      <Provider store={store}>
        <Root {...this.props} />
      </Provider>
    );
  }
}
