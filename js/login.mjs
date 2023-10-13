// Form submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
  
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        await loginUser(email, password);
      } catch (error) {
        console.error('Login error', error);
  
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.textContent = 'Incorrect Email or password please try again.';
      }
    });
  });
  
  
  // Log in user
  export async function loginUser(email, password) {
    const requestBody = { email, password };
  
    try {
      const response = await fetch('https://api.noroff.dev/api/v1/social/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('userEmail', email);
  
        window.location.href = 'feed.html';
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      throw error; 
    }
  }
  