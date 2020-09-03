import * as React from 'react';
import { createPortal } from 'react-dom';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { classes, style } from 'typestyle';
import { colors } from '../utils/colors';

const cn = {
  root: style({
    zIndex: 1000
  }),
  backdrop: style({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.backdrop,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  }),
  container: style({
    borderRadius: 2,
    backgroundColor: colors.paper,
    boxShadow: `0px 6px 15px 0px ${colors.shadow}`,
    cursor: 'initial',
    width: 400,
    maxWidth: '100%'
  }),
  header: style({
    padding: 16,
    textAlign: 'center',
    fontSize: '1.25em'
  }),
  content: style({
    padding: 8
  }),
  footer: style({
    marginTop: 16,
    borderTop: `1px solid ${colors.border}`,
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    $nest: {
      '&>*': {
        marginLeft: 8
      }
    }
  })
};

const dialogRootAtom = atom<HTMLElement | null>({
  key: 'dialogRootAtom',
  default: null
});

/**
 * シングルトン
 */
export function DialogRootProvider() {
  const setDialogRoot = useSetRecoilState(dialogRootAtom);

  return <div ref={setDialogRoot} className={cn.root}></div>;
}

export interface DialogProps {
  open: boolean;
  children?: React.ReactNode;
  onClose: () => void;
}

export function Dialog(props: DialogProps) {
  const dialogRoot = useRecoilValue(dialogRootAtom);

  if (!props.open) {
    return null;
  }
  if (!dialogRoot) {
    console.error('dialogRoot がマウントされていません');
    return null;
  }

  return createPortal(
    <div
      className={cn.backdrop}
      onClick={event => {
        if (event.target === event.currentTarget) {
          props.onClose();
        }
      }}
    >
      <div className={cn.container}>{props.children}</div>
    </div>,
    dialogRoot
  );
}

export interface DialogHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export function DialogHeader(props: DialogHeaderProps) {
  return (
    <div className={classes(props.className, cn.header)}>{props.children}</div>
  );
}

export interface DialogContentProps {
  children?: React.ReactNode;
  className?: string;
}

export function DialogContent(props: DialogContentProps) {
  return (
    <div className={classes(props.className, cn.content)}>{props.children}</div>
  );
}

export interface DialogFooterProps {
  children?: React.ReactNode;
  className?: string;
}

export function DialogFooter(props: DialogFooterProps) {
  return (
    <div className={classes(props.className, cn.footer)}>{props.children}</div>
  );
}
