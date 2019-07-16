import * as csstips from 'csstips/lib';
import * as React from 'react';
import { style } from 'typestyle/lib';

const container = style(csstips.flex1, {
  minWidth: 120
});

export function LayerView() {
  return <div className={container} />;
}
