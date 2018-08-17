import * as React from 'react';
import { style, media } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { Square } from '@hackforplay/next';
import { flatten } from 'lodash';
import { StateProps, DispatchProps } from '../containers/PaletteView';
import { selectedColor } from './MenuBar';
import getScrollbarWidth from '../utils/getScrollbarWidth';

export type Props = StateProps & DispatchProps;

const tileSize = 32;
const container8 = (tileSize + 1) * 8 - 1;

const table = style(
  csstips.flex,
  csstips.horizontal,
  csstips.wrap,
  csstips.betweenJustified,
  {
    overflowY: 'scroll',
    $nest: {
      '&>img': {
        cursor: 'copy',
        boxSizing: 'content-box',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'transparent',
        width: tileSize,
        height: tileSize,
        margin: -1,
        marginBottom: 0
      },
      '&>img.selected': {
        borderColor: selectedColor
      }
    }
  }
);
const nibView = style(csstips.selfCenter, csstips.vertical, {
  flexBasis: tileSize * 5,
  justifyContent: 'center',
  $nest: {
    '&>div': {
      height: tileSize
    }
  }
});

export default class PaletteView extends React.Component<Props> {
  render() {
    const nibSquares = flatten(this.props.nib);
    const selected = (square: Square) =>
      nibSquares.some(n => n.index === square.index) ? 'selected' : '';

    const container = style(csstips.vertical, {
      flexBasis: container8 + getScrollbarWidth()
    });

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
              className={selected(square)}
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
          {this.props.nib &&
            this.props.nib.map((row, i) => (
              <div key={i}>
                {row.map((square, j) => (
                  <img
                    key={j}
                    src={square.tile.image.src}
                    alt="selected tile"
                    draggable={false}
                  />
                ))}
              </div>
            ))}
        </div>
      </div>
    );
  }
}
