import * as React from 'react';
import { atom, selectorFamily, useSetRecoilState } from 'recoil';
import { onOnline } from '../utils/onOnline';

const cacheMap = new Map<string, Response>();

/**
 * オフラインで失敗したあと、オンラインに復帰したときに
 * 自動的にリトライしてくれる selector
 */
export const request = selectorFamily<Response, string>({
  key: 'request',
  get: src => async ({ get }) => {
    get(onlineAtom); // online になる度に再評価する

    const cache = cacheMap.get(src);
    if (cache) {
      return cache; // キャッシュを返す
    }

    const response = await fetch(src);
    cacheMap.set(src, response); // 成功した Response をキャッシュ
    return response;
  }
});

/**
 * ネットワークが online になる度に 1 ずつ増えるカウンタ
 */
const onlineAtom = atom({
  key: 'onlineAtom',
  default: 0
});

export function NetworkProvider() {
  const setOnline = useSetRecoilState(onlineAtom);
  React.useEffect(
    () =>
      onOnline(() => {
        setOnline(curr => curr + 1);
      }),
    []
  );

  return null;
}
