import * as React from 'react';

const Nib3 = (props: React.SVGAttributes<SVGElement>) => (
  <svg viewBox="0 0 48 48" width="1em" height="1em" {...props}>
    <g fill="none" fillRule="evenodd">
      <path d="M0 0h48v48H0z" />
      <path
        fillOpacity={0.5}
        fill="currentColor"
        d="M7 21h7v7H7zM7 13h7v7H7zM15 13h7v7h-7zM23 13h7v7h-7zM23 21h7v7h-7zM23 29h7v7h-7zM15 21h7v7h-7zM15 29h7v7h-7zM7 29h7v7H7z"
      />
    </g>
  </svg>
);

export default Nib3;
