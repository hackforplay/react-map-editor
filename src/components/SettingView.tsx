import * as React from 'react';
import { useRecoilState } from 'recoil';
import { style } from 'typestyle/lib';
import GridOn from '../icons/GridOn';
import { debugState } from '../recoils';
import { IconButton } from './IconButton';
import { Paper } from './Paper';

const root = style({
  paddingTop: 16,
  paddingRight: 16
});
const container = style({
  display: 'flex',
  alignItems: 'center',
  height: 56,
  minWidth: 120
});

export function SettingView() {
  const [debug, setDebug] = useRecoilState(debugState);

  const toggleDebug = React.useCallback(() => {
    setDebug(debug => !debug);
  }, []);

  return (
    <div className={root}>
      <Paper className={container}>
        <IconButton
          active={debug}
          label="はんてい"
          margin
          onClick={toggleDebug}
        >
          <GridOn />
        </IconButton>
      </Paper>
    </div>
  );
}
