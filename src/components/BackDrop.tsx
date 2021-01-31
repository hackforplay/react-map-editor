import { Fade } from '@material-ui/core';
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { style } from 'typestyle';
import { cursorModeState } from '../recoils';

const zIndex = 1000;

export const bringFront = style({
  zIndex: zIndex + 1
});

const backdrop = style({
  position: 'absolute',
  zIndex,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  touchAction: 'none'
});

export function BackDrop() {
  const mode = useRecoilValue(cursorModeState);
  return (
    <Fade in={mode === 'base' || mode === 'dropper'}>
      <div className={backdrop}></div>
    </Fade>
  );
}
