import * as React from 'react';
import { style } from 'typestyle/lib';
import { CanvasView } from './CanvasView';
import { DialogRootProvider } from './Dialog';
import { MenuBar } from './MenuBar';
import { NetworkProvider } from './NetworkProvider';
import { PaletteView } from './PaletteView';
import { SettingView } from './SettingView';

export interface RootProps {
  style?: React.CSSProperties;
}

const root = style({
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  backgroundColor: 'lightgrey'
});
const sidePannel = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  width: 310
});
const mainPannel = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  overflow: 'hidden'
});

export function Root(props: RootProps) {
  return (
    <React.Suspense fallback="Loading...">
      <div className={root} style={props.style}>
        <div className={sidePannel}>
          <MenuBar />
          <PaletteView />
        </div>
        <div className={mainPannel}>
          <SettingView />
          <CanvasView />
        </div>
        <DialogRootProvider />
        <NetworkProvider />
      </div>
    </React.Suspense>
  );
}
