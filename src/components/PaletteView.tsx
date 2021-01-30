import * as csstips from 'csstips/lib';
import * as React from 'react';
import {
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState
} from 'recoil';
import { classes, style } from 'typestyle/lib';
import { useUpdated } from '../hooks/useUpdated';
import ExpandLess from '../icons/ExpandLess';
import {
  baseSelectionState,
  cursorModeState,
  nibWidthState,
  palettePagesState,
  paletteSelectionState,
  preloadNibState
} from '../recoils';
import { IPage } from '../recoils/types';
import { dropperPageAtom } from '../recoils/useDropper';
import { colors } from '../utils/colors';
import { Pos, Selection } from '../utils/selection';
import { shallowEqual } from '../utils/shallowEqual';
import { bringFront } from './BackDrop';
import { ErrorBoundary } from './ErrorBoundary';
import { IconButton } from './IconButton';
import { Img } from './Img';
import { Paper } from './Paper';

const transparent = 'rgba(255,255,255,0)';
const tileSize = 32;
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
  }),
  pageView: style({
    marginBottom: 4
  }),
  paletteWrapper: style({
    position: 'relative'
  })
};

export function PaletteView() {
  const cursorMode = useRecoilValue(cursorModeState);

  return (
    <div className={classes(cn.root, cursorMode === 'base' && bringFront)}>
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

  const start = useRecoilCallback(({ getLoadable, set }, pos: Pos) => {
    if (pos.row >= props.row) return; // 超過している

    const loadable = getLoadable(cursorModeState);
    if (loadable.state !== 'hasValue') return;
    const cursorMode = loadable.contents;

    const selection: Selection = {
      page: props.index,
      start: pos,
      end: pos
    };

    if (cursorMode === 'base') {
      // base の場合は sceneMap を変更する
      set(baseSelectionState, selection);
      set(cursorModeState, 'pen');
    } else {
      // それ以外の場合は nib として選ぶ
      draggingRef.current = true;
      set(paletteSelectionState, selection);
      if (cursorMode !== 'pen') {
        set(cursorModeState, 'pen');
      }
    }
    set(nibWidthState, 1); // ペンの幅を 1 に戻す
  }, []);

  const move = React.useCallback((pos: Pos) => {
    if (!draggingRef.current) return;
    setSelection(selection => {
      if (!selection) return selection;
      if (shallowEqual(pos, selection.end)) return selection;
      if (pos.row >= props.row) return selection; // 超過している

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

  const dropperPage = useRecoilValue(dropperPageAtom);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  useUpdated(() => {
    if (props.index === dropperPage.index) {
      scrollRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      setCollapsed(false);
    }
  }, [props.index, dropperPage]);

  return (
    <div className={cn.pageView}>
      <Paper
        id="rme-palette-view"
        style={{
          padding: 4,
          paddingBottom: collapsed ? 0 : 4,
          cursor: canOpen ? 'pointer' : 'inherit',
          width: tileSize * 8,
          boxSizing: 'content-box'
        }}
        onClick={open}
      >
        <div
          className={cn.paletteWrapper}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={release}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={release}
        >
          <div
            ref={scrollRef}
            style={{
              height: collapsed ? tileSize : tileSize * props.row,
              overflow: 'hidden',
              position: 'relative',
              transition: 'height 200ms'
            }}
          >
            <Img
              src={props.src}
              alt=""
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: tileSize * 8,
                touchAction: 'none',
                transformOrigin: 'top',
                transform: collapsed ? 'scaleY(0.5)' : 'none'
              }}
              draggable={false}
            />
          </div>
          {collapsed ? null : <SelectionView page={props.index} />}
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
}

function SelectionView({ page }: SelectionViewProps) {
  const nibSelection = useRecoilValue(paletteSelectionState);
  const baseSelection = useRecoilValue(baseSelectionState);
  const preloaded = useRecoilValueLoadable(preloadNibState);
  const cursorMode = useRecoilValue(cursorModeState);
  const nibWidth = useRecoilValue(nibWidthState);

  const selection = cursorMode === 'base' ? baseSelection : nibSelection;
  if (!selection || selection.page !== page) return null;

  let { start, end } = selection;
  if (nibWidth > 1) {
    // 太鉛筆の場合は左上のタイルだけが使われる
    if (start.num < end.num) {
      end = start;
    } else {
      start = end;
    }
  }

  return (
    <Rect
      left={Math.min(start.col, end.col)}
      top={Math.min(start.row, end.row)}
      right={Math.max(start.col, end.col) + 1}
      bottom={Math.max(start.row, end.row) + 1}
      cursor={
        preloaded.state === 'loading'
          ? 'progress'
          : preloaded.state === 'hasError'
          ? 'not-allowed'
          : 'initial'
      }
    />
  );
}

interface RectProps {
  left: number;
  top: number;
  right: number;
  bottom: number;
  cursor?: string;
}

function Rect({ left, top, right, bottom, cursor }: RectProps) {
  const borderWidth = 2;

  return (
    <div
      style={{
        cursor,
        borderWidth,
        borderStyle: 'solid',
        borderColor: colors.selected,
        boxSizing: 'border-box',
        position: 'absolute',
        left: `${left * tileSize - borderWidth}px`,
        top: `${top * tileSize - borderWidth}px`,
        width: `${(right - left) * tileSize + borderWidth * 2}px`,
        height: `${(bottom - top) * tileSize + borderWidth * 2}px`,
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
