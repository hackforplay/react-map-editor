import { SceneMap } from '@hackforplay/next';
import test from 'ava';
import Cursor from '../utils/cursor';
import { draw } from './canvas';
import { ITile } from './palette';

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
  const origin = createSceneMap([[[0, 0, 0], [0, 0, 0], [0, 0, 0]]]);
  const expect = createSceneMap([[[0, 1, 0], [0, 1, 0], [0, 0, 0]]]);

  const result = draw(origin, cursor);

  t.not(origin, result, 'draw関数は Immutable でなければならない');
  t.is(result.tables.length, expect.tables.length);
  t.deepEqual(result, expect);
});

function createSceneMap(tables: number[][][]): SceneMap {
  return {
    tables,
    squares: []
  };
}
