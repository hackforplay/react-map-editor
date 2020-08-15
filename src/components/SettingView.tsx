import * as React from 'react';
import { useRecoilState } from 'recoil';
import { classes, style } from 'typestyle/lib';
import GridOn from '../icons/GridOn';
import { debugState } from '../recoils';
import { colors } from '../utils/colors';

const root = style({
  paddingTop: 16,
  paddingRight: 16
});
const container = style({
  height: 48,
  minWidth: 120,
  backgroundColor: colors.paper
});

const collider = {
  icon: style({
    margin: 8,
    width: '1.25em',
    height: '1.25em',
    fontSize: 24
  }),
  on: style({
    fill: colors.selected
  }),
  off: style({
    fill: colors.icon
  })
};

export function SettingView() {
  const [debug, setDebug] = useRecoilState(debugState);

  const toggleDebug = React.useCallback(() => {
    console.log('clicked');
    setDebug(debug => !debug);
  }, []);

  return (
    <div className={root}>
      <div className={container}>
        <GridOn
          className={classes(collider.icon, debug ? collider.on : collider.off)}
          onClick={toggleDebug}
        />
      </div>
    </div>
  );
}
