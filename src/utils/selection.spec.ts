import test from 'ava';
import { Pos, getMatrix } from './selection';

const cases = [
  {
    message: 'click (3:2)',
    start: {
      row: 3,
      col: 2,
      num: 26
    },
    end: {
      row: 3,
      col: 2,
      num: 26
    },
    expect: [
      [26] // row=0
    ]
  },
  {
    title: 'left-top to right-bottom',
    start: {
      row: 3,
      col: 2,
      num: 26
    },
    end: {
      row: 4,
      col: 3,
      num: 35
    },
    expect: [
      [26, 27], // row=0
      [34, 35] // row=1
    ]
  },
  {
    message: 'left-bottom to right-top',
    end: {
      row: 4,
      col: 3,
      num: 35
    },
    start: {
      row: 3,
      col: 4,
      num: 28
    },
    expect: [
      [27, 28], // row=0
      [35, 36] // row=1
    ]
  }
];

test('getMatrix', t => {
  for (let { start, end, expect, message } of cases) {
    const result = getMatrix({ start, end });
    t.deepEqual(result, expect, message);
  }
});
