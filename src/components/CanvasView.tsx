import * as React from 'react';
import { style } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { render } from '@hackforplay/next';
import { StateProps, DispatchProps } from '../containers/CanvasView';
import { cursorClasses } from '../utils/cursor';

export type Props = StateProps & DispatchProps;

export interface State {
  hackforplayRootNode: HTMLElement | null;
}

const container = style(csstips.flex8);
const hackforplayRootNode = style({
  width: '100%',
  height: '100%',
  padding: 16
});

export default class CanvasView extends React.Component<Props, State> {
  componentDidUpdate() {
    if (this.state.hackforplayRootNode && !this.props.loading) {
      render(this.props.rootScene, this.state.hackforplayRootNode);
    }
  }

  setRoot = (hackforplayRootNode: HTMLDivElement | null) => {
    this.setState({ hackforplayRootNode });
  };

  render() {
    const { cursorMode, rootScene } = this.props;
    const cursor = cursorClasses[cursorMode];
    const {
      map: {
        tables: [table]
      }
    } = rootScene;
    const height = table.length * 32;
    const width = table[0].length * 32;
    return (
      <div className={container}>
        <div className={hackforplayRootNode} ref={this.setRoot}>
          <canvas
            className={cursor}
            width={width}
            height={height}
            onMouseEnter={this.props.onCanvasMouseEnter}
            onMouseLeave={this.props.onCanvasMouseLeave}
            onMouseDown={this.props.onCanvasMouseDown}
            onMouseMove={this.props.onCanvasMouseMove}
            onMouseUp={this.props.onCanvasMouseUp}
          />
        </div>
      </div>
    );
  }
}
