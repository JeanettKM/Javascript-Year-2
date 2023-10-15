export function registerNewUser(userInfo) {
    /**
     * Error handling and targeting the error message element
     */
    const emailRegistrationError = document.getElementById('emailRegistrationError');
        
    /**
     * Send an HTTP POST request to the registration API
     */
    return fetch('https://api.noroff.dev/api/v1/social/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo),
    })
      .then((response) => {
        if (response.ok) {
        /**
         * Success
         */
          return response.json();
        } else {
        /**
         * Error
         */
          throw new Error('Invalid username, email, or password. Please try again.');
        }
      })
      .then((content) => {
        /**
         * Store accessToken in local storage
         */
        console.log('Registration successful', content);
        /**
         * Get sent to the feed page
         */
        window.location.href = 'profile.html';
      })
      .catch((error) => {
        /**
         * Give error message to the user
         */
        console.error('Registration error', error);
        emailRegistrationError.textContent = error.message;
      });
  }

/**
 * Event listener to registration form
 */
  document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
   
    /**
     * Create an object with user information
     */
    const userInfo = {
      name: username,
      email: email,
      password: password,
    };
  


    registerNewUser(userInfo);
  });
  