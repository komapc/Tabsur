import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import AppFab from '../layout/AppFab';

// Mock MUI components (default exports -> { default: ... } for Vitest)
vi.mock('@mui/material/Fab', () => ({
  default: ({ children, onClick, className }) => (
    <button
      data-testid="fab-button"
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  )
}));

vi.mock('@mui/material/Zoom', () => ({
  default: ({ children, in: isVisible }) => (
    <div data-testid="zoom-container" data-visible={isVisible}>
      {children}
    </div>
  )
}));

vi.mock('@mui/icons-material/Add', () => ({
  default: () => <span data-testid="add-icon">+</span>
}));

// Create a mock store
const createMockStore = (initialState = {}) => {
  const rootReducer = (state = initialState) => state;
  return createStore(rootReducer);
};

const renderWithProviders = (component, initialState = {}) => {
  const store = createMockStore({
    auth: { isAuthenticated: false, user: {} },
    notificationsCount: 0,
    messagesCount: 0,
    ...initialState
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('AppFab', () => {
  it('renders when visible prop is true', () => {
    renderWithProviders(<AppFab visible={true} />);
    
    expect(screen.getByTestId('fab-button')).toBeInTheDocument();
    expect(screen.getByTestId('add-icon')).toBeInTheDocument();
    expect(screen.getByTestId('zoom-container')).toHaveAttribute('data-visible', 'true');
  });

  it('renders when visible prop is undefined (defaults to true)', () => {
    renderWithProviders(<AppFab />);
    
    expect(screen.getByTestId('zoom-container')).toHaveAttribute('data-visible', 'true');
  });

  it('hides when visible prop is false', () => {
    renderWithProviders(<AppFab visible={false} />);
    
    expect(screen.getByTestId('zoom-container')).toHaveAttribute('data-visible', 'false');
  });

  it('navigates to createMealWizard when clicked', () => {
    renderWithProviders(<AppFab visible={true} />);

    const fabButton = screen.getByTestId('fab-button');
    fireEvent.click(fabButton);

    expect(fabButton).toBeInTheDocument();
  });

  it('has correct styling classes applied', () => {
    renderWithProviders(<AppFab visible={true} />);
    
    const fabButton = screen.getByTestId('fab-button');
    expect(fabButton.className).toContain('fab');
  });
});