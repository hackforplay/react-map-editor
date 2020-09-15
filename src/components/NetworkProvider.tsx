import * as React from 'react';
import { atomFamily, selectorFamily, useRecoilCallback } from 'recoil';
import { onOnline } from '../utils/onOnline';

const errorNumbers = new Set<number>();

/**
 * 任意のタイミングでリトライさせるための Atom
 * URL ごとに作成される
 */
const retrys = atomFamily<number, number>({
  key: 'retrys',
  default: () => 0
});

let _count = 0;
/**
 * オフラインで失敗したあと、オンラインに復帰したときに
 * 自動的にリトライしてくれる selector
 * 一度でも取得に成功している場合は同期的に値を返す
 */
export const request = selectorFamily<Response, string>({
  key: 'request',
  get: src => ({ get }) => {
    const number = ++_count; // 一意な ID を割り振る
    get(retrys(number)); // エラーになった場合 online になったら再評価する

    return fetch(src).catch(error => {
      errorNumbers.add(number);
      throw error;
    });
  }
});

export function NetworkProvider() {
  const retryAllFailedRequests = useRecoilCallback(({ set }) => {
    const copy = new Set(errorNumbers);
    errorNumbers.clear();
    copy.forEach(number => {
      set(retrys(number), curr => curr + 1);
    });
  }, []);

  React.useEffect(
    () =>
      onOnline(() => {
        retryAllFailedRequests();
      }),
    [retryAllFailedRequests]
  );

  return null;
}
