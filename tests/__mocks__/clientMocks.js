const React = require('react');

// Mock App component with proper error handling
const MockApp = ({ children }) => {
  return React.createElement('div', { 'data-testid': 'app' }, [
    React.createElement('div', { key: 'content' }, children || 'Mock App'),
    React.createElement('div', { key: 'error', 'data-testid': 'error' }, 'Error occurred'),
    React.createElement('div', { key: 'login', 'data-testid': 'login' }, 'Login')
  ]);
};

// Mock Login component with form elements
const MockLogin = () => {
  return React.createElement('div', { 'data-testid': 'login' }, [
    React.createElement('h1', { key: 'title' }, 'Login'),
    React.createElement('form', { key: 'form' }, [
      React.createElement('label', { key: 'email-label', htmlFor: 'email' }, 'Email'),
      React.createElement('input', { key: 'email-input', id: 'email', type: 'email', 'data-testid': 'email-input' }),
      React.createElement('label', { key: 'password-label', htmlFor: 'password' }, 'Password'),
      React.createElement('input', { key: 'password-input', id: 'password', type: 'password', 'data-testid': 'password-input' }),
      React.createElement('button', { key: 'submit', type: 'submit' }, 'Login')
    ])
  ]);
};

// Mock Register component with form elements
const MockRegister = () => {
  return React.createElement('div', { 'data-testid': 'register' }, [
    React.createElement('h1', { key: 'title' }, 'Register'),
    React.createElement('form', { key: 'form' }, [
      React.createElement('label', { key: 'name-label', htmlFor: 'name' }, 'Name'),
      React.createElement('input', { key: 'name-input', id: 'name', type: 'text', 'data-testid': 'name-input' }),
      React.createElement('label', { key: 'email-label', htmlFor: 'email' }, 'Email'),
      React.createElement('input', { key: 'email-input', id: 'email', type: 'email', 'data-testid': 'email-input' }),
      React.createElement('label', { key: 'password-label', htmlFor: 'password' }, 'Password'),
      React.createElement('input', { key: 'password-input', id: 'password', type: 'password', 'data-testid': 'password-input' }),
      React.createElement('label', { key: 'confirm-password-label', htmlFor: 'confirm-password' }, 'Confirm Password'),
      React.createElement('input', { key: 'confirm-password-input', id: 'confirm-password', type: 'password', 'data-testid': 'confirm-password-input' }),
      React.createElement('button', { key: 'submit', type: 'submit' }, 'Register')
    ])
  ]);
};

// Mock CreateMealWizard component
const MockCreateMealWizard = () => {
  return React.createElement('div', { 'data-testid': 'create-meal-wizard' }, 'Mock Create Meal Wizard');
};

// Mock Main component with navigation
const MockMain = () => {
  return React.createElement('div', { 'data-testid': 'main' }, [
    React.createElement('nav', { key: 'navigation', role: 'navigation' }, [
      React.createElement('button', { key: 'meals-tab' }, 'Meals'),
      React.createElement('button', { key: 'profile-tab' }, 'Profile'),
      React.createElement('button', { key: 'my-meals-tab' }, 'My Meals'),
      React.createElement('button', { key: 'chat-tab' }, 'Chat')
    ]),
    React.createElement('div', { key: 'content' }, 'Mock Main Content')
  ]);
};

// Mock Error component for testing error boundaries
const MockErrorComponent = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return React.createElement('div', { 'data-testid': 'error-component' }, 'No Error');
};

// Mock components for different test scenarios
const MockComponents = {
  // Error handling
  ErrorComponent: MockErrorComponent,
  
  // Navigation
  Navigation: () => React.createElement('nav', { role: 'navigation' }, 'Navigation'),
  
  // Forms
  FormWithLabels: () => React.createElement('form', {}, [
    React.createElement('label', { htmlFor: 'test-input' }, 'Test Label'),
    React.createElement('input', { id: 'test-input' })
  ]),
  
  // Error messages
  ErrorMessage: () => React.createElement('div', { 'data-testid': 'error-message' }, 'Error occurred'),
  NetworkError: () => React.createElement('div', { 'data-testid': 'network-error' }, 'Network error'),
  ServerError: () => React.createElement('div', { 'data-testid': 'server-error' }, 'Server error'),
  
  // Success messages
  SuccessMessage: () => React.createElement('div', { 'data-testid': 'success-message' }, 'Success!'),
  
  // Loading states
  LoadingSpinner: () => React.createElement('div', { 'data-testid': 'loading' }, 'Loading...'),
  
  // Meal components
  MealCard: () => React.createElement('div', { 'data-testid': 'meal-card' }, [
    React.createElement('h3', { key: 'title' }, 'Test Meal'),
    React.createElement('p', { key: 'description' }, 'A delicious test meal'),
    React.createElement('button', { key: 'join', 'data-testid': 'join-button' }, 'Join Meal')
  ]),
  
  // Profile components
  ProfileInfo: () => React.createElement('div', { 'data-testid': 'profile' }, [
    React.createElement('h2', { key: 'name' }, 'Test User'),
    React.createElement('p', { key: 'email' }, 'test@example.com'),
    React.createElement('button', { key: 'edit', 'data-testid': 'edit-profile' }, 'Edit Profile')
  ])
};

module.exports = {
  MockApp,
  MockLogin,
  MockRegister,
  MockCreateMealWizard,
  MockMain,
  MockErrorComponent,
  ...MockComponents
};
