import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { normalize, setupPage } from 'csstips';
import RootComponent from '.';

const rootId = 'root';

const container = document.createElement('div');
container.id = rootId;
document.body.appendChild(container);

normalize();
setupPage(`#${rootId}`);

ReactDOM.render(<RootComponent />, container);
