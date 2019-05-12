import { Square } from '@hackforplay/next';
import * as csstips from 'csstips/lib';
import { flatten } from 'lodash';
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { classes, style } from 'typestyle/lib';
import { DispatchProps, StateProps } from '../containers/PaletteView';
import { Pos } from '../utils/selection';
import { selectedColor } from './MenuBar';

export type Props = StateProps &
  DispatchProps & {
    className?: string;
  };

const tileSize = 32 + 1;
const floatThrethold = 300;
const getPos = (num: number): Pos => ({
  row: (num / 8) >> 0,
  col: num % 8,
  num
});

const cn = {
  root: style(csstips.vertical, {
    flexBasis: floatThrethold,
    height: '100%',
    position: 'relative',
    $nest: {
      '&>*': {
        height: '100%'
      }
    }
  }),
  floating: style({
    position: 'absolute',
    right: 0,
    top: 0,
    display: 'flex'
  }),
  resizeWrapper: style({
    transition: 'width 250ms',
    backgroundColor: 'rgb(218,218,218)',
    overflow: 'hidden'
  }),
  collapsed: style({
    width: 0
  }),
  vertical: style(csstips.vertical),
  table: style({
    overflowY: 'scroll',
    overflowX: 'hidden',
    width: tileSize * 8,
    boxSizing: 'content-box',
    paddingRight: 10,
    $nest: {
      '&>img': {
        boxSizing: 'border-box',
        cursor: 'copy',
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderColor: 'transparent',
        width: '12.5%',
        height: 'auto',
        marginBottom: -3 // うまく height が計算されない？列方向に謎の空白が生まれる
      },
      '&>img.selected': {
        borderColor: selectedColor
      },
      '&::-webkit-scrollbar': {
        width: 10
      },
      '&::-webkit-scrollbar-track': {
        borderRadius: 4,
        backgroundColor: 'rgb(255,255,255)'
      },
      '&::-webkit-scrollbar-thumb': {
        borderRadius: 4,
        backgroundColor: 'rgb(62,62,62)'
      }
    }
  }),
  nibView: style(csstips.selfCenter, csstips.vertical, {
    flexBasis: tileSize * 5,
    minHeight: tileSize * 5,
    justifyContent: 'center',
    $nest: {
      '&>div': {
        height: tileSize
      }
    }
  })
};

export function PaletteView(props: Props) {
  const [floating, setFloating] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className={cn.root}>
      <ReactResizeDetector
        handleWidth
        onResize={width => setFloating(width < floatThrethold)}
      >
        {floating ? (
          <div className={cn.floating}>
            <button onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? '◀︎' : '▶︎'}
            </button>
            <PaletteContainer
              {...props}
              className={classes(cn.resizeWrapper, collapsed && cn.collapsed)}
            />
          </div>
        ) : (
          <PaletteContainer {...props} />
        )}
      </ReactResizeDetector>
    </div>
  );
}

export function PaletteContainer(props: Props) {
  return (
    <div className={classes(props.className, cn.vertical)}>
      <TileSetsView {...props} />
      <NibView nib={props.nib} />
    </div>
  );
}

function TileSetsView(props: Props) {
  const [mutate] = React.useState({
    start: getPos(-1),
    end: getPos(-1),
    pressed: false
  });

  const nibSquares = flatten(props.nib);
  const selected = (square: Square) =>
    nibSquares.some(n => n.index === square.index) ? 'selected' : '';

  const handleMouseDown = (num: number) => {
    mutate.pressed = true;
    mutate.start = getPos(num);
    mutate.end = getPos(-1);
    handleMove(num);
  };
  const handleMove = (num: number) => {
    if (!mutate.pressed) return;
    if (mutate.end.num !== num) {
      mutate.end = getPos(num);
      props.setSelection({
        start: mutate.start,
        end: mutate.end
      });
    }
  };
  const handleUnset = () => {
    if (!mutate.pressed) return;
    mutate.pressed = false;
    props.setSelection(null);
  };

  return (
    <div
      className={cn.table}
      onMouseUp={handleUnset}
      onMouseLeave={handleUnset}
    >
      {props.tileSet.map((square, num) => (
        <img
          key={square.index}
          src={square.tile.image.src}
          alt="tile"
          className={selected(square)}
          draggable={false}
          onMouseDown={() => handleMouseDown(num)}
          onMouseMove={() => handleMove(num)}
        />
      ))}
    </div>
  );
}

function NibView(props: { nib: Square[][] | null }) {
  return (
    <div className={cn.nibView}>
      {props.nib &&
        props.nib.map((row, i) => (
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
  );
}
