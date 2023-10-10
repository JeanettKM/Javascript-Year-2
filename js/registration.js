// Define the registerUser function
function registerUser(username, email, password) {
    // Construct the request body with user registration data
    const requestBody = {
        "name": username,
        "email": email,
        "password": password,
    };

    // Send a POST request to the user registration API endpoint
    fetch('https://api.noroff.dev/api/v1/social/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
        .then((response) => {
            if (response.ok) {
                // Registration successful
                return response.json();
            } else {
                // Handle registration error
                throw new Error('Registration failed');
            }
        })
        .then((data) => {
            // Handle successful registration, e.g., store the access token
            console.log('Registration successful', data);

            // Redirect to the profile page (change 'profile.html' to your actual page name)
            window.location.href = 'feed.html';
        })
        .catch((error) => {
            // Handle registration error, e.g., display an error message
            console.error('Registration error', error);
        });
}

// Add an event listener to the registration form
document.getElementById('registrationForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Call the registerUser function with user registration data
    registerUser(username, email, password);
});
