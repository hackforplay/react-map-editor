import * as React from 'react';
import { useUpdated } from '../hooks/useUpdated';

export type ImgProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;
export type LoadType = 'default' | 'error' | 'reset';

export function Img(props: ImgProps) {
  const [loadType, setLoadType] = React.useState<LoadType>('default');
  useUpdated(() => {
    if (loadType === 'reset') {
      setLoadType('default');
    }
  }, [loadType]);

  const handleError = React.useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setLoadType('error');
      onlineCallbacks.add(() => {
        console.warn('callback!');
        setLoadType('reset');
      });
      return props.onError?.(e);
    },
    [props.onError]
  );

  return (
    <img
      {...props}
      onError={handleError}
      src={loadType === 'reset' ? undefined : props.src}
    />
  );
}

const onlineCallbacks = new Set<Function>();
window.addEventListener(
  'online',
  () => {
    onlineCallbacks.forEach(cb => cb());
    onlineCallbacks.clear();
  },
  { passive: true }
);
