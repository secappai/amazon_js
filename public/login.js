document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (form && emailInput && passwordInput) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      sendLoginData(email, password);
    });
  } else {
    console.error('One or more elements not found!');
  }

  function sendLoginData(email, password) {
    const body = { email, password };

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((body) => handleLoginResponse(body))
      .catch((error) => console.error('Error:', error));
  }

  function handleLoginResponse(response) {
    const successContainer = document.getElementById('successMessage');
    const errorContainer = document.getElementById('errorMessage');
    if (successContainer && errorContainer) {
      if (response.success) {
        successContainer.textContent = response.message;
        // Redirect to home page or perform additional actions
      } else {
        errorContainer.textContent = response.message;
      }
    } else {
      console.error('Success or error container element not found!');
    }
  }
});
