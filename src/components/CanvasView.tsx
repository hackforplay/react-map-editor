import * as React from 'react';
import { style } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { render } from '@hackforplay/next';
import { StateProps, DispatchProps } from '../containers/CanvasView';
import { cursorClasses } from '../utils/cursor';

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

  const { cursorMode, rootScene } = props;
  const cursor = cursorClasses[cursorMode];
  const {
    map: {
      tables: [table]
    }
  } = rootScene;
  const height = table.length * 32;
  const width = table[0].length * 32;

  React.useEffect(() => {
    return () => {
      if (renderRoot.current) {
        render(props.rootScene, renderRoot.current);
      }
    };
  }, [props.rootScene]);

  return (
    <div className={cn.root}>
      <div className={cn.renderRoot} ref={renderRoot}>
        <canvas
          className={cursor}
          width={width}
          height={height}
          onMouseEnter={props.onCanvasMouseEnter}
          onMouseLeave={props.onCanvasMouseLeave}
          onMouseDown={props.onCanvasMouseDown}
          onMouseMove={props.onCanvasMouseMove}
          onMouseUp={props.onCanvasMouseUp}
        />
      </div>
    </div>
  );
}
