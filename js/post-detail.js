document.addEventListener('DOMContentLoaded', function() {
    // Your JavaScript code here, including the code to create the "Delete Post" button.
});


// Get the post ID from the query parameter
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

const authToken = localStorage.getItem('accessToken');
const postDetailsContainer = document.getElementById('postDetails');
const editPostForm = document.getElementById('editPostForm');
const editForm = document.getElementById('editForm');
const editTitleInput = document.getElementById('editTitle');
const editBodyInput = document.getElementById('editBody');
const editTagsInput = document.getElementById('editTags');
const deleteButton = document.getElementById('deleteButton');

// Function to fetch post details and display them
export function fetchPostDetails() {
    fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch post details');
        }
    })
    .then((post) => {
        // Display the post details on the page
        postDetailsContainer.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <p>Tags: ${post.tags.join(', ')}</p>
            ${post.author ? `<p>Author: ${post.author.name}</p>` : ''}
            <button id="editButton">Edit Post</button>
        `;

        // Add an event listener to the "Edit Post" button
        const editButton = document.getElementById('editButton');
        editButton.addEventListener('click', () => {
            // Display the edit form
            displayEditForm(post);
        });

        // Add an event listener to the "Delete Post" button
        deleteButton.addEventListener('click', () => {
            // Call the function to delete the post
            deletePost(postId);
        });
    })
    .catch((error) => {
        console.error('Error fetching post details:', error);
    });
}

// Function to display the edit form with the post data
export function displayEditForm(post) {
    editTitleInput.value = post.title;
    editBodyInput.value = post.body;
    editTagsInput.value = post.tags.join(', ');

    // Hide post details and display the edit form
    postDetailsContainer.style.display = 'none';
    editPostForm.style.display = 'block';
}

// Function to handle the form submission
export function handleFormSubmit(event) {
    event.preventDefault();

    // Get the form data
    const editedPost = {
        title: editTitleInput.value,
        body: editBodyInput.value,
        tags: editTagsInput.value.split(',').map(tag => tag.trim()),
    };

    // Send a PUT request to update the post
    fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPost),
    })
    .then((response) => {
        if (response.ok) {
            // Post updated successfully, go back to post details
            window.location.href = `post-detail.html?id=${postId}`;
        } else {
            // Log the error response content for debugging
            response.json().then(data => {
                console.error('Error updating post:', data);
            });
        }
    })
    .catch((error) => {
        console.error('Error updating post:', error);
    });
}


// Function to delete the post
export function deletePost(postId) {
    // Send a DELETE request to delete the post
    fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authToken}`,
        },
    })
    .then((response) => {
        if (response.ok) {
            // Post deleted successfully, redirect to a different page or take appropriate action
            // For example, you can redirect to the feed page
            window.location.href = 'feed.html';
        } else {
            throw new Error('Failed to delete post');
        }
    })
    .catch((error) => {
        console.error('Error deleting post:', error);
    });
}

// Fetch and display post details when the page loads
fetchPostDetails();

// Add a submit event listener to the edit form
editForm.addEventListener('submit', handleFormSubmit);
