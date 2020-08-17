import * as React from 'react';
import { style } from 'typestyle/lib';
import { CanvasView } from './CanvasView';
import { MenuBar } from './MenuBar';
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
  width: 306
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
    <div className={root} style={props.style}>
      <div className={sidePannel}>
        <MenuBar />
        <PaletteView />
      </div>
      <div className={mainPannel}>
        <SettingView />
        <CanvasView />
      </div>
    </div>
  );
}
