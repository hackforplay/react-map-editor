import * as csstips from 'csstips/lib';
import * as React from 'react';
import { useRecoilState } from 'recoil';
import { style } from 'typestyle/lib';
import { debugState } from '../recoils';

const container = style(csstips.flex1, {
  minWidth: 120
});

export function SettingView() {
  const [debug, setDebug] = useRecoilState(debugState);

  const toggleDebug = React.useCallback(() => {
    setDebug(debug => !debug);
  }, []);

  return (
    <div className={container}>
      <label htmlFor="debug">collider: </label>
      <input
        type="checkbox"
        name="debug"
        id="debug"
        checked={debug}
        onChange={toggleDebug}
      />
    </div>
  );
}
