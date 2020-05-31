import { Scene } from '@hackforplay/next';

/**
 * マップの初期値
 */
export function initScene(): Scene {
  const row = () => Array.from({ length: 10 }).map(() => -1);
  const table = () => Array.from({ length: 10 }).map(() => row());

  return {
    debug: true,
    map: {
      base: -1,
      tables: [table(), table(), table()],
      squares: []
    },
    screen: {
      width: 480,
      height: 320
    }
  };
}
