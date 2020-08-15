import * as React from 'react';
import { classes, style } from 'typestyle';
import { colors } from '../utils/colors';

export interface IconButtonProps {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  label?: string;
  margin?: boolean;
  onClick?: () => void;
}

const icon = style({
  color: colors.icon,
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  outline: 'none',
  padding: 0,
  $nest: {
    '&>svg': {
      fontSize: '1.5em'
    }
  }
});
const active = style({
  color: colors.selected
});
const disabled = style({
  opacity: 0.5,
  pointerEvents: 'none'
});
const label = style({
  marginTop: 1,
  fontSize: '0.75em'
});
const marginHorizontal = style({
  marginLeft: 16,
  marginRight: 0
});

export function IconButton(props: IconButtonProps) {
  return (
    <button
      className={classes(
        icon,
        props.active && active,
        props.disabled && disabled,
        props.margin && marginHorizontal
      )}
      onClick={props.onClick}
    >
      {props.children}
      {props.label ? <span className={label}>{props.label}</span> : null}
    </button>
  );
}
