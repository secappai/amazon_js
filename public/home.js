form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent the default form submission
 
  const formData = new FormData(event.target); // Automatically collects all form fields, including files

  try {
    const response = await fetch('/home', {
      method: 'POST',
      body: formData // Send the FormData object directly
    });

    const result = await response.json();
    console.log(result); // Handle the server response
  } catch (error) {
    console.error('Error:', error);
  }
});
