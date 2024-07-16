document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registerForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const rePasswordInput = document.getElementById('rePassword');

  if (form && emailInput && passwordInput && rePasswordInput) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const rePassword = rePasswordInput.value;

      if (!validateForm(email, password, rePassword)) {
        return;
      }

      sendRegistrationData(email, password);
    });
  } else {
    console.error('One or more elements not found!');
  }

  function validateForm(email, password, rePassword) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      displayErrorMessage('Invalid email address');
      return false;
    }

    if (password.length < 8) {
      displayErrorMessage('Password must be at least 8 characters long');
      return false;
    }

    if (password !== rePassword) {
      displayErrorMessage('Passwords do not match');
      return false;
    }

    return true;
  }

  function displayErrorMessage(message) {
    const errorContainer = document.getElementById('errorMessage');
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.classList.remove('success');
      errorContainer.classList.add('error');
    } else {
      console.error('Error container element not found!');
    }
  }

  function sendRegistrationData(email, password) {
    const body = { email, password };

    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((body) => handleRegistrationResponse(body))
      .catch((error) => console.error('Error:', error));
  }

  function handleRegistrationResponse(response) {
    const successContainer = document.getElementById('successMessage');
    const errorContainer = document.getElementById('errorMessage');
    if (successContainer && errorContainer) {
      if (response.success) {
        successContainer.textContent = response.message;
      } else {
        errorContainer.textContent = response.message;
      }
    } else {
      console.error('Success or error container element not found!');
    }
  }
});
