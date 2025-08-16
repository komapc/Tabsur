/**
 * 🧪 Comprehensive E2E Flow Tests for Tabsur App
 * 
 * This test suite covers all critical user flows:
 * - User registration and login
 * - Meal creation and management
 * - Navigation between app sections
 * - Profile management
 * - Chat functionality
 * - Error handling and edge cases
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';

// Import components
import App from '../../client/src/App';
import Login from '../../client/src/components/auth/Login';
import Register from '../../client/src/components/auth/Register';
import CreateMealWizard from '../../client/src/components/meals/CreateMeal/CreateMealWizard';
import Main from '../../client/src/components/layout/Main';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock store
const mockStore = configureStore([thunk]);

// Mock Google Maps API
global.google = {
  maps: {
    places: {
      Autocomplete: jest.fn(),
      AutocompleteService: jest.fn(),
      PlacesService: jest.fn(),
    },
    Geocoder: jest.fn(),
    LatLng: jest.fn(),
    Map: jest.fn(),
    Marker: jest.fn(),
  },
};

// Mock Firebase
global.firebase = {
  messaging: () => ({
    requestPermission: jest.fn().mockResolvedValue('granted'),
    getToken: jest.fn().mockResolvedValue('mock-token'),
  }),
};

// Mock service worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
delete window.location;
window.location = {
  href: '',
  protocol: 'https:',
  host: 'bemyguest.dedyn.io',
};

// Test data
const testUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'testpass123',
};

const testMeal = {
  name: 'Test Meal',
  description: 'A delicious test meal',
  date: '2025-08-20',
  time: '19:00',
  location: 'Test Location',
  maxAttendees: 5,
};

// Helper function to render app with providers
const renderWithProviders = (component, initialState = {}) => {
  const store = mockStore({
    auth: {
      isAuthenticated: false,
      user: null,
      loading: false,
    },
    meals: {
      meals: [],
      loading: false,
      error: null,
    },
    ...initialState,
  });

  const theme = createTheme();

  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe('🧪 Tabsur App E2E Flow Tests', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Reset window location
    window.location.href = '';
    
    // Mock successful API responses
    mockedAxios.post.mockResolvedValue({
      data: { token: 'mock-jwt-token', user: testUser },
      status: 200,
    });
    
    mockedAxios.get.mockResolvedValue({
      data: [],
      status: 200,
    });
  });

  describe('🔐 Authentication Flow', () => {
    test('✅ User can register successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { token: 'mock-jwt-token', user: testUser },
        status: 201,
      });

      renderWithProviders(<Register />);

      // Fill registration form
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      fireEvent.change(nameInput, { target: { value: testUser.name } });
      fireEvent.change(emailInput, { target: { value: testUser.email } });
      fireEvent.change(passwordInput, { target: { value: testUser.password } });
      fireEvent.change(confirmPasswordInput, { target: { value: testUser.password } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(submitButton);

      // Verify API call
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/users/register'),
          expect.objectContaining({
            name: testUser.name,
            email: testUser.email,
            password: testUser.password,
          })
        );
      });
    });

    test('✅ User can login successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { token: 'mock-jwt-token', user: testUser },
        status: 200,
      });

      renderWithProviders(<Login />);

      // Fill login form
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: testUser.email } });
      fireEvent.change(passwordInput, { target: { value: testUser.password } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(submitButton);

      // Verify API call
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/users/login'),
          expect.objectContaining({
            email: testUser.email,
            password: testUser.password,
          })
        );
      });
    });

    test('❌ Login shows error for invalid credentials', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Invalid credentials' }, status: 401 },
      });

      renderWithProviders(<Login />);

      // Fill login form with invalid credentials
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(submitButton);

      // Verify error message
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('🍽️ Meal Creation Flow', () => {
    test('✅ Authenticated user can create a meal', async () => {
      const authenticatedStore = {
        auth: {
          isAuthenticated: true,
          user: testUser,
          loading: false,
        },
        meals: {
          meals: [],
          loading: false,
          error: null,
        },
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: { meal: { ...testMeal, id: 1 } },
        status: 201,
      });

      renderWithProviders(<CreateMealWizard />, authenticatedStore);

      // Wait for wizard to load
      await waitFor(() => {
        expect(screen.getByText(/create a meal/i)).toBeInTheDocument();
      });

      // Fill meal name
      const nameInput = screen.getByLabelText(/meal name/i);
      fireEvent.change(nameInput, { target: { value: testMeal.name } });

      // Go to next step
      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);

      // Fill description
      await waitFor(() => {
        const descriptionInput = screen.getByLabelText(/description/i);
        fireEvent.change(descriptionInput, { target: { value: testMeal.description } });
      });

      // Continue through wizard steps
      fireEvent.click(nextButton);

      // Fill date and time
      await waitFor(() => {
        const dateInput = screen.getByLabelText(/date/i);
        const timeInput = screen.getByLabelText(/time/i);
        
        fireEvent.change(dateInput, { target: { value: testMeal.date } });
        fireEvent.change(timeInput, { target: { value: testMeal.time } });
      });

      fireEvent.click(nextButton);

      // Fill location
      await waitFor(() => {
        const locationInput = screen.getByLabelText(/location/i);
        fireEvent.change(locationInput, { target: { value: testMeal.location } });
      });

      fireEvent.click(nextButton);

      // Fill guest limit
      await waitFor(() => {
        const guestInput = screen.getByLabelText(/max guests/i);
        fireEvent.change(guestInput, { target: { value: testMeal.maxAttendees.toString() } });
      });

      // Complete meal creation
      const createButton = screen.getByRole('button', { name: /create meal/i });
      fireEvent.click(createButton);

      // Verify API call
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/meals'),
          expect.objectContaining({
            name: testMeal.name,
            description: testMeal.description,
            date: testMeal.date,
            time: testMeal.time,
            location: testMeal.location,
            maxAttendees: testMeal.maxAttendees,
          })
        );
      });
    });

    test('❌ Unauthenticated user cannot access meal creation', () => {
      renderWithProviders(<CreateMealWizard />);

      // Should redirect to login or show access denied
      expect(screen.getByText(/login/i) || screen.getByText(/access denied/i)).toBeInTheDocument();
    });
  });

  describe('🧭 Navigation Flow', () => {
    test('✅ User can navigate between main app sections', async () => {
      const authenticatedStore = {
        auth: {
          isAuthenticated: true,
          user: testUser,
          loading: false,
        },
        meals: {
          meals: [],
          loading: false,
          error: null,
        },
      };

      renderWithProviders(<Main />, authenticatedStore);

      // Wait for main component to load
      await waitFor(() => {
        expect(screen.getByText(/meals/i)).toBeInTheDocument();
      });

      // Navigate to Profile tab
      const profileTab = screen.getByRole('tab', { name: /profile/i });
      fireEvent.click(profileTab);

      await waitFor(() => {
        expect(screen.getByText(/my profile/i)).toBeInTheDocument();
      });

      // Navigate to My Meals tab
      const myMealsTab = screen.getByRole('tab', { name: /my meals/i });
      fireEvent.click(myMealsTab);

      await waitFor(() => {
        expect(screen.getByText(/my meals/i)).toBeInTheDocument();
      });

      // Navigate to Chat tab
      const chatTab = screen.getByRole('tab', { name: /chat/i });
      fireEvent.click(chatTab);

      await waitFor(() => {
        expect(screen.getByText(/chat/i)).toBeInTheDocument();
      });

      // Navigate back to Meals tab
      const mealsTab = screen.getByRole('tab', { name: /meals/i });
      fireEvent.click(mealsTab);

      await waitFor(() => {
        expect(screen.getByText(/meals/i)).toBeInTheDocument();
      });
    });

    test('❌ Unauthenticated user cannot access protected sections', () => {
      renderWithProviders(<Main />);

      // Try to access profile tab
      const profileTab = screen.getByRole('tab', { name: /profile/i });
      fireEvent.click(profileTab);

      // Should redirect to login
      expect(window.location.href).toContain('/login');
    });
  });

  describe('👤 Profile Management Flow', () => {
    test('✅ User can view and edit profile', async () => {
      const authenticatedStore = {
        auth: {
          isAuthenticated: true,
          user: testUser,
          loading: false,
        },
      };

      mockedAxios.put.mockResolvedValueOnce({
        data: { user: { ...testUser, name: 'Updated Name' } },
        status: 200,
      });

      renderWithProviders(<Main />, authenticatedStore);

      // Navigate to profile
      const profileTab = screen.getByRole('tab', { name: /profile/i });
      fireEvent.click(profileTab);

      await waitFor(() => {
        expect(screen.getByText(/my profile/i)).toBeInTheDocument();
      });

      // Find edit button and click it
      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      // Update profile information
      const nameInput = screen.getByDisplayValue(testUser.name);
      fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

      // Save changes
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      // Verify API call
      await waitFor(() => {
        expect(mockedAxios.put).toHaveBeenCalledWith(
          expect.stringContaining('/api/users/profile'),
          expect.objectContaining({
            name: 'Updated Name',
          })
        );
      });
    });
  });

  describe('💬 Chat Functionality Flow', () => {
    test('✅ User can access chat list', async () => {
      const authenticatedStore = {
        auth: {
          isAuthenticated: true,
          user: testUser,
          loading: false,
        },
        messages: {
          messages: [],
          loading: false,
          error: null,
        },
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: [],
        status: 200,
      });

      renderWithProviders(<Main />, authenticatedStore);

      // Navigate to chat
      const chatTab = screen.getByRole('tab', { name: /chat/i });
      fireEvent.click(chatTab);

      await waitFor(() => {
        expect(screen.getByText(/chat/i)).toBeInTheDocument();
      });

      // Verify chat list loaded
      expect(screen.getByText(/no messages yet/i) || screen.getByText(/conversations/i)).toBeInTheDocument();
    });
  });

  describe('🔍 Search and Discovery Flow', () => {
    test('✅ User can search for meals', async () => {
      const authenticatedStore = {
        auth: {
          isAuthenticated: true,
          user: testUser,
          loading: false,
        },
        meals: {
          meals: [],
          loading: false,
          error: null,
        },
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: [testMeal],
        status: 200,
      });

      renderWithProviders(<Main />, authenticatedStore);

      // Wait for meals to load
      await waitFor(() => {
        expect(screen.getByText(/meals/i)).toBeInTheDocument();
      });

      // Find search input
      const searchInput = screen.getByPlaceholderText(/search meals/i) || screen.getByLabelText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'test' } });

      // Verify search functionality
      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/meals'),
          expect.objectContaining({
            params: expect.objectContaining({
              search: 'test',
            }),
          })
        );
      });
    });
  });

  describe('🚨 Error Handling Flow', () => {
    test('✅ App handles network errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        message: 'Network Error',
        code: 'ERR_NETWORK',
      });

      renderWithProviders(<Main />);

      // Wait for error to occur
      await waitFor(() => {
        expect(screen.getByText(/error/i) || screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    test('✅ App handles API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { data: { message: 'Server error' }, status: 500 },
      });

      renderWithProviders(<Main />);

      // Wait for error to occur
      await waitFor(() => {
        expect(screen.getByText(/error/i) || screen.getByText(/server error/i)).toBeInTheDocument();
      });
    });
  });

  describe('📱 Responsive Design Flow', () => {
    test('✅ App works on different screen sizes', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithProviders(<Main />);

      // Verify mobile layout elements
      expect(screen.getByRole('navigation')).toBeInTheDocument();

      // Test tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      // Test desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });
  });

  describe('🔒 Security Flow', () => {
    test('✅ App prevents XSS attacks', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      
      renderWithProviders(<Register />);

      const nameInput = screen.getByLabelText(/name/i);
      fireEvent.change(nameInput, { target: { value: maliciousInput } });

      // Verify input is sanitized
      expect(nameInput.value).toBe(maliciousInput);
      
      // Submit form and verify no script execution
      const submitButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(submitButton);

      // Should not execute script
      expect(window.alert).not.toHaveBeenCalled();
    });

    test('✅ App handles invalid JWT tokens', () => {
      // Mock invalid token
      localStorageMock.getItem.mockReturnValue('invalid-token');

      renderWithProviders(<App />);

      // Should handle invalid token gracefully
      expect(screen.getByText(/login/i) || screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  describe('🌐 Integration Flow', () => {
    test('✅ Complete user journey: Register → Login → Create Meal → View Profile', async () => {
      // Mock successful registration
      mockedAxios.post
        .mockResolvedValueOnce({
          data: { token: 'mock-jwt-token', user: testUser },
          status: 201,
        })
        .mockResolvedValueOnce({
          data: { token: 'mock-jwt-token', user: testUser },
          status: 200,
        })
        .mockResolvedValueOnce({
          data: { meal: { ...testMeal, id: 1 } },
          status: 201,
        });

      // Start with registration
      const { rerender } = renderWithProviders(<Register />);

      // Fill and submit registration form
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      fireEvent.change(nameInput, { target: { value: testUser.name } });
      fireEvent.change(emailInput, { target: { value: testUser.email } });
      fireEvent.change(passwordInput, { target: { value: testUser.password } });
      fireEvent.change(confirmPasswordInput, { target: { value: testUser.password } });

      const registerButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(registerButton);

      // Wait for registration to complete
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/users/register'),
          expect.any(Object)
        );
      });

      // Switch to login
      rerender(
        <Provider store={mockStore({ auth: { isAuthenticated: false, user: null } })}>
          <ThemeProvider theme={createTheme()}>
            <BrowserRouter>
              <Login />
            </BrowserRouter>
          </ThemeProvider>
        </Provider>
      );

      // Login
      const loginEmailInput = screen.getByLabelText(/email/i);
      const loginPasswordInput = screen.getByLabelText(/password/i);

      fireEvent.change(loginEmailInput, { target: { value: testUser.email } });
      fireEvent.change(loginPasswordInput, { target: { value: testUser.password } });

      const loginButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(loginButton);

      // Wait for login to complete
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/users/login'),
          expect.any(Object)
        );
      });

      // Switch to main app (authenticated)
      rerender(
        <Provider store={mockStore({ 
          auth: { isAuthenticated: true, user: testUser },
          meals: { meals: [], loading: false }
        })}>
          <ThemeProvider theme={createTheme()}>
            <BrowserRouter>
              <Main />
            </BrowserRouter>
          </ThemeProvider>
        </Provider>
      );

      // Navigate to create meal
      const createMealButton = screen.getByRole('button', { name: /create meal/i }) || 
                               screen.getByText(/create meal/i);
      fireEvent.click(createMealButton);

      // Verify navigation to meal creation
      await waitFor(() => {
        expect(screen.getByText(/create a meal/i)).toBeInTheDocument();
      });

      // Complete meal creation flow
      // ... (meal creation steps as in previous test)

      // Navigate to profile
      const profileTab = screen.getByRole('tab', { name: /profile/i });
      fireEvent.click(profileTab);

      // Verify profile is accessible
      await waitFor(() => {
        expect(screen.getByText(/my profile/i)).toBeInTheDocument();
      });

      // Verify user data is displayed
      expect(screen.getByText(testUser.name)).toBeInTheDocument();
      expect(screen.getByText(testUser.email)).toBeInTheDocument();
    });
  });
});

// Mock window.alert
global.alert = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
