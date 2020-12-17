import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from 'react-router-dom';

// const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const baseUrl = document.baseURI;
const rootElement = document.getElementById('root');

ReactDOM.render(<BrowserRouter basename={baseUrl}>
    <Provider store={store}>
        <App />
    </Provider>
</BrowserRouter>, 
rootElement);