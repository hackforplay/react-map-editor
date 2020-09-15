const onlineCallbacks = new Set<Function>();

export function onOnline(callback: Function) {
  onlineCallbacks.add(callback);
  return () => {
    onlineCallbacks.delete(callback);
  };
}

window.addEventListener(
  'online',
  () => {
    const copy = new Set(onlineCallbacks);
    onlineCallbacks.clear();
    copy.forEach(cb => cb());
  },
  { passive: true }
);
