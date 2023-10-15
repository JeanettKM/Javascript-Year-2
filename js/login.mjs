/**
 * Wait for the HTML document to load before loading JS
 */
document.addEventListener('DOMContentLoaded', () => {
  

  /**
  * Getting the login form element by its ID.
  */
    const userLoginForm = document.getElementById('userLoginForm');
    /**
     * Add an event listener to the login form when it's submitted
     */
    userLoginForm.addEventListener('submit', async function (e) {
    /**
     * Prevent the form from refreshing which is the defult behaviour.
     */
      e.preventDefault();
    /**
     * Get the user's email and password from the form
     */
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
      /**
       * Call the `userLoginAction` function with the provided email *and password.
       */
        await userLoginAction(email, password);
      } catch (error) {
      /**
       * Display an error message to the user if appropriate.
       */
        console.error('Login error', error);
  
        const displayError = document.getElementById('displayError');
      /**
       * Customizable error message
       */
        displayError.textContent = 'Incorrect Email or password please try again.';
      }
    });
  });
  
  
/**
 * Log in user
 */
  export async function userLoginAction(email, password) {
  /**
   * Create an object with user email and password
   */
    const userInfoRequest = { email, password };
  
    try {
   /**
    * Send a POST request to the server's login endpoint.
    */
      const response = await fetch('https://api.noroff.dev/api/v1/social/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfoRequest),
      });
  
      if (response.ok) {
        const content = await response.json();
       /**
        * Store accessToken in local storage
        */
        localStorage.setItem('accessToken', content.accessToken);
        localStorage.setItem('userEmail', email);
       /**
        * Send to the feed page
        */
        window.location.href = 'feed.html';
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      throw error; 
    }
  }
  
  