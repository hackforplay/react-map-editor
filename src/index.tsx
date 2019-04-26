import * as React from 'react';
import { Provider } from 'react-redux';
import { cloneDeep } from 'lodash';
import { Scene } from '@hackforplay/next';
import createStore from './redux/createStore';
import Root from './containers/Root';
import { OwnProps } from './components/Root';

export type Props = OwnProps;

const store = createStore();

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
