import * as React from 'react';
import { style } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { render, Scene, loadImages } from '@hackforplay/next';
import { StateProps, DispatchProps } from '../containers/CanvasView';

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
  componentDidMount() {
    this.props.init();
  }

  componentDidUpdate() {
    if (this.state.hackforplayRootNode && this.props.rootScene) {
      render(this.props.rootScene, this.state.hackforplayRootNode);
    }
  }

  setRoot = (hackforplayRootNode: HTMLDivElement | null) => {
    this.setState({ hackforplayRootNode });
  };

  render() {
    return (
      <div className={container}>
        <div className={hackforplayRootNode} ref={this.setRoot}>
          <canvas
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
