import { CanvasRenderer } from '@hackforplay/next';
import * as csstips from 'csstips/lib';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { style } from 'typestyle/lib';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { actions } from '../redux/canvas';
import Cursor, { cursorClasses } from '../utils/cursor';

const cn = {
  root: style(csstips.flex8),
  renderRoot: style({
    width: '100%',
    height: '100%',
    padding: 16,
    overflow: 'scroll'
  })
};

export function CanvasView() {
  const mode = useTypedSelector(state => state.mode);
  const nib = useTypedSelector(state => state.palette.nib);
  const cursor = cursorClasses[mode.cursorMode];

  const [height] = React.useState(10 * 32); // TODO: 可変
  const [width] = React.useState(15 * 32); // TODO: 可変
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

  const [mutate] = React.useState({
    px: -1,
    py: -1,
    pressed: false,
    id: 0
  });

  const sceneMap = useTypedSelector(state => state.canvas);
  React.useEffect(() => {
    const canvasRenderer = canvasRendererRef.current;
    if (!canvasRenderer) return;
    canvasRenderer.update({
      debug: true,
      map: sceneMap,
      screen: {
        width,
        height
      }
    });
  }, [sceneMap, width, height]);

  const dispatch = useDispatch();
  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!mutate.pressed) return;
    const { offsetLeft, offsetTop, parentElement } = e.currentTarget;
    const x =
      ((e.clientX -
        offsetLeft +
        (parentElement ? parentElement.scrollLeft : 0)) /
        32) >>
      0;
    const y =
      ((e.clientY - offsetTop + (parentElement ? parentElement.scrollTop : 0)) /
        32) >>
      0;
    if (x !== mutate.px || y !== mutate.py) {
      mutate.px = x;
      mutate.py = y;
      dispatch(actions.draw(new Cursor(x, y, mode.cursorMode, nib, mutate.id)));
    }
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mutate.px = -1;
    mutate.py = -1;
    mutate.pressed = true;
    mutate.id++;
    handleMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!mutate.pressed) return;
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
      mutate.px = x;
      mutate.py = y;
      dispatch(actions.draw(new Cursor(x, y, mode.cursorMode, nib, mutate.id)));
    }
  };
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    mutate.px = -1;
    mutate.py = -1;
    mutate.pressed = true;
    mutate.id++;
    handleTouchMove(e);
  };

  return (
    <div className={cn.root}>
      <div className={cn.renderRoot} ref={containerRef}>
        <canvas
          className={cursor}
          width={width}
          height={height}
          onTouchStart={handleTouchStart}
          onTouchCancel={() => (mutate.pressed = false)}
          onTouchEnd={() => (mutate.pressed = false)}
          onTouchMove={handleTouchMove}
          onMouseDown={handleMouseDown}
          onMouseUp={() => (mutate.pressed = false)}
          onMouseLeave={() => (mutate.pressed = false)}
          onMouseMove={handleMove}
        />
      </div>
    </div>
  );
}
