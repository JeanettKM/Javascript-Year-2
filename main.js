// Function to fetch all posts
function fetchPosts() {
    // Retrieve the JWT token from localStorage
    const authToken = localStorage.getItem('accessToken');

    return fetch('https://api.noroff.dev/api/v1/social/posts', {
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

// Define the displayPosts function
function displayPosts(posts) {
    const postFeed = document.getElementById('postFeed');

    // Clear existing posts
    postFeed.innerHTML = '';

    // Loop through the posts and create HTML elements for each post
    posts.forEach((post) => {
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

// Function to filter posts based on the user's selection
const filterSelect = document.getElementById('filterSelect');
if (filterSelect) {
    filterSelect.addEventListener('change', () => {
        const selectedFilter = filterSelect.value;

        // Fetch and filter posts based on the selected filter
        fetchPosts()
            .then((data) => filterPosts(selectedFilter, data))
            .catch((error) => {
                console.error('Error fetching or filtering posts:', error);
            });
    });
}

// Call the fetchPosts function to load posts when the page loads
fetchPosts()
    .then((data) => {
        // Call displayPosts immediately after fetching posts
        displayPosts(data);
    })
    .catch((error) => {
        console.error('Error fetching or filtering posts:', error);
    });

// Function to search posts based on keywords or tags
function searchPosts(query, posts) {
    // Filter posts based on the user's query
    const filteredPosts = posts.filter((post) => {
        // Check if the post title or tags contain the query (case-insensitive)
        const postTitle = post.title.toLowerCase();
        const postTags = post.tags.join(', ').toLowerCase();
        query = query.toLowerCase();

        return postTitle.includes(query) || postTags.includes(query);
    });

    // Display the filtered posts
    displayPosts(filteredPosts);
}

// Event listener for the search button
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', () => {
    // Get the user's search query from the input field
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value;

    // Call the searchPosts function with the user's query and all posts
    fetchPosts()
        .then((data) => {
            searchPosts(query, data);
        })
        .catch((error) => {
            console.error('Error fetching or filtering posts:', error);
        });
});

// Function to create a new post
function createPost(title, content) {
    const authToken = localStorage.getItem('accessToken');

    // Construct the request body with post data
    const requestBody = {
        title: title,
        body: content,
    };

    // Send a POST request to create a new post
    fetch('https://api.noroff.dev/api/v1/social/posts', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then((response) => {
        if (response.ok) {
            // Post creation successful
            return response.json();
        } else {
            // Handle post creation error
            throw new Error('Post creation failed');
        }
    })
    .then((data) => {
        // Handle successful post creation, e.g., display a success message
        console.log('Post created successfully', data);

        // You may want to refresh the post feed or take other actions here
    })
    .catch((error) => {
        // Handle post creation error, e.g., display an error message
        console.error('Post creation error', error);
    });
}

// Add an event listener to the create post form
const createPostForm = document.getElementById('createPostForm');
createPostForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const postTitle = document.getElementById('postTitle').value;
    const postContent = document.getElementById('postContent').value;

    // Call the createPost function with post data
    createPost(postTitle, postContent);
});

// Export authToken
export const authToken = localStorage.getItem('accessToken');
