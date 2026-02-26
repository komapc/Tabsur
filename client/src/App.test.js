import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';

const rootReducer = (state = { auth: { isAuthenticated: false, user: null }, errors: {} }) => state;

// Mock navigator.serviceWorker which App uses for push notifications
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    ready: Promise.resolve({ pushManager: { subscribe: jest.fn() } })
  },
  writable: true
});

it('renders without crashing', () => {
  const store = createStore(rootReducer);
  const div = document.createElement('div');
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  );
  unmountComponentAtNode(div);
});
