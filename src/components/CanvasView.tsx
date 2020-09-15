import { CanvasRenderer } from '@hackforplay/next';
import * as csstips from 'csstips/lib';
import * as React from 'react';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState
} from 'recoil';
import { classes, style } from 'typestyle/lib';
import {
  cursorModeState,
  editingState,
  paletteNibState,
  preloadNibState,
  sceneScreenState,
  sceneState
} from '../recoils';
import { useDropper } from '../recoils/useDropper';
import Cursor, { cursorClasses } from '../utils/cursor';
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
  }, []);

  const setDropper = useDropper();
  const setEditing = useSetRecoilState(editingState);
  const handleMove = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!mutate.pressed) return;
      if (nibLoadable.state !== 'hasValue') return;
      if (cursorMode === 'pen' && preloaded.state !== 'hasValue') {
        return; // Nib のロードが完了していない
      }
      const { offsetLeft, offsetTop, parentElement } = e.currentTarget;
      const x =
        ((e.pageX -
          offsetLeft +
          (parentElement ? parentElement.scrollLeft : 0)) /
          32) >>
        0;
      const y =
        ((e.pageY - offsetTop + (parentElement ? parentElement.scrollTop : 0)) /
          32) >>
        0;
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
      if (!mutate.pressed) return;
      if (nibLoadable.state !== 'hasValue') return;
      if (cursorMode === 'pen' && preloaded.state !== 'hasValue') {
        return; // Nib のロードが完了していない
      }
      e.nativeEvent.preventDefault(); // 指でスクロールするのを防ぐ
      const { offsetLeft, offsetTop, parentElement } = e.currentTarget;
      const primary = e.touches.item(0);
      const x =
        ((primary.pageX -
          offsetLeft +
          (parentElement ? parentElement.scrollLeft : 0)) /
          32) >>
        0;
      const y =
        ((primary.pageY -
          offsetTop +
          (parentElement ? parentElement.scrollTop : 0)) /
          32) >>
        0;
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
        <canvas
          className={classes(cursor, cn.disableTouchAction)}
          width={width}
          height={height}
          onTouchStart={handleTouchStart}
          onTouchCancel={stop}
          onTouchEnd={stop}
          onTouchMove={handleTouchMove}
          onMouseDown={handleMouseDown}
          onMouseUp={stop}
          onMouseMove={handleMove}
        />
      </Paper>
    </div>
  );
}
