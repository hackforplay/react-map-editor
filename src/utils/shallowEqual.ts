import { isEqualWith } from 'lodash-es';

export function shallowEqual<T>(value: T, other: T) {
  return isEqualWith(value, other, (a, b) => a === b);
}
