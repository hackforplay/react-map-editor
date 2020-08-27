import * as React from 'react';

const FormatPaint = (props: React.SVGAttributes<SVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      fill="currentColor"
      d="M18 4V3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6h1v4H9v11c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9h8V4h-3z"
    />
  </svg>
);

export default FormatPaint;
