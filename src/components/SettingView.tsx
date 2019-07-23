import * as csstips from 'csstips/lib';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { style } from 'typestyle/lib';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { actions } from '../redux/canvas';

const container = style(csstips.flex1, {
  minWidth: 120
});

export function SettingView() {
  const dispatch = useDispatch();
  const debug = useTypedSelector(state => state.canvas.debug);

  const toggleDebug = React.useCallback(() => {
    dispatch(actions.initMap({ debug: !debug }));
  }, [debug]);

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
