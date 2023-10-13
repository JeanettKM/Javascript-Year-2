// Import the authorization token
import authToken from './feed.js';

// Function to display posts
export function displayUserPosts(posts) {
    const postFeed = document.getElementById('postFeed');

    // Clear existing posts
    postFeed.innerHTML = '';

    // Retrieve the user's email or unique identifier from localStorage
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        console.error('User email not found in localStorage');
        return;
    }

    // Filter and display only the logged-in user's posts
    const userPosts = posts.filter((post) => post.author.email === userEmail);

    // Create the html elements for the posts
    userPosts.forEach((post) => {
        // Create a card structure for the post
        const postCard = document.createElement('div');
        postCard.classList.add('card', 'post-card');

        postCard.innerHTML = `
            <div class="card-content">
                <h2 class="title">${post.title}</h2>
                <p>${post.body}</p>
                <p>Tags: ${post.tags.join(', ')}</p>
                ${post.author ? `<p>Author: ${post.author.name}</p>` : ''}
            </div>
        `;

        // Create a link to view post details on post-details.html
        const postLink = document.createElement('a');
        postLink.href = `post-detail.html?id=${post.id}`;
        postLink.appendChild(postCard);

        postFeed.appendChild(postLink);
    });
}

// Function to fetch all posts
export function fetchAllPosts() {
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
