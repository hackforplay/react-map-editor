import * as React from 'react';
import { style } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { render, Scene } from '@hackforplay/next';
import { StateProps, DispatchProps } from '../containers/CanvasView';
import { cursorClasses } from '../utils/cursor';

export type Props = StateProps & DispatchProps;

export interface State {
  hackforplayRootNode: HTMLElement | null;
  scene: Scene | null;
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
    const cursor = cursorClasses[this.props.cursorMode];
    return (
      <div className={container}>
        <div className={hackforplayRootNode} ref={this.setRoot}>
          <canvas
            className={cursor}
            width={320}
            height={192}
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
