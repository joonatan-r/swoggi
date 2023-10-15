
// const e = document.createElement('div');
// e.innerHTML = "Hi from webpack";

// document.body.appendChild(e);

import { createRoot } from 'react-dom/client';
import Component from './Component';

const domNode = document.getElementById('reactApp');
const root = createRoot(domNode);
root.render(Component());
