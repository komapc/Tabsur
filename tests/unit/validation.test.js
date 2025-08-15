const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateMealInput = require('../../validation/meal');

describe('Validation Functions - Negative Tests', () => {
  describe('validateRegisterInput', () => {
    it('should reject empty name', () => {
      const input = {
        name: '',
        email: 'test@example.com',
        password: 'password123',
        password2: 'password123'
      };
      
      const { errors, isValid } = validateRegisterInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.name).toBeDefined();
    });

    it('should reject invalid email format', () => {
      const input = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        password2: 'password123'
      };
      
      const { errors, isValid } = validateRegisterInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.email).toBeDefined();
    });

    it('should reject short password', () => {
      const input = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        password2: '123'
      };
      
      const { errors, isValid } = validateRegisterInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.password).toBeDefined();
    });

    it('should reject mismatched passwords', () => {
      const input = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        password2: 'differentpassword'
      };
      
      const { errors, isValid } = validateRegisterInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.password2).toBeDefined();
    });

    it('should reject missing required fields', () => {
      const input = {
        name: 'Test User'
        // Missing email, password, password2
      };
      
      const { errors, isValid } = validateRegisterInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.email).toBeDefined();
      expect(errors.password).toBeDefined();
      expect(errors.password2).toBeDefined();
    });
  });

  describe('validateLoginInput', () => {
    it('should reject empty email', () => {
      const input = {
        email: '',
        password: 'password123'
      };
      
      const { errors, isValid } = validateLoginInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.email).toBeDefined();
    });

    it('should reject invalid email format', () => {
      const input = {
        email: 'invalid-email',
        password: 'password123'
      };
      
      const { errors, isValid } = validateLoginInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.email).toBeDefined();
    });

    it('should reject empty password', () => {
      const input = {
        email: 'test@example.com',
        password: ''
      };
      
      const { errors, isValid } = validateLoginInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.password).toBeDefined();
    });

    it('should reject missing fields', () => {
      const input = {
        email: 'test@example.com'
        // Missing password
      };
      
      const { errors, isValid } = validateLoginInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.password).toBeDefined();
    });
  });

  describe('validateMealInput', () => {
    it('should reject empty meal name', () => {
      const input = {
        name: '',
        description: 'Test description',
        date: Date.now() + 86400000,
        address: '123 Test Street',
        location: { lng: 34.808, lat: 32.09 },
        host_id: 1,
        guest_count: 3,
        image_id: -1,
        type: 1,
        visibility: 1
      };
      
      const { errors, isValid } = validateMealInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.name).toBeDefined();
    });

    it('should accept empty address (now optional)', () => {
      const input = {
        name: 'Test Meal',
        description: 'Test description',
        date: Date.now() + 86400000,
        address: '',
        location: { lng: 34.808, lat: 32.09 },
        host_id: 1,
        guest_count: 3,
        image_id: -1,
        type: 1,
        visibility: 1
      };
      
      const { errors, isValid } = validateMealInput(input);
      
      // Address is now optional, so this should pass
      expect(isValid).toBe(true);
    });

    it('should reject negative guest count', () => {
      const input = {
        name: 'Test Meal',
        description: 'Test description',
        date: Date.now() + 86400000,
        address: '123 Test Street',
        location: { lng: 34.808, lat: 32.09 },
        host_id: 1,
        guest_count: -1,
        image_id: -1,
        type: 1,
        visibility: 1
      };
      
      const { errors, isValid } = validateMealInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.guest_count).toBeDefined();
    });

    it('should reject non-numeric guest count', () => {
      const input = {
        name: 'Test Meal',
        description: 'Test description',
        date: Date.now() + 86400000,
        address: '123 Test Street',
        location: { lng: 34.808, lat: 32.09 },
        host_id: 1,
        guest_count: 'not-a-number',
        image_id: -1,
        type: 1,
        visibility: 1
      };
      
      const { errors, isValid } = validateMealInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.guest_count).toBeDefined();
    });

    it('should reject missing required fields', () => {
      const input = {
        name: 'Test Meal',
        // Missing description, date, location, host_id, guest_count
      };
      
      const { errors, isValid } = validateMealInput(input);
      
      expect(isValid).toBe(false);
      expect(errors.description).toBeDefined();
      expect(errors.date).toBeDefined();
      expect(errors.location).toBeDefined();
      expect(errors.host_id).toBeDefined();
      expect(errors.guest_count).toBeDefined();
    });
  });
});
