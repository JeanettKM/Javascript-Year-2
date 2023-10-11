document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Call a function to handle the login with these credentials
    loginUser(email, password);
});

export function loginUser(email, password) {
    const requestBody = {
        email: email,
        password: password,
    };

    return fetch('https://api.noroff.dev/api/v1/social/auth/login', {
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
                throw new Error('Login failed'); // Custom error message
            }
        })
        .then((data) => {
            // Handle successful login, e.g., store the JWT token in localStorage
            localStorage.setItem('accessToken', data.accessToken);

            // Store the user's email in localStorage
            localStorage.setItem('userEmail', email);

            // Redirect to the user's profile page or another appropriate page
            window.location.href = 'feed.html';
        })
        .catch((error) => {
            // Handle login error
            console.error('Login error', error);

            // Display an error message to the user
            const errorContainer = document.getElementById('errorContainer');
            errorContainer.textContent = 'Incorrect Email or password';
        });
}
