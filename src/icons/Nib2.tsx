import * as React from 'react';

const Nib2 = (props: React.SVGAttributes<SVGElement>) => (
  <svg viewBox="0 0 48 48" width="1em" height="1em" {...props}>
    <g fill="none" fillRule="evenodd">
      <path d="M0 0h48v48H0z" />
      <path
        fillOpacity={0.5}
        fill="currentColor"
        d="M7 16h8v8H7zM16 16h8v8h-8zM7 25h8v8H7zM16 25h8v8h-8z"
      />
    </g>
  </svg>
);

export default Nib2;
