import * as React from 'react';
import { style } from 'typestyle';
import * as csstips from 'csstips';

const container = style(csstips.flex1, {
  minWidth: 120
});

export default class PaletteView extends React.Component {
  render() {
    return <div className={container}>PaletteView</div>;
  }
}
