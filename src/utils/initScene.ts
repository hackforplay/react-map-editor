import { Scene } from '@hackforplay/next';

/**
 * マップの初期値
 */
export function initSceneMap(): Scene['map'] {
  const row = () => Array.from({ length: 10 }).map(() => -1);
  const table = () => Array.from({ length: 10 }).map(() => row());

  return {
    base: -1,
    tables: [table(), table(), table()],
    squares: []
  };
}
