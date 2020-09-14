import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export function useUpdated(effect: EffectCallback, deps?: DependencyList) {
  const firstRef = useRef(true);
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    return effect();
  }, deps);
}
