import { Scene } from '@hackforplay/next';
import test from 'ava';
import Cursor from './cursor';
import { updateScene } from './updateScene';

test('draw canvas', t => {
  const sky: ITile = {
    index: 1,
    placement: {
      type: 'Sky'
    },
    src: '',
    author: {
      name: ''
    }
  };

  const cursor = new Cursor(1, 0, 'pen', [[sky], [sky]], 1);
  const origin = createScene([
    [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]
  ]);
  const expect = createScene([
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 0, 0]
    ]
  ]);

  const result = updateScene(origin, cursor);

  t.not(origin, result, 'draw関数は Immutable でなければならない');
  t.is(result.map.tables.length, expect.map.tables.length);
  t.deepEqual(result.map.tables, expect.map.tables);
});

function createScene(tables: number[][][]): Scene {
  return {
    debug: false,
    map: {
      base: -1,
      tables,
      squares: []
    },
    screen: {
      width: 480,
      height: 320
    }
  };
}
