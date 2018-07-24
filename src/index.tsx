import * as React from 'react';
import { Provider } from 'react-redux';
import createStore from './redux/createStore';
import Root from './containers/Root';
import { OwnProps } from './components/Root';

export type Props = OwnProps;

export default class Main extends React.Component<Props> {
  render() {
    return (
      <Provider store={createStore()}>
        <Root {...this.props} />
      </Provider>
    );
  }
}
