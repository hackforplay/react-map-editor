import * as React from 'react';

const Eraser3 = (props: React.SVGAttributes<SVGElement>) => (
  <svg
    viewBox="0 0 48 48"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    {...props}
  >
    <defs>
      <path id="a" d="M0 .18h41.357v36.187H0z" />
      <path id="c" d="M0 37h47.879V1H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <path d="M0 0h48v48H0z" />
      <g transform="translate(0 5)">
        <g transform="translate(0 .82)">
          <mask id="b" fill="#fff">
            <use xlinkHref="#a" />
          </mask>
          <path
            d="M15.777 14.664l11.096 11.097-5.437 5.436h-9.27l-6.461-6.462 10.072-10.07zm12.97 16.533l11.475-11.474a3.88 3.88 0 0 0 0-5.484L27.298 1.315a3.878 3.878 0 0 0-5.484 0L1.136 21.995a3.877 3.877 0 0 0 0 5.482l7.754 7.754a3.875 3.875 0 0 0 2.742 1.136H22.68c1.072 0 1.61-.715 2.57-1.676l3.497-3.494z"
            fill="currentColor"
            mask="url(#b)"
          />
        </g>
        <mask id="d" fill="#fff">
          <use xlinkHref="#c" />
        </mask>
        <text
          mask="url(#d)"
          fontFamily="HelveticaNeue-Bold, Helvetica Neue"
          fontSize={18}
          fontWeight="bold"
          fill="currentColor"
        >
          <tspan x={37.992} y={37}>
            3
          </tspan>
        </text>
      </g>
    </g>
  </svg>
);

export default Eraser3;
