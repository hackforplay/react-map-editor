import * as csstips from 'csstips/lib';
import * as React from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import ReactResizeDetector from 'react-resize-detector';
import { classes, style } from 'typestyle/lib';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { actions, IPage } from '../redux/palette';
import { Pos, Selection } from '../utils/selection';
import { selectedColor } from './MenuBar';

const padding = 4;
const transparent = 'rgba(255,255,255,0)';
const color = 'rgba(255,255,255,1)';
const tileSize = 32 + 1;
const floatThrethold = 300;

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
    flex: 1,
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
    flex: 0,
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

export function PaletteView() {
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
              className={classes(cn.resizeWrapper, collapsed && cn.collapsed)}
            />
          </div>
        ) : (
          <PaletteContainer />
        )}
      </ReactResizeDetector>
    </div>
  );
}

export interface PaletteContainerProps {
  className?: string;
}

export function PaletteContainer(props: PaletteContainerProps) {
  return (
    <div className={classes(props.className, cn.vertical)}>
      <TileSetsView />
      <NibView />
    </div>
  );
}

function TileSetsView() {
  const pages = useTypedSelector(state => state.palette.pages);

  return (
    <div className={cn.table}>
      {pages.map(page => (
        <PageView key={page.index} {...page} />
      ))}
    </div>
  );
}

function PageView(props: IPage) {
  const [collapsed, setCollapsed] = React.useState(props.row > 1);

  const selection = useTypedSelector(state => state.palette.selection);
  const touchRef = React.useRef(0); // save last touch indentifier of onTouchStart

  const draggingRef = React.useRef(false); // is dragging or swiping?
  const release = React.useCallback(() => {
    draggingRef.current = false;
  }, []);
  React.useEffect(() => {
    window.addEventListener('mouseup', release, { passive: true });
    window.addEventListener('touchend', release, { passive: true });
    return () => {
      window.removeEventListener('mouseup', release);
      window.removeEventListener('touchend', release);
    };
  }, [release]);

  const canOpen = props.row > 1 && collapsed;
  const open = React.useCallback(() => {
    if (canOpen) {
      setCollapsed(false);
    }
  }, [canOpen]);

  const canClose = props.row > 1 && !collapsed;
  const close = React.useCallback(() => {
    if (canClose) {
      setCollapsed(true);
    }
  }, [canClose]);

  const dispatch = useDispatch();
  const start = React.useCallback((pos: Pos) => {
    draggingRef.current = true;
    dispatch(
      actions.setSelection({
        page: props.index,
        start: pos,
        end: pos
      })
    );
  }, []);
  const move = React.useCallback(
    (pos: Pos) => {
      if (!selection || !draggingRef.current) return;
      if (shallowEqual(pos, selection.end)) return;
      dispatch(
        actions.setSelection({
          page: selection.page,
          start: selection.start,
          end: pos
        })
      );
    },
    [selection]
  );
  const handleMouseDown = React.useCallback<React.MouseEventHandler>(
    e => {
      if (collapsed) return;
      start(
        getPos(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())
      );
    },
    [collapsed, start]
  );
  const handleMouseMove = React.useCallback<React.MouseEventHandler>(
    e => {
      if (collapsed) return;
      move(
        getPos(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect())
      );
    },
    [collapsed, move]
  );
  const handleTouchStart = React.useCallback<React.TouchEventHandler>(
    e => {
      const p = e.touches.item(0);
      if (collapsed || !p) return;
      start(
        getPos(p.clientX, p.clientY, e.currentTarget.getBoundingClientRect())
      );
      touchRef.current = p.identifier;
    },
    [collapsed, start]
  );
  const handleTouchMove = React.useCallback<React.TouchEventHandler>(
    e => {
      const p = e.touches.item(0);
      if (collapsed || !p || p.identifier !== touchRef.current) return;
      move(
        getPos(p.clientX, p.clientY, e.currentTarget.getBoundingClientRect())
      );
    },
    [collapsed, move]
  );

  return (
    <div style={{ paddingTop: padding }}>
      <div
        style={{
          padding,
          paddingBottom: collapsed ? 0 : padding,
          width: '100%',
          backgroundColor: color,
          borderRadius: 2,
          overflow: 'hidden',
          cursor: canOpen ? 'pointer' : 'inherit'
        }}
        onClick={open}
      >
        <div
          style={{
            position: 'relative',
            height: 0,
            paddingTop: collapsed ? '12.5%' : `${12.5 * props.row}%`,
            width: '100%',
            transition: 'padding-top 200ms'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={release}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={release}
        >
          <img
            src={props.src}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transformOrigin: 'top',
              transform: collapsed ? 'scaleY(0.5)' : 'none'
            }}
            draggable={false}
          />
          {selection && selection.page === props.index && !collapsed ? (
            <SelectionView selection={selection} row={props.row} />
          ) : null}
          {collapsed ? (
            <div
              style={{
                position: 'absolute',
                background: `linear-gradient(${transparent},${transparent},${color})`,
                height: '100%',
                width: '100%',
                top: 0,
                zIndex: 1
              }}
            />
          ) : null}
        </div>
        {canClose ? (
          <div
            style={{
              height: 32,
              textAlign: 'center',
              width: '100%',
              cursor: 'pointer',
              fontSize: 28 // TODO: SVG にする
            }}
            onClick={close}
          >
            ー
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface SelectionViewProps {
  selection: Selection;
  row: number;
}

function SelectionView({ selection: { start, end }, row }: SelectionViewProps) {
  const left = Math.min(start.col, end.col);
  const top = Math.min(start.row, end.row);
  const right = Math.max(start.col, end.col) + 1;
  const bottom = Math.max(start.row, end.row) + 1;
  return (
    <div
      style={{
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: selectedColor,
        boxSizing: 'border-box',
        position: 'absolute',
        left: `${left * 12.5}%`,
        top: `${(top / row) * 100}%`,
        width: `${(right - left) * 12.5}%`,
        height: `${((bottom - top) / row) * 100}%`,
        zIndex: 1
      }}
    />
  );
}

function NibView() {
  const nib = useTypedSelector(state => state.palette.nib);

  return (
    <div className={cn.nibView}>
      {nib &&
        nib.map((row, i) => (
          <div key={i}>
            {row.map(tile =>
              tile.index > 0 ? (
                <img
                  key={tile.index}
                  src={tile.src}
                  alt="NOT FOUND"
                  draggable={false}
                />
              ) : null
            )}
          </div>
        ))}
    </div>
  );
}

function getPos(
  x: number,
  y: number,
  bound: { left: number; top: number; width: number; height: number }
): Pos {
  const tileSize = bound.width / 8;
  const col = ((x - bound.left) / tileSize) | 0;
  const row = ((y - bound.top) / tileSize) | 0;
  return {
    row,
    col,
    num: col + row * 8
  };
}
