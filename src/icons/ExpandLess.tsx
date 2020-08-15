import * as React from 'react';

const ExpandLess = (props: React.SVGAttributes<SVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"
      fill="currentColor"
    />
  </svg>
);

export default ExpandLess;
