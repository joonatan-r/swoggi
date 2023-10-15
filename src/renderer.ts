
import { createRoot } from 'react-dom/client';
import Component from './Component';

const domNode = document.getElementById('reactApp');
const root = createRoot(domNode);
root.render(Component());
