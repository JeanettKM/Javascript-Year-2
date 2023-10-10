// auth.js

function loginUser(email, password) {
    // Construct the request body with user login data
    const requestBody = {
        email: email,
        password: password,
    };

    // Send a POST request to the login API endpoint
    fetch('https://api.example.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
        .then((response) => {
            if (response.ok) {
                // Login successful
                return response.json();
            } else {
                // Handle login error
                throw new Error('Login failed');
            }
        })
        .then((data) => {
            // Handle successful login, e.g., store the JWT token
            console.log('Login successful', data);
        })
        .catch((error) => {
            // Handle login error, e.g., display an error message
            console.error('Login error', error);
        });
}

// auth.js

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Call the loginUser function with login data
    loginUser(email, password);
});
