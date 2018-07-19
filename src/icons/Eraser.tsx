import * as React from 'react';

const Eraser = (props: React.SVGAttributes<SVGElement>) => (
  <svg viewBox="0 0 18 18" width="1em" height="1em" {...props}>
    <path
      d="M18 3.75V0h-3.75L3.19 11.06l3.75 3.75L18 3.75zM.29 13.96a.996.996 0 0 0 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0l1.83-1.83-3.75-3.75-1.83 1.83z"
      fill="currentColor"
      fillRule="nonzero"
    />
  </svg>
);

export default Eraser;
