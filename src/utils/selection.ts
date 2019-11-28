export type Selection = {
  /**
   * ページ番号
   */
  page: number;
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
  if (isInvalid(start) || isInvalid(end)) {
    return [[]]; // invalid selection
  }

  if (start.row === end.row) {
    // 行をまたがない => 単純に連番
    return [range(start.num, end.num)];
  } else if (start.row > end.row) {
    // 逆
    return getMatrix({
      page: selection.page,
      start: selection.end,
      end: selection.start
    });
  } else {
    // 複数行にまたがる => column を動的に求める
    const tableColumn = getTableColumn(end);
    const height = end.row - start.row + 1;
    const width = Math.abs(start.col - end.col);
    const left = start.col < end.col ? start.col : end.col;
    return Array.from({ length: height }).map((_, y) => {
      const begin = left + (start.row + y) * tableColumn;
      return range(begin, begin + width);
    });
  }
}

function getTableColumn(pos: Pos) {
  if (pos.row === 0) {
    throw new Error(
      'getTableColumn can not calcurate when pos.row is zero. pos=' +
        JSON.stringify(pos)
    );
  }
  return (pos.num - pos.col) / pos.row;
}

function range(a: number, b: number) {
  const [min, max] = a < b ? [a, b] : [b, a];
  const array = [];
  for (let index = min; index <= max; index++) {
    array.push(index);
  }
  return array;
}

function isInvalid(pos: Pos) {
  return !(pos.col >= 0 && pos.row >= 0 && pos.num >= 0);
}
