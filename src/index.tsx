import { SceneMap } from '@hackforplay/next';
import * as React from 'react';
import { RecoilRoot } from 'recoil';
import { Root, RootProps } from './components/Root';
import * as recoils from './recoils';

export { recoils, Root as ReactMapEditorWithoutProvider };

export type Props = RootProps & {
  map?: SceneMap;
};

export default function ReactMapEditor({ map, ...props }: Props) {
  return (
    <RecoilRoot
      initializeState={({ set }) => {
        if (map) {
          set(recoils.sceneMapState, map);
        }
      }}
    >
      <Root {...props} />
    </RecoilRoot>
  );
}
