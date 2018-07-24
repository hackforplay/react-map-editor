import test from 'ava';
import { Square } from '@hackforplay/next';
import { draw } from './canvas';
import Cursor from '../utils/cursor';

test('draw canvas', t => {
  const sky: Square = {
    index: 1,
    placement: {
      type: 'Sky'
    },
    tile: {
      size: [32, 32],
      image: {
        type: 'data-url',
        src: ''
      },
      author: {
        name: ''
      }
    }
  };

  const cursor = new Cursor(1, 0, 'pen', [[sky], [sky]], 1);
  const origin = [[[0, 0, 0], [0, 0, 0], [0, 0, 0]]];
  const expect = [[[0, 1, 0], [0, 1, 0], [0, 0, 0]]];

  const result = draw(origin, cursor);

  t.not(origin, result, 'draw関数は Immutable でなければならない');
  t.is(result.length, expect.length);
  t.deepEqual(result, expect);
});
