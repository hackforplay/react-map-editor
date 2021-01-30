import * as React from 'react';
import { classes, style } from 'typestyle';
import { colors } from '../utils/colors';

export interface IconButtonProps {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  label?: string;
  margin?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
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
  marginTop: 2,
  fontSize: '0.75em',
  fontWeight: 700
});
const marginHorizontal = style({
  margin: 8,
  $nest: {
    '&:first-child': {
      marginLeft: 16
    }
  }
});

export function IconButton(props: IconButtonProps) {
  return (
    <button
      className={classes(
        icon,
        props.active && active,
        props.disabled && disabled,
        props.margin && marginHorizontal,
        props.className
      )}
      onClick={props.onClick}
    >
      {props.children}
      {props.label ? <span className={label}>{props.label}</span> : null}
    </button>
  );
}
