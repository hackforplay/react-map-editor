import * as React from 'react';
import { style, classes } from 'typestyle';
import { colors } from '../utils/colors';

const cn = {
  root: style({
    border: 'none',
    borderRadius: 2,
    padding: '0.5em 1em',
    backgroundColor: colors.primary,
    color: 'white',
    cursor: 'pointer',
    userSelect: 'none',
    outline: 'none'
  }),
  disabled: style({
    backgroundColor: colors.disabled,
    pointerEvents: 'none',
    cursor: 'not-allowed'
  })
};

export interface ButtonProps {
  children: string;
  disabled?: boolean;
  onClick: () => void;
}

export function Button(props: ButtonProps) {
  return (
    <button
      className={classes(cn.root, props.disabled && cn.disabled)}
      onClick={props.disabled ? undefined : props.onClick}
    >
      {props.children}
    </button>
  );
}
