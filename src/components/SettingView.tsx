import * as React from 'react';
import { useRecoilState } from 'recoil';
import { classes, style } from 'typestyle/lib';
import GridOn from '../icons/GridOn';
import { debugState } from '../recoils';
import { colors } from '../utils/colors';
import { IconButton } from './IconButton';

const root = style({
  paddingTop: 16,
  paddingRight: 16
});
const container = style({
  display: 'flex',
  alignItems: 'center',
  height: 56,
  minWidth: 120,
  backgroundColor: colors.paper
});

export function SettingView() {
  const [debug, setDebug] = useRecoilState(debugState);

  const toggleDebug = React.useCallback(() => {
    setDebug(debug => !debug);
  }, []);

  return (
    <div className={root}>
      <div className={container}>
        <IconButton
          active={debug}
          label="はんてい"
          margin
          onClick={toggleDebug}
        >
          <GridOn />
        </IconButton>
      </div>
    </div>
  );
}
