import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RootComponent from '.';

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(<RootComponent />, container);
