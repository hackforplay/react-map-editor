import * as csstips from 'csstips/lib';
import * as React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { classes, style } from 'typestyle/lib';
import ExpandLess from '../icons/ExpandLess';
import {
  cursorModeState,
  palettePagesState,
  paletteSelectionState
} from '../recoils';
import { IPage } from '../recoils/types';
import { colors } from '../utils/colors';
import { Pos } from '../utils/selection';
import { shallowEqual } from '../utils/shallowEqual';
import { ErrorBoundary } from './ErrorBoundary';
import { IconButton } from './IconButton';
import { Paper } from './Paper';

const padding = 4;
const transparent = 'rgba(255,255,255,0)';
const tileSize = 32 + 1;
const floatThrethold = 300;

const cn = {
  root: style(csstips.flex1, csstips.vertical, {
    margin: 16,
    marginTop: 0,
    flexBasis: floatThrethold,
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  }),
  expandLessWrapper: style({
    width: '100%',
    marginTop: 8,
    textAlign: 'center'
  }),
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
        borderColor: colors.selected
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
  })
};

export function PaletteView() {
  return (
    <div className={cn.root}>
      <ErrorBoundary>
        <React.Suspense fallback="Loading...">
          <TileSetsView />
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

function TileSetsView() {
  const pages = useRecoilValue(palettePagesState);

  return React.useMemo(
    () => (
      <div className={cn.table}>
        {pages.map(page => (
          <PageView key={page.index} {...page} />
        ))}
      </div>
    ),
    [pages]
  );
}

function PageView(props: IPage) {
  const [collapsed, setCollapsed] = React.useState(props.row > 1);

  const setSelection = useSetRecoilState(paletteSelectionState);
  const setCursorMode = useSetRecoilState(cursorModeState);
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

  const start = React.useCallback((pos: Pos) => {
    draggingRef.current = true;
    setSelection({
      page: props.index,
      start: pos,
      end: pos
    });
    setCursorMode('pen');
  }, []);
  const move = React.useCallback((pos: Pos) => {
    if (!draggingRef.current) return;
    setSelection(selection => {
      if (!selection) return selection;
      if (shallowEqual(pos, selection.end)) return selection;

      return {
        page: selection.page,
        start: selection.start,
        end: pos
      };
    });
  }, []);
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
      <Paper
        style={{
          padding,
          paddingBottom: collapsed ? 0 : padding,
          width: '100%',
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
              touchAction: 'none',
              transformOrigin: 'top',
              transform: collapsed ? 'scaleY(0.5)' : 'none'
            }}
            draggable={false}
          />
          {collapsed ? null : (
            <SelectionView page={props.index} row={props.row} />
          )}
          {collapsed ? (
            <div
              style={{
                position: 'absolute',
                background: `linear-gradient(${transparent},${transparent},${colors.paper})`,
                height: '100%',
                width: '100%',
                top: 0,
                zIndex: 1
              }}
            />
          ) : null}
        </div>
        {canClose ? (
          <IconButton className={cn.expandLessWrapper} onClick={close}>
            <ExpandLess />
          </IconButton>
        ) : null}
      </Paper>
    </div>
  );
}

interface SelectionViewProps {
  page: number;
  row: number;
}

function SelectionView({ page, row }: SelectionViewProps) {
  const selection = useRecoilValue(paletteSelectionState);
  if (!selection || selection.page !== page) return null;

  const { start, end } = selection;
  const left = Math.min(start.col, end.col);
  const top = Math.min(start.row, end.row);
  const right = Math.max(start.col, end.col) + 1;
  const bottom = Math.max(start.row, end.row) + 1;
  return (
    <div
      style={{
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: colors.selected,
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

function getPos(
  x: number,
  y: number,
  bound: { left: number; top: number; width: number; height: number }
): Pos {
  const tileSize = bound.width / 8;
  const col = Math.max(0, (x - bound.left) / tileSize) | 0;
  const row = Math.max(0, (y - bound.top) / tileSize) | 0;
  return {
    row,
    col,
    num: col + row * 8
  };
}
