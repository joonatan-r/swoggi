
import { createRoot } from 'react-dom/client';
import Component from './Component';
import React from 'react';

const domNode = document.getElementById('reactApp');
const root = createRoot(domNode);
root.render(React.createElement(Component));
