import { render } from '@hackforplay/next';
import * as csstips from 'csstips/lib';
import * as React from 'react';
import { style } from 'typestyle/lib';
import { DispatchProps, StateProps } from '../containers/CanvasView';
import Cursor, { cursorClasses } from '../utils/cursor';

export type Props = StateProps & DispatchProps;

const cn = {
  root: style(csstips.flex8),
  renderRoot: style({
    width: '100%',
    height: '100%',
    padding: 16,
    overflow: 'scroll'
  })
};

export function CanvasView(props: Props) {
  const renderRoot = React.useRef<HTMLDivElement>(null);
  const [mutate] = React.useState({
    px: -1,
    py: -1,
    pressed: false,
    id: 0
  });

  const { mode, rootScene } = props;
  const cursor = cursorClasses[mode.cursorMode];
  const {
    map: {
      tables: [table]
    }
  } = rootScene;
  const height = table.length * 32;
  const width = table[0].length * 32;

  React.useEffect(() => {
    if (renderRoot.current && !props.loading) {
      render(props.rootScene, renderRoot.current);
    }
  }, [props.rootScene, props.loading]);

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
      props.draw(
        new Cursor(x, y, props.mode.cursorMode, props.mode.nib, mutate.id)
      );
    }
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mutate.px = -1;
    mutate.py = -1;
    mutate.pressed = true;
    mutate.id++;
    handleMove(e);
  };

  return (
    <div className={cn.root}>
      <div className={cn.renderRoot} ref={renderRoot}>
        <canvas
          className={cursor}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseUp={() => (mutate.pressed = false)}
          onMouseLeave={() => (mutate.pressed = false)}
          onMouseMove={handleMove}
        />
      </div>
    </div>
  );
}
