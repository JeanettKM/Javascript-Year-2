// Import the authToken as a default import
import authToken from './main.js';


// Define the displayUserPosts function
function displayUserPosts(posts) {
    const postFeed = document.getElementById('postFeed');

    // Clear existing posts
    postFeed.innerHTML = '';

    // Retrieve the user's email or unique identifier from localStorage
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        console.error('User email not found in localStorage');
        return;
    }

    // Filter and display only the user's posts
    const userPosts = posts.filter((post) => post.author.email === userEmail);

    // Loop through the user's posts and create HTML elements for each post
    userPosts.forEach((post) => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        // Create a link to view post details on post-details.html
        const postLink = document.createElement('a');
        postLink.href = `post-detail.html?id=${post.id}`;
        postLink.textContent = post.title;

        postElement.appendChild(postLink);

        postFeed.appendChild(postElement);
    });
}

// Rest of your code

// Function to fetch all posts (from main.js)
function fetchAllPosts() {
    return fetch('https://api.noroff.dev/api/v1/social/posts?_author=true', {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch posts');
        }
    });
}

// Call the fetchAllPosts function to load all posts when the page loads
fetchAllPosts()
    .then((data) => {
        // Call displayUserPosts immediately after fetching all posts
        displayUserPosts(data);
    })
    .catch((error) => {
        console.error('Error fetching posts:', error);
    });
