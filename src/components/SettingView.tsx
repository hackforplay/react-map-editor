import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { classes, style } from 'typestyle/lib';
import GridOn from '../icons/GridOn';
import PhotoSizeSelectLarge from '../icons/PhotoSizeSelectLarge';
import Undo from '../icons/Undo';
import {
  debugState,
  editingState,
  sceneMapState,
  undoPatchesState
} from '../recoils';
import { colors } from '../utils/colors';
import { thumbnail } from '../utils/dataUrls';
import { resizeSceneMap } from '../utils/resizeSceneMap';
import { undoEditing } from '../utils/undoEditing';
import { Button } from './Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogProps
} from './Dialog';
import { IconButton } from './IconButton';
import { Paper } from './Paper';

const thumbnailWidth = 120;

const cn = {
  root: style({
    paddingTop: 16,
    paddingRight: 16
  }),
  container: style({
    display: 'flex',
    alignItems: 'center',
    height: 56,
    minWidth: 120
  }),
  resizseDialog: {
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
    })
  },
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
  }),
  fripVert: style({
    transform: 'scaleY(-1)'
  })
};

export function SettingView() {
  const [debug, setDebug] = useRecoilState(debugState);
  const toggleDebug = React.useCallback(() => {
    setDebug(debug => !debug);
  }, []);

  const setEditing = useSetRecoilState(editingState);
  const undo = React.useCallback(() => {
    setEditing(current => undoEditing(current));
  }, []);
  const undoPatches = useRecoilValue(undoPatchesState);

  const [openResize, setOpenResize] = React.useState(false);

  return (
    <div className={cn.root}>
      <Paper className={cn.container}>
        <IconButton
          label="もどす"
          margin
          disabled={undoPatches.length === 0}
          onClick={undo}
        >
          <Undo />
        </IconButton>
        <IconButton
          active={debug}
          label="はんてい"
          margin
          onClick={toggleDebug}
        >
          <GridOn />
        </IconButton>
        <IconButton
          label="サイズ"
          margin
          onClick={() => {
            setOpenResize(true);
          }}
        >
          <PhotoSizeSelectLarge className={cn.fripVert} />
        </IconButton>
      </Paper>
      {openResize ? (
        <ResizeDialog open onClose={() => setOpenResize(false)} />
      ) : null}
    </div>
  );
}

function ResizeDialog(props: DialogProps) {
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
        <DialogContent className={cn.resizseDialog.content}>
          <div>
            <div className={cn.resizseDialog.cols} style={{ width }}>
              <Input
                defaultValue={cols}
                max={100}
                min={15}
                onChange={setCols}
                onSetInvalid={setColsInvalid}
              />
            </div>
          </div>
          <div className={cn.resizseDialog.flex}>
            <div
              className={classes(cn.resizseDialog.thumbnail)}
              style={{ width, height, backgroundSize }}
            ></div>
            <div className={cn.resizseDialog.rows}>
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
