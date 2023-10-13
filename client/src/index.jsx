import React from 'react';
import ReactDom from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeContextProvider } from './context/ThemeContext';
import { AuthContextProvider } from './context/AuthContext';
import { DispatchContextProvider } from './context/dispatchContext';


const root = ReactDom.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <DispatchContextProvider>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </DispatchContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

