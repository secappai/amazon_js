// Client-side registration form validation tests
const { displayErrorMessage } = require('./register');
const { validateForm } = require('./register');

describe('validateForm', () => {
  test('should return false for invalid email', () => {
    const email = 'invalidemail';
    const password = 'password123';
    const rePassword = 'password123';

    expect(validateForm(email, password, rePassword)).toBe(false);
  });

  test('should return false for password length less than 8', () => {
    const email = 'valid@email.com';
    const password = 'short';
    const rePassword = 'short';

    expect(validateForm(email, password, rePassword)).toBe(false);
  });

  test('should return false for mismatched passwords', () => {
    const email = 'valid@email.com';
    const password = 'password123';
    const rePassword = 'differentpassword';

    expect(validateForm(email, password, rePassword)).toBe(false);
  });

  test('should return true for valid form data', () => {
    const email = 'valid@email.com';
    const password = 'password123';
    const rePassword = 'password123';

    expect(validateForm(email, password, rePassword)).toBe(true);
  });
});

describe('displayErrorMessage', () => {
  test('should display the error message and style it correctly', () => {
    document.body.innerHTML = '<div id="errorMessage"></div>';
    const errorMessage = 'Invalid input';
    displayErrorMessage(errorMessage);
    const errorContainer = document.getElementById('errorMessage');
    expect(errorContainer.textContent).toBe(errorMessage);
    expect(errorContainer.classList.contains('error')).toBe(true);
    expect(errorContainer.classList.contains('success')).toBe(false);
  });
});

// Add more tests as needed
