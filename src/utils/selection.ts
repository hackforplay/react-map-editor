export type Selection = {
  moving: boolean;
  start: Pos;
  end: Pos;
};

export type Pos = {
  row: number;
  col: number;
  num: number;
};

export function getBounds(selection: Selection) {
  const { start, end } = selection;
  return {
    top: Math.min(start.row, end.row),
    right: Math.max(start.col, end.col),
    bottom: Math.max(start.row, end.row),
    left: Math.min(start.col, end.col)
  };
}

/**
 * 選択範囲から num のマトリクスを生成する
 * @param selection 選択範囲
 * @returns 画像の表示順を表す数値の二次元配列
 * e.g.
 * [
 *    [0, 1],
 *    [8, 9],
 *    [16, 17]
 * ]
 */
export function getMatrix(selection: Selection): number[][] {
  const { start, end } = selection;

  if (start.row === end.row) {
    // 行をまたがない => 単純に連番
    return [range(start.num, end.num)];
  } else if (start.row > end.row) {
    // 逆
    return getMatrix({
      moving: selection.moving,
      start: selection.end,
      end: selection.start
    });
  } else {
    // 複数行にまたがる => column を動的に求める
    const width = Math.abs(start.col - end.col);
    const column = (end.num - start.num - width) / (end.row - start.row);
    const leftTop = start.col < end.col ? start.num : start.num - width;
    return Array.from({ length: end.row - start.row + 1 }).map((_, y) => {
      const begin = leftTop + y * column;
      return range(begin, begin + width);
    });
  }
}

function range(a: number, b: number) {
  const [min, max] = a < b ? [a, b] : [b, a];
  const array = [];
  for (let index = min; index <= max; index++) {
    array.push(index);
  }
  return array;
}
