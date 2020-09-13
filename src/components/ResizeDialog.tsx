import * as React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { classes, style } from 'typestyle/lib';
import { editingState, sceneMapState } from '../recoils';
import { colors } from '../utils/colors';
import { thumbnail } from '../utils/dataUrls';
import { resizeSceneMap } from '../utils/resizeSceneMap';
import { Button } from './Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogProps
} from './Dialog';

const thumbnailWidth = 120;

const cn = {
  content: style({
    maxWidth: 288,
    paddingLeft: 32,
    paddingTop: 32,
    paddingBottom: 32,
    marginLeft: 'auto',
    marginRight: 'auto'
  }),
  thumbnail: style({
    backgroundImage: `url(${thumbnail})`,
    backgroundRepeat: 'repeat'
  }),
  cols: style({
    paddingBottom: 16,
    marginBottom: 32,
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  rows: style({
    marginLeft: 32,
    borderLeft: `1px solid ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16
  }),
  flex: style({
    display: 'flex'
  }),
  input: style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    $nest: {
      '&>input': {
        width: 80,
        paddingRight: 40
      },
      '&>span': {
        position: 'absolute',
        color: colors.textSecondary,
        right: 4,
        wordBreak: 'keep-all',
        pointerEvents: 'none'
      }
    }
  }),
  invalid: style({
    color: colors.error
  }),
  helperText: style({
    position: 'absolute',
    top: '-0.8rem',
    left: 0,
    fontSize: '0.5em'
  })
};

export function ResizeDialog(props: DialogProps) {
  const { tables } = useRecoilValue(sceneMapState);
  const [rows, setRows] = React.useState(tables[0].length);
  const [cols, setCols] = React.useState(tables[0][0].length);

  const virtualHeight = (thumbnailWidth / cols) * rows;
  const maxHeight = 200;
  const scale = Math.min(1, maxHeight / virtualHeight);
  const height = Math.floor(virtualHeight * scale);
  const width = Math.floor(thumbnailWidth * scale);
  const backgroundSize = `${((15 / cols) * width) >> 0}px ${
    ((10 / rows) * height) >> 0
  }px`;

  const [rowsInvalid, setRowsInvalid] = React.useState(false);
  const [colsInvalid, setColsInvalid] = React.useState(false);

  const setEditing = useSetRecoilState(editingState);
  const handleDecide = React.useCallback(() => {
    setEditing(curr => resizeSceneMap(curr, rows, cols));
    props.onClose();
  }, [props.onClose, rows, cols]);

  return (
    <Dialog {...props}>
      <div>
        <DialogHeader>はいけいのサイズをきめよう</DialogHeader>
        <DialogContent className={cn.content}>
          <div>
            <div className={cn.cols} style={{ width }}>
              <Input
                defaultValue={cols}
                max={100}
                min={15}
                onChange={setCols}
                onSetInvalid={setColsInvalid}
              />
            </div>
          </div>
          <div className={cn.flex}>
            <div
              className={classes(cn.thumbnail)}
              style={{ width, height, backgroundSize }}
            ></div>
            <div className={cn.rows}>
              <Input
                defaultValue={rows}
                max={100}
                min={10}
                onChange={setRows}
                onSetInvalid={setRowsInvalid}
              />
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button disabled={colsInvalid || rowsInvalid} onClick={handleDecide}>
            けってい
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

interface InputProps {
  defaultValue: number;
  max: number;
  min: number;
  onChange: (value: number) => void;
  onSetInvalid: (value: boolean) => void;
}

function Input(props: InputProps) {
  const [text, setText] = React.useState(props.defaultValue + '');

  // valid でなければ onChange はコールされない
  const number = parseInt(text);
  const isInvalid =
    Number.isNaN(number) || number > props.max || number < props.min;

  React.useEffect(() => {
    if (!isInvalid) {
      props.onChange(number);
    }
    props.onSetInvalid(isInvalid);
  }, [number, isInvalid]);

  return (
    <div className={cn.input}>
      <input
        type="text"
        value={text}
        maxLength={3}
        className={classes(isInvalid && cn.invalid)}
        onChange={event => setText(event.target.value)}
        onClick={event => {
          event.currentTarget.select();
        }}
      />
      <span>マス</span>
      <span className={cn.helperText}>{`${props.min}〜${props.max}`}</span>
    </div>
  );
}
