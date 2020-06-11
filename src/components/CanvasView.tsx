import { CanvasRenderer } from '@hackforplay/next';
import * as csstips from 'csstips/lib';
import * as React from 'react';
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState
} from 'recoil';
import { style } from 'typestyle/lib';
import {
  cursorModeState,
  paletteNibState,
  sceneMapState,
  sceneScreenState,
  sceneState
} from '../recoils';
import Cursor, { cursorClasses } from '../utils/cursor';
import { updateSceneMap } from '../utils/updateScene';

const cn = {
  root: style(csstips.flex8),
  renderRoot: style({
    width: '100%',
    height: '100%',
    padding: 16,
    boxSizing: 'border-box',
    overflow: 'scroll'
  })
};

export function CanvasView() {
  const cursorMode = useRecoilValue(cursorModeState);
  const nibLoadable = useRecoilValueLoadable(paletteNibState);

  const cursor = cursorClasses[cursorMode];

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

  const setSceneMap = useSetRecoilState(sceneMapState);
  const handleMove = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!mutate.pressed) return;
      if (nibLoadable.state !== 'hasValue') return;
      const { offsetLeft, offsetTop, parentElement } = e.currentTarget;
      const x =
        ((e.clientX -
          offsetLeft +
          (parentElement ? parentElement.scrollLeft : 0)) /
          32) >>
        0;
      const y =
        ((e.clientY -
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
        setSceneMap(current => updateSceneMap(current, cursor));
      }
    },
    [cursorMode, nibLoadable]
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
      const { offsetLeft, offsetTop, parentElement } = e.currentTarget;
      const primary = e.touches.item(0);
      const x =
        ((primary.clientX -
          offsetLeft +
          (parentElement ? parentElement.scrollLeft : 0)) /
          32) >>
        0;
      const y =
        ((primary.clientY -
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
        setSceneMap(current => updateSceneMap(current, cursor));
      }
    },
    [cursorMode, nibLoadable]
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
      <div className={cn.renderRoot} ref={containerRef}>
        <canvas
          className={cursor}
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
      </div>
    </div>
  );
}
