let value: boolean | undefined = undefined;
export function isTouchDevice() {
  if (value === undefined) {
    const div = document.createElement('div');
    value = div.ontouchstart === null;
  }
  return value;
}
