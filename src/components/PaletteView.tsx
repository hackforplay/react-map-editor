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
        marginBottom: 1,
        cursor: 'copy'
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
        <div
          className={table}
          onMouseUp={() => this.props.confirmSelection()}
          onMouseLeave={() => this.props.confirmSelection()}
        >
          {this.props.tileSet.map((square, num) => (
            <img
              key={square.index}
              src={square.tile.image.src}
              alt="tile"
              draggable={false}
              onMouseDown={() =>
                this.props.startSelection({
                  row: (num / 8) >> 0,
                  col: num % 8,
                  num: num
                })
              }
              onMouseMove={() =>
                this.props.updateSelection({
                  row: (num / 8) >> 0,
                  col: num % 8,
                  num: num
                })
              }
            />
          ))}
        </div>
        <div className={nibView}>
          {this.props.nib && (
            <img
              src={this.props.nib.tile.image.src}
              alt="selected tile"
              draggable={false}
            />
          )}
        </div>
      </div>
    );
  }
}
