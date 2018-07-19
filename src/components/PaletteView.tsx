import * as React from 'react';
import { style } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { Square } from '@hackforplay/next';
import { StateProps, DispatchProps } from '../containers/PaletteView';

export type Props = StateProps & DispatchProps;

const container = style(csstips.flex1, csstips.vertical, {
  minWidth: 120
});
const table = style(csstips.flex);
const nibView = style({
  height: 120,
  $nest: {
    '& img': {
      height: '100%'
    }
  }
});

export default class PaletteView extends React.Component<Props> {
  render() {
    return (
      <div className={container}>
        <div className={table}>
          {this.props.tileSet.map(square => (
            <img
              key={square.index}
              src={square.tile.image.src}
              alt="tile"
              onClick={() => this.props.onSquareClick(square)}
            />
          ))}
        </div>
        <div className={nibView}>
          {this.props.nib && (
            <img src={this.props.nib.tile.image.src} alt="selected tile" />
          )}
        </div>
      </div>
    );
  }
}
