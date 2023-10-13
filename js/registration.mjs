export function registerUser(username, email, password) {
    const requestBody = {
        name: username,
        email: email,
        password: password,
    };

    // Error handling and API call
    const registrationError = document.getElementById('registrationError');

    // Send a POST request to the registration API
    return fetch('https://api.noroff.dev/api/v1/social/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then((response) => {
        if (response.ok) {
            // Successful registration
            return response.json();
        } else {
            // error
            throw new Error('Invalid username, email, or password. Please check your input.');
        }
    })
    .then((data) => {
        // store the accessToken user in local storage
        console.log('Registration successful', data);

        // Redirect to the feed page
        window.location.href = 'feed.html';
    })
    .catch((error) => {
        // Display error message to the user
        console.error('Registration error', error);
        registrationError.textContent = error.message;
    });
}

// Add an event listener to the registration form
document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    
    registerUser(username, email, password);
});
