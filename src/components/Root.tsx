import * as csstips from 'csstips/lib';
import * as React from 'react';
import { style } from 'typestyle/lib';
import { CanvasView } from './CanvasView';
import { MenuBar, menuBarHeight } from './MenuBar';
import { PaletteView } from './PaletteView';
import { SettingView } from './SettingView';

export interface RootProps {
  style?: React.CSSProperties;
}

const root = style({
  height: '100%'
});
const container = style(csstips.flex, csstips.horizontal, {
  height: `calc(100% - ${menuBarHeight}px)`,
  backgroundColor: 'lightgrey'
});

export function Root(props: RootProps) {
  return (
    <div className={root} style={props.style}>
      <div className={container}>
        <SettingView />
        <CanvasView />
        <PaletteView />
      </div>
      <MenuBar />
    </div>
  );
}
