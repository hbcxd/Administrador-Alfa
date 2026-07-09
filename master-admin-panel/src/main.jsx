import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app'; // <-- Apunta a tu archivo app.jsx en minúsculas
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
