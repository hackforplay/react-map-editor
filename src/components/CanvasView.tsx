import { CanvasRenderer } from '@hackforplay/next';
import * as csstips from 'csstips/lib';
import * as React from 'react';
import {
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState
} from 'recoil';
import { classes, style } from 'typestyle/lib';
import {
  cursorModeState,
  editingState,
  nibSizeState,
  paletteNibState,
  paletteSelectionState,
  preloadNibState,
  sceneScreenState,
  sceneState
} from '../recoils';
import { useDropper } from '../recoils/useDropper';
import Cursor, { cursorClasses } from '../utils/cursor';
import { getMatrix } from '../utils/selection';
import { editWithCursor } from '../utils/updateScene';
import { Paper } from './Paper';

const cn = {
  root: style(csstips.flex1, {
    padding: 16,
    paddingLeft: 0,
    paddingTop: 8,
    overflow: 'hidden'
  }),
  renderRoot: style({
    width: '100%',
    height: '100%',
    padding: 16,
    boxSizing: 'border-box',
    overflow: 'scroll'
  }),
  scroller: style({
    paddingRight: 100,
    paddingBottom: 100,
    boxSizing: 'content-box',
    position: 'relative'
  }),
  mainCanvas: style({
    position: 'absolute',
    left: 0,
    top: 0
  }),
  nibCanvas: style({
    position: 'absolute',
    zIndex: 1,
    pointerEvents: 'none',
    left: 0,
    top: 0
  }),
  disableTouchAction: style({
    /**
     * https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
     * iOS 11 Safari では 'manipulation' だと Double Tap Zoom を防げなかった
     */
    touchAction: 'none'
  })
};

export function CanvasView() {
  const cursorMode = useRecoilValue(cursorModeState);
  const nibLoadable = useRecoilValueLoadable(paletteNibState);
  const preloaded = useRecoilValueLoadable(preloadNibState);

  const cursor =
    cursorMode === 'pen' && preloaded.state !== 'hasValue'
      ? cursorClasses.nope // not-allowed
      : cursorClasses[cursorMode];

  const { width, height } = useRecoilValue(sceneScreenState);
  const canvasRendererRef = React.useRef<CanvasRenderer>();
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || canvasRendererRef.current) return;
    canvasRendererRef.current = new CanvasRenderer(container, {
      width,
      height
    });
  }, [containerRef.current]);

  const nibCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const updateNibCanvas = useRecoilCallback(
    async ({ getLoadable }, { x, y }: { x: number; y: number }) => {
      const canvas = nibCanvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      const selectionLoadable = getLoadable(paletteSelectionState);
      let rows = 0;
      let cols = 0;
      if (selectionLoadable.state === 'hasValue') {
        const selection = selectionLoadable.contents;
        if (selection) {
          const matrix = getMatrix(selection);
          rows = matrix.length;
          cols = matrix[0]?.length || 0;
        }
      }
      const nibSizeLoadable = getLoadable(nibSizeState);
      if (
        nibSizeLoadable.state === 'hasValue' &&
        nibSizeLoadable.contents > 1
      ) {
        rows = cols = nibSizeLoadable.contents;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#333';
      ctx.strokeRect(x * 32, y * 32, 32 * cols, 32 * rows);
    },
    [nibCanvasRef.current]
  );
  const clearNibCanvas = React.useCallback(() => {
    const canvas = nibCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [nibCanvasRef.current]);

  const scene = useRecoilValue(sceneState);
  React.useEffect(() => {
    const canvasRenderer = canvasRendererRef.current;
    if (!canvasRenderer) return;
    canvasRenderer.update(scene);
  }, [scene]);

  const [mutate] = React.useState({
    px: -1,
    py: -1,
    pressed: false,
    id: 0
  });
  const start = React.useCallback(() => {
    mutate.px = -1;
    mutate.py = -1;
    mutate.pressed = true;
    mutate.id++;
  }, []);
  const update = React.useCallback((x: number, y: number) => {
    mutate.px = x;
    mutate.py = y;
  }, []);
  const stop = React.useCallback(() => {
    mutate.pressed = false;
    clearNibCanvas();
  }, []);

  const setDropper = useDropper();
  const setEditing = useSetRecoilState(editingState);
  const handleMove = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const { left, top } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / 32) >> 0;
      const y = ((e.clientY - top) / 32) >> 0;
      updateNibCanvas({ x, y });
      if (!mutate.pressed) return;
      if (nibLoadable.state !== 'hasValue') return;
      if (cursorMode === 'pen' && preloaded.state !== 'hasValue') {
        return; // Nib のロードが完了していない
      }
      if (cursorMode === 'dropper') {
        // スポイトで色を吸い取る
        setDropper(x, y);
        stop();
      } else if (x !== mutate.px || y !== mutate.py) {
        update(x, y);
        const cursor = new Cursor(
          x,
          y,
          cursorMode,
          nibLoadable.contents,
          mutate.id
        );
        setEditing(current => editWithCursor(current, cursor));
      }
    },
    [cursorMode, nibLoadable, preloaded]
  );
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      start();
      handleMove(e);
    },
    [handleMove]
  );
  React.useEffect(() => {
    window.addEventListener('mouseup', stop, { passive: true });
    return () => {
      window.removeEventListener('mouseup', stop);
    };
  }, []);

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      const primary = e.touches.item(0);
      const { left, top } = e.currentTarget.getBoundingClientRect();
      const x = ((primary.clientX - left) / 32) >> 0;
      const y = ((primary.clientY - top) / 32) >> 0;
      updateNibCanvas({ x, y });
      if (!mutate.pressed) return;
      if (nibLoadable.state !== 'hasValue') return;
      if (cursorMode === 'pen' && preloaded.state !== 'hasValue') {
        return; // Nib のロードが完了していない
      }
      e.nativeEvent.preventDefault(); // 指でスクロールするのを防ぐ
      if (x !== mutate.px || y !== mutate.py) {
        update(x, y);
        const cursor = new Cursor(
          x,
          y,
          cursorMode,
          nibLoadable.contents,
          mutate.id
        );
        setEditing(current => editWithCursor(current, cursor));
      }
    },
    [cursorMode, nibLoadable, preloaded]
  );
  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      start();
      handleTouchMove(e);
    },
    [handleTouchMove]
  );

  // Disable scroll on mobile browser
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.ontouchmove = e => e.preventDefault();
  }, [canvasRef.current]);

  return (
    <div className={cn.root}>
      <Paper id="rme-canvas-view" className={cn.renderRoot} ref={containerRef}>
        <div
          style={{
            width: width,
            height: height
          }}
          className={cn.scroller}
        >
          <canvas
            className={classes(cursor, cn.disableTouchAction, cn.mainCanvas)}
            width={width}
            height={height}
            onTouchStart={handleTouchStart}
            onTouchCancel={stop}
            onTouchEnd={stop}
            onTouchMove={handleTouchMove}
            onMouseDown={handleMouseDown}
            onMouseUp={stop}
            onMouseMove={handleMove}
            onMouseLeave={stop}
          />
          <canvas
            className={cn.nibCanvas}
            width={width}
            height={height}
            ref={nibCanvasRef}
          />
        </div>
      </Paper>
    </div>
  );
}
