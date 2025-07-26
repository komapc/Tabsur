import './index.css';
import App from './App';
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from 'react-router-dom';

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);

// const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const baseUrl = document.baseURI;

root.render(
  <BrowserRouter basename={baseUrl}>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);