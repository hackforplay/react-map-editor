import { SceneMap } from '@hackforplay/next';
import * as csstips from 'csstips/lib';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { style } from 'typestyle/lib';
import { actions as canvasActions } from '../redux/canvas';
import { actions as paletteActions } from '../redux/palette';
import { CanvasView } from './CanvasView';
import { SettingView } from './SettingView';
import { MenuBar, menuBarHeight } from './MenuBar';
import { PaletteView } from './PaletteView';

export interface RootProps {
  map?: SceneMap;
}

const root = style({
  height: '100%'
});
const container = style(csstips.flex, csstips.horizontal, {
  height: `calc(100% - ${menuBarHeight}px)`,
  backgroundColor: 'lightgrey'
});

export function Root(props: RootProps) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (props.map) {
      dispatch(
        canvasActions.initMap({
          map: props.map
        })
      );
    }
    dispatch(paletteActions.loadPages.started({}));
  }, []);

  return (
    <div className={root}>
      <div className={container}>
        <SettingView />
        <CanvasView />
        <PaletteView />
      </div>
      <MenuBar />
    </div>
  );
}
