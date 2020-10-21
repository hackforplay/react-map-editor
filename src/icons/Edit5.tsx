import * as React from 'react';

const Edit5 = (props: React.SVGAttributes<SVGElement>) => (
  <svg
    viewBox="0 0 48 48"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    {...props}
  >
    <defs>
      <path
        d="M6 34.5V42h7.5l22.12-22.12-7.5-7.5L6 34.5zm35.42-20.42c.78-.78.78-2.04 0-2.82l-4.68-4.68c-.78-.78-2.04-.78-2.82 0l-3.66 3.66 7.5 7.5 3.66-3.66z"
        id="a"
      />
    </defs>
    <g fill="none" fillRule="evenodd">
      <path d="M0 0h48v48H0z" />
      <path d="M0 0h48v48H0z" />
      <mask id="b" fill="#fff">
        <use xlinkHref="#a" />
      </mask>
      <use fill="currentColor" xlinkHref="#a" />
      <g mask="url(#b)" fill="currentColor">
        <path d="M0 0h48v48H0z" />
      </g>
      <text
        fontFamily="HelveticaNeue-Bold, Helvetica Neue"
        fontSize={18}
        fontWeight="bold"
        fill="currentColor"
      >
        <tspan x={32.992} y={42}>
          5
        </tspan>
      </text>
    </g>
  </svg>
);

export default Edit5;
