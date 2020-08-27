import { SceneMap } from '@hackforplay/next';
import { normalize, setupPage } from 'csstips/lib';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactMapEditor from '.';

const rootId = 'root';

const container = document.createElement('div');
container.id = rootId;
document.body.appendChild(container);

normalize();
setupPage(`#${rootId}`);

ReactDOM.render(<ReactMapEditor map={defaultMap()} />, container);

function defaultMap(): SceneMap {
  // 15x10 の草原からスタート
  const row = (index: number) => Array.from({ length: 15 }).map(() => index);
  const table = (index: number) =>
    Array.from({ length: 10 }).map(() => row(index));

  return {
    base: 1000,
    tables: [table(-88888), table(-88888), table(-88888)],
    squares: [
      {
        index: 1000,
        placement: {
          type: 'Ground'
        },
        tile: {
          size: [32, 32],
          image: {
            type: 'data-url',
            src:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsSAAALEgHS3X78AAAA4UlEQVRYw8WXMQ7CQAwE8xEED+GBlFT5RFpKHsGPQJzkZtFqvQFuCxe+8ykT39pxlu1xfr7tejsOW++nYeXjPouvdTyP+3h+iQOwwMt2GMbA0Gfxtc7A8wAshSyl3StQV1JgeQCV4gpkfld8zM8DoOi6KXfFxvw8gNtQGBiWoWpgVITTAdwHqXj3RfIALIWqtaqUs7LF+DzA7LKTGpgOgGJRrZaJyy3Dj1YcA/hXGXbFmAfYO1y6DUf2gRiAO2i4DUiNcHmAX4vLHWbzAN2Ufzu22/8F0wD2iq/7uVVlHAd4AY/m2cw040lfAAAAAElFTkSuQmCC'
          },
          author: {
            name: 'ぴぽや',
            url: 'http://blog.pipoya.net/'
          }
        }
      }
    ]
  };
}
