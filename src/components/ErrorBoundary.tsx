import * as React from 'react';

export class ErrorBoundary extends React.PureComponent {
  state = { error: false };

  static getDerivedStateFromError() {
    return { error: true };
  }

  componentDidCatch(error: Error) {
    console.log(error);
  }

  render() {
    if (this.state.error) {
      return (
        <>
          <h1>😭</h1>
          <small>Error...</small>
        </>
      );
    }
    return this.props.children;
  }
}
