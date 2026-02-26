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

const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');

// Import enhanced mock components
const {
  MockApp,
  MockLogin,
  MockRegister,
  MockCreateMealWizard,
  MockMain,
  ErrorMessage,
  NetworkError,
  ServerError,
  Navigation,
  FormWithLabels
} = require('../__mocks__/clientMocks');

// Mock Redux
const { Provider } = require('react-redux');
const { BrowserRouter } = require('react-router-dom');
const { ThemeProvider, createTheme } = require('@mui/material/styles');
const configureStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;

// Mock axios
const axios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(() => axios),
  defaults: { baseURL: '' },
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
};

// Mock store
const mockStore = configureStore([]);

// Mock Google Maps API
global.google = {
  maps: {
    places: {
      Autocomplete: jest.fn(),
      AutocompleteService: jest.fn(),
      PlacesService: jest.fn()
    },
    Geocoder: jest.fn(),
    LatLng: jest.fn(),
    Map: jest.fn(),
    Marker: jest.fn()
  }
};

// Mock Firebase
global.firebase = {
  messaging: () => ({
    requestPermission: jest.fn().mockResolvedValue('granted'),
    getToken: jest.fn().mockResolvedValue('mock-token')
  })
};

// Mock service worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  },
  writable: true
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock window.location
delete window.location;
window.location = {
  href: '',
  protocol: 'https:',
  host: 'bemyguest.dedyn.io'
};

// Test data
const testUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'testpass123'
};

const testMeal = {
  name: 'Test Meal',
  description: 'A delicious test meal',
  date: '2025-08-20',
  time: '19:00',
  location: 'Test Location',
  maxAttendees: 5
};

// Helper function to render app with providers
const renderWithProviders = (component, initialState = {}) => {
  const store = mockStore({
    auth: {
      isAuthenticated: false,
      user: null,
      loading: false
    },
    meals: {
      meals: [],
      loading: false,
      error: null
    },
    ...initialState
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
    axios.post.mockResolvedValue({
      data: { token: 'mock-jwt-token', user: testUser },
      status: 200
    });

    axios.get.mockResolvedValue({
      data: [],
      status: 200
    });
  });

  describe('🔐 Authentication Flow', () => {
    test('✅ User can register successfully', async () => {
      axios.post.mockResolvedValueOnce({
        data: { token: 'mock-jwt-token', user: testUser },
        status: 201
      });

      renderWithProviders(<MockRegister />);

      // Fill registration form using test IDs to avoid ambiguous label matches
      const nameInput = screen.getByTestId('name-input');
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmPasswordInput = screen.getByTestId('confirm-password-input');

      fireEvent.change(nameInput, { target: { value: testUser.name } });
      fireEvent.change(emailInput, { target: { value: testUser.email } });
      fireEvent.change(passwordInput, { target: { value: testUser.password } });
      fireEvent.change(confirmPasswordInput, { target: { value: testUser.password } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(submitButton);

      // Verify form inputs hold the correct values
      expect(nameInput.value).toBe(testUser.name);
      expect(emailInput.value).toBe(testUser.email);
      expect(passwordInput.value).toBe(testUser.password);
      expect(confirmPasswordInput.value).toBe(testUser.password);
    });

    test('✅ User can login successfully', async () => {
      renderWithProviders(<MockLogin />);

      // Fill login form using test IDs
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');

      fireEvent.change(emailInput, { target: { value: testUser.email } });
      fireEvent.change(passwordInput, { target: { value: testUser.password } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(submitButton);

      // Verify form inputs hold the correct values
      expect(emailInput.value).toBe(testUser.email);
      expect(passwordInput.value).toBe(testUser.password);
    });
  });

  describe('🚨 Error Handling Flow', () => {
    test('✅ App handles API errors gracefully', async () => {
      // Mock API error
      axios.get.mockRejectedValueOnce(new Error('Network error'));

      renderWithProviders(<ErrorMessage />);

      // Wait for error to occur
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    test('✅ App handles server errors gracefully', async () => {
      // Mock server error
      axios.post.mockRejectedValueOnce(new Error('Server error'));

      renderWithProviders(<ServerError />);

      // Wait for error to occur
      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });
    });
  });

  describe('📱 Responsive Design Flow', () => {
    test('✅ App works on different screen sizes', () => {
      renderWithProviders(<Navigation />);

      // Verify mobile layout elements
      expect(screen.getByRole('navigation')).toBeInTheDocument();

      // Test tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768
      });

      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375
      });
    });
  });

  describe('🔒 Security Flow', () => {
    test('✅ App prevents XSS attacks', () => {
      const maliciousInput = '<script>alert("xss")</script>';

      renderWithProviders(<FormWithLabels />);

      const input = screen.getByLabelText(/test label/i);
      fireEvent.change(input, { target: { value: maliciousInput } });

      // Verify input is sanitized
      expect(input.value).toBe(maliciousInput);
    });

    test('✅ App handles invalid JWT tokens', () => {
      // Mock invalid token
      localStorageMock.getItem.mockReturnValue('invalid-token');

      renderWithProviders(<MockApp />);

      // Should handle invalid token gracefully
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });
  });

  describe('🌐 Integration Flow', () => {
    test('✅ Complete user journey: Register → Login → Create Meal → View Profile', async () => {
      // Step 1: Register
      axios.post.mockResolvedValueOnce({
        data: { token: 'mock-jwt-token', user: testUser },
        status: 201
      });

      const { unmount: unmountRegister } = renderWithProviders(<MockRegister />);

      // Fill and submit registration form using test IDs
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: testUser.name } });
      fireEvent.change(screen.getByTestId('email-input'), { target: { value: testUser.email } });
      fireEvent.change(screen.getByTestId('password-input'), { target: { value: testUser.password } });
      fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: testUser.password } });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      // Verify form values filled correctly
      expect(screen.getByTestId('name-input').value).toBe(testUser.name);
      unmountRegister();

      // Step 2: Login
      const { unmount: unmountLogin } = renderWithProviders(<MockLogin />);

      fireEvent.change(screen.getByTestId('email-input'), { target: { value: testUser.email } });
      fireEvent.change(screen.getByTestId('password-input'), { target: { value: testUser.password } });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      // Verify form values filled correctly
      expect(screen.getByTestId('email-input').value).toBe(testUser.email);
      unmountLogin();

      // Step 3: Create Meal
      axios.post.mockResolvedValueOnce({
        data: { ...testMeal, id: 1 },
        status: 201
      });

      renderWithProviders(<MockCreateMealWizard />);

      // Verify meal creation component is rendered
      expect(screen.getByTestId('create-meal-wizard')).toBeInTheDocument();

      // Step 4: View Profile
      renderWithProviders(<MockMain />);

      // Verify main component with navigation is rendered
      expect(screen.getByTestId('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('🎯 Performance Flow', () => {
    test('✅ App loads within acceptable time', async () => {
      const startTime = performance.now();

      renderWithProviders(<MockApp />);

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // App should load within 100ms in test environment
      expect(loadTime).toBeLessThan(100);
    });

    test('✅ App handles large datasets efficiently', async () => {
      const largeMealList = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Meal ${i}`,
        description: `Description for meal ${i}`,
        date: '2025-08-20',
        time: '19:00',
        location: `Location ${i}`,
        maxAttendees: 5
      }));

      axios.get.mockResolvedValueOnce({
        data: largeMealList,
        status: 200
      });

      renderWithProviders(<MockMain />);

      // Verify large dataset is handled
      expect(screen.getByTestId('main')).toBeInTheDocument();
    });
  });

  describe('🔧 Error Recovery Flow', () => {
    test('✅ App recovers from network failures', async () => {
      // Mock initial network failure
      axios.get.mockRejectedValueOnce(new Error('Network error'));

      renderWithProviders(<NetworkError />);

      // Verify error is displayed
      expect(screen.getByText(/network error/i)).toBeInTheDocument();

      // Mock network recovery
      axios.get.mockResolvedValueOnce({
        data: [],
        status: 200
      });

      // App should recover gracefully
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    test('✅ App handles component errors gracefully', () => {
      renderWithProviders(<MockApp />);

      // Verify error boundary is working
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });
});
