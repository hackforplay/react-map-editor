import * as React from 'react';
import { useUpdated } from '../hooks/useUpdated';
import { onOnline } from '../utils/onOnline';

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
      onOnline(() => {
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
