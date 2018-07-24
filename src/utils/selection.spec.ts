import test from 'ava';
import { Pos, getMatrix } from './selection';

test('getMatrix left-top to right-bottom', t => {
  const start: Pos = {
    row: 3,
    col: 2,
    num: 26
  };
  const end: Pos = {
    row: 4,
    col: 3,
    num: 35
  };
  const expect = [
    [26, 27], // row=0
    [34, 35] // row=1
  ];

  const result = getMatrix({ start, end, moving: true });
  t.is(result.length, expect.length);
  t.deepEqual(result, expect);
});

test('getMatrix click (3:2)', t => {
  const start: Pos = {
    row: 3,
    col: 2,
    num: 26
  };
  const end: Pos = {
    row: 3,
    col: 2,
    num: 26
  };
  const expect = [
    [26] // row=0
  ];

  const result = getMatrix({ start, end, moving: true });
  t.is(result.length, expect.length);
  t.deepEqual(result, expect);
});
