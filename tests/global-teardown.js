// Global test teardown - runs once after all tests
module.exports = async () => {
  // Restore console
  global.console = console;
  
  // Clear all mocks
  jest.clearAllMocks();
  jest.clearAllTimers();
  
  // Clean up any remaining handles
  if (global.gc) {
    global.gc();
  }
  
  console.log('🧹 Test environment cleaned up');
};
