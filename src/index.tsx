import { Scene } from '@hackforplay/next';
import { cloneDeep } from 'lodash-es';
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
    return {
      debug: true, // TODO: Switching UI
      map: cloneDeep(state.canvas),
      assets: {
        images: []
      },
      screen: {
        width: state.canvas.tables[0][0].length * 32,
        height: state.canvas.tables[0].length * 32
      }
    } as Scene;
  };

  render() {
    return (
      <Provider store={store}>
        <Root {...this.props} />
      </Provider>
    );
  }
}
