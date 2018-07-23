import * as React from 'react';
import { style, media } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { StateProps, DispatchProps } from '../containers/PaletteView';

export type Props = StateProps & DispatchProps;

const container4 = (32 + 1) * 4 - 1;
const container8 = (32 + 1) * 8 - 1;

const container = style(
  csstips.vertical,
  {
    flexBasis: container4
  },
  media(
    { minWidth: container4 * 8 },
    {
      flexBasis: container8
    }
  )
);
const table = style(
  csstips.flex,
  csstips.horizontal,
  csstips.wrap,
  csstips.betweenJustified,
  {
    overflowY: 'scroll',
    $nest: {
      '&>img': {
        marginBottom: 1
      }
    }
  }
);
const nibView = style(csstips.selfCenter, {
  flexBasis: container4,
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
