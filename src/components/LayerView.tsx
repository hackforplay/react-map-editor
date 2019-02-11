import * as React from 'react';
import { style } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { StateProps, DispatchProps } from '../containers/LayerView';

export type Props = StateProps & DispatchProps;

export interface State {}

const container = style(csstips.flex1, {
  minWidth: 120
});

export default class LayerView extends React.Component<Props, State> {
  render() {
    return <div className={container} />;
  }
}
