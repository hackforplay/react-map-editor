import * as React from 'react';
import { classes, style } from 'typestyle';
import { colors } from '../utils/colors';

const root = style({
  backgroundColor: colors.paper,
  borderRadius: 2
});

export interface PaperProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

export const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({ children, className, ...props }, ref) => (
    <div {...props} className={classes(className, root)} ref={ref}>
      {children}
    </div>
  )
);
