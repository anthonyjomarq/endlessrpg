import React from 'react';
import ReactDOM from 'react-dom/client';
import { Game } from './components/Game.jsx';

const root = ReactDOM.createRoot(document.getElementById('game-root'));
root.render(React.createElement(Game));