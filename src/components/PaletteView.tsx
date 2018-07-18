import * as React from 'react';
import { style } from 'typestyle/lib';
import * as csstips from 'csstips/lib';
import { Square } from '@hackforplay/next';
import { StateProps, DispatchProps } from '../containers/PaletteView';

export type Props = StateProps & DispatchProps;

const container = style(csstips.flex1, csstips.vertical, {
  minWidth: 120
});
const table = style(csstips.flex);
const selected = style({
  height: 120,
  $nest: {
    '& img': {
      height: '100%'
    }
  }
});

export default class PaletteView extends React.Component<Props> {
  render() {
    return (
      <div className={container}>
        <div className={table}>
          {squares.map(square => (
            <img
              key={square.index}
              src={square.tile.image.src}
              alt="tile"
              onClick={() => this.props.onSquareClick(square)}
            />
          ))}
        </div>
        <div className={selected}>
          {this.props.selected && (
            <img src={this.props.selected.tile.image.src} alt="selected tile" />
          )}
        </div>
      </div>
    );
  }
}

const squares: Square[] = [
  {
    index: 100,
    placement: {
      type: 'Ground'
    },
    tile: {
      size: [32, 32],
      image: {
        type: 'data-url',
        src:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAa1JREFUWAnF171KA0EUBeCNBomNIGiVSArxLXxI38PWB7EXCzFWCoKNQfAnzvIhHh1S3hRZzt47k3t+MuxOLq/PP4fN52F1/30Z9maTdn1bt9vDfHHSsHpi/cdHi9b3+LT6tT7rrbj5st+OG1XXycXVslHNSW9v7tpMs/1xRnXKJF6/fvzb//L83u6fni3bFXPryxWYmiQ9NHF62svAfDEy1G+/YRgzkcwpU68AT02e2KQHh7vNQ9mAMe2tzzpMmXIFJs6BZEaJnufqMkQp2UnPsx8uV2Bq0p6n6piaPJVpAdl86c96YudGvQLJLNOck+vHFB6GkcsPHjWBe/31CvCUJ5jAObm081x/KkVJ/TLm9/TXK8CjHhN1k2OCGSapVPbD9tNfr4CzmWd5ImYddpZjIjM9JXtK1SuAOY94DEs7nP08xRymDJzK2q9eAZOYlMeYJpOsJ8794FRWJuoVwNz/Wrp7zHjpaTkzkvv1ng+sK1fgz3sBzzDZhinH455yPM9MlSvQfS/A3Am37blfP29hSiZzytUrYJJe+p1wmX7nhPUygGnPcxnxe+UKfAFWWnhV/CxNhgAAAABJRU5ErkJggg=='
      },
      author: {
        name: 'ぴぽや',
        url: 'http://blog.pipoya.net/'
      }
    }
  },
  {
    index: 101,
    placement: {
      type: 'Barrier'
    },
    tile: {
      size: [32, 32],
      image: {
        type: 'data-url',
        src:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAflJREFUWAnNl7FKA0EQhjciCDFNmiMiaXNcFdAmbRorwSrgG9jZ+QA+hr1dkBQ+QFqRWFiFpA3BkMYm2lgo7uy3x01YLwqysRlmZvec/59/djcV88e/k6Pk83vrbFUvfGE8nVQKgRJnpyT/7+ndTf/D401dEC9e7ZbBaClb5+oLrdSuI1rGSHQGgv26Oq9aJL3ungUzc8gfxlXAWfvy9m7tcp5YmxwKM/hoJMREdAbWNIC6jVlZRBo5iA/2hYnLU5mC2UKQe4YcEwaNOG1oJraHgbtrY3vebHxY5MZI7/tDcTVytOEWb2wyxcT2MNBsFE80IHUyUTm9fZ7WbKrXFabQCOu1ZSrQAlMBE/EZoPe68hAyEPWHMgWdTHbCkP5OmR+fASoMIQ4hQwvsxzIt+PpEJI6Nz8BgJLVwsmnVhxCBgDz7iW9q4zNAj4w7u+k5yMi3W3I3sO5pkgpIznp1C8IAc4+vbXwGfIUBJBdncstROQw1a/IyWtvvFvq489fWu3h0BvyLiLOZSkHOHaHPCaYHjWjEMMb3QvnoDPgX0XE6sUWDiF4bI70GUR6XW5K4tmXIeRltDwO398bqIWvJ+7/t3oQ5YsGozweN/Ld+dAb8FOjKmQq0ofNoJaRuvR6f3uNHZ8BPARVh80rltx6qJq9tvl5nfvajM/AF9yTU4CyIinMAAAAASUVORK5CYII='
      },
      author: {
        name: 'ぴぽや',
        url: 'http://blog.pipoya.net/'
      }
    }
  },
  {
    index: 102,
    placement: {
      type: 'Sky'
    },
    tile: {
      size: [32, 32],
      image: {
        type: 'data-url',
        src:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAVRJREFUWAljvLKz4T8DEFy7+wRE4QTP734Gy0kq84LpnTuug+nCbFcwTa5+JrDuASRYiLUb5nNi1aOrw6V/wEOAbg4ApSFYOkIOHbo5ANlSZDbRaQDmelhcCvJyI5tDkA3TB1MI0z94QwDdx+g+eP/5K8wzZNEw/YM3BNC9hR4i6PLofHT16PxBkwYYJxaHg+sCdB/Qiz/wacDZTZNensVqz4CHwKgDWAi1ZLBGHBUFBzwKWE4dfQT2D6xsRvccrMTCJQ9TD1MH48NoQvoGPgRkJQTBjoXRMJej0+jyB8/eAiuxN1ZDV4rCR9cHk4TpH/gQgJWEhHIDRm12mwvsGVL1w0JASVoUzBz4EIC5SEtZBsyEhQQ6H71FBNMHo9HVo/PR9V+6DemJDXgIMJZEu5HUHoDl6/efvoE9D4tLWEgQotH1D3gIsMBcRMjluOQp1T/gIQAAJ2N3iQXVxK4AAAAASUVORK5CYII='
      },
      author: {
        name: 'ぴぽや',
        url: 'http://blog.pipoya.net/'
      }
    }
  },
  {
    index: 103,
    placement: {
      type: 'Rug'
    },
    tile: {
      size: [32, 32],
      image: {
        type: 'data-url',
        src:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAgCAYAAAABtRhCAAAAAXNSR0IArs4c6QAAAcJJREFUSA3Nlq1Sw0AQgO8YXoAygwBJ8ThAo1A8AAOe2jqCqGkdyOIpPAAKhYa+AhQJAobyCMdk777SbGbtJRXZdG/T7re/8c74hKcQyqPic18s+uFe5PpZ18tNulxM9sRudDoVfQgD+e79oGLHMyvc5JKr1h9pss7Wtpj+3M6EANLhwZHoR24qsrh7rPxkmCXibiTOTliLsybAXa3HcxfBnXuPlj6RWOfNEUJAruYf0eXL75ijtY2OIPx+zUXe9N9iVaocRc7/K6S+9TnEZzzuPcS+hFz36fnVjlQz50SmuRxaHo2PTwSOHOjJYuWePiUyyOYI8QBJrqw+ww4JqUWGXXsI8QhSn/pooU9boXddrdbh5ouY+ENfm2LlQXsIISue4/Snj8a7r0LANmFb+BQBqljr5aEmCBf7ECI8hYxNThVqMqpYP+8mTiYNZMj8OcQzPNV7DTK9Reg3nicykCD1eX5CyxP0SEghs2av3pM6cvkJLU/ZEnrv6X5kougIEJn25FB7pGPveRtLM5T3Tza9rmLrXSh7DgGryTL2xH/5sJyVzMtlfZlD8ris1/fZCWs7y6pa+kt7TBSYvVSxZZ+d8A/AjhX89PD7OwAAAABJRU5ErkJggg=='
      },
      author: {
        name: 'ぴぽや',
        url: 'http://blog.pipoya.net/'
      }
    }
  }
];
