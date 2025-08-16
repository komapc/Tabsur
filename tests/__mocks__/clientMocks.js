const React = require('react');

// Mock App component
const MockApp = () => {
  return React.createElement('div', { 'data-testid': 'app' }, 'Mock App');
};

// Mock Login component
const MockLogin = () => {
  return React.createElement('div', { 'data-testid': 'login' }, 'Mock Login');
};

// Mock Register component
const MockRegister = () => {
  return React.createElement('div', { 'data-testid': 'register' }, 'Mock Register');
};

// Mock CreateMealWizard component
const MockCreateMealWizard = () => {
  return React.createElement('div', { 'data-testid': 'create-meal-wizard' }, 'Mock Create Meal Wizard');
};

// Mock Main component
const MockMain = () => {
  return React.createElement('div', { 'data-testid': 'main' }, 'Mock Main');
};

module.exports = {
  MockApp,
  MockLogin,
  MockRegister,
  MockCreateMealWizard,
  MockMain
};
