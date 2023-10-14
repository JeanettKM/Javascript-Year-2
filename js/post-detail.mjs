const urlSearch = new URLSearchParams(window.location.search);
const postId = urlSearch.get('id');
const authenticationToken = localStorage.getItem('accessToken');
const postContentContainer = document.getElementById('postDetails');
const editPostForm = document.getElementById('editPostForm');
const editForm = document.getElementById('editForm');
const editTitleText = document.getElementById('editTitle');
const editBodyText = document.getElementById('editBody');
const editTagsInput = document.getElementById('editTags');
const deleteBtn = document.getElementById('deleteBtn');

// Function to fetch and display post details
function fetchPostContent() {
    // Check if the postId parameter is present in the URL
    console.log('Fetching post details for postId:', postId);
    console.log('Using authenticationToken:', authenticationToken);

    // Send an HTTP GET request to the API to fetch the post details
    fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}`, {
        headers: {
            'Authorization': `Bearer ${authenticationToken}`
        }
    })
    // Handle response from the server, if ok then return the post details as JSON, otherwise throw an error.
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            console.error('Failed to fetch post details. Response status:', response.status);
            throw new Error('Failed to fetch post details');
        }
    })
    .then((post) => {
        console.log('Fetched post:', post);
        
        // Create and populate the post card
        const postCard = document.createElement('div');
        postCard.classList.add('card', 'post-card');
        postCard.innerHTML = `
            <div class="card-image is-centered">
                <figure class="has-text-centered">
                    <img class="post-image" src="${post.media}" alt="Post Media">
                </figure>
            </div>
            <div class="card-content">
                <h2 class="title">${post.title}</h2>
                <p>${post.body}</p>
                <p>Tags: ${post.tags.join(', ')}</p>
                ${post.author ? `<p>Author: ${post.author.name}</p>` : ''}
                <button id="editBtn" class="button is-primary mt-4">Edit Post</button>
            </div>
        `;

        // Add the post card to the container
        postContentContainer.innerHTML = ''; // Clear previous content
        postContentContainer.appendChild(postCard);

        // Add an event listener to the "Edit Post" button
        const editBtn = postCard.querySelector('#editBtn');
        editBtn.addEventListener('click', () => {
            showEditForm(post);
        });
    })
    .catch((error) => {
        console.error('Error fetching post details:', error);
    });
}

// Function to display the edit form
function showEditForm(post) {
    editTitleText.value = post.title;
    editBodyText.value = post.body;
    editTagsInput.value = post.tags.join(', ');

    postContentContainer.style.display = 'none';
    editPostForm.style.display = 'block';

}

// Event listener for the edit form submission
editForm.addEventListener('submit', formSubmission);

// Function to handle form submission
function formSubmission(event) {
    console.log("formSubmission called");
    event.preventDefault();

    const editedPost = {
        title: editTitleText.value,
        body: editBodyText.value,
        tags: editTagsInput.value.split(',').map(tag => tag.trim()),
    };

    // HTTP PUT request to update the post
    console.log('Updating post with id:', postId);
    fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${authenticationToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPost),
    })
    .then((response) => {
        if (response.ok) {
            console.log('Post updated successfully. postId before redirection:', postId);
            window.location.href = `post-detail.html?id=${postId}`;
        } else {
            response.json().then(content => {
                console.error('Error updating post:', content);
            });
        }
    })
    .catch((error) => {
        console.error('Error updating post:', error);
    });
}

// HTTP DELETE request to delete the post
function deletePost(postId) {
    console.log('Deleting post with id:', postId);
    fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authenticationToken}`,
        },
    })
    .then((response) => {
        if (response.ok) {
            console.log('Post deleted successfully. Redirecting to feed.html');
            window.location.href = 'feed.html';
        } else {
            console.error('Failed to delete post. Response status:', response.status);
            throw new Error('Failed to delete post');
        }
    })
    .catch((error) => {
        console.error('Error deleting post:', error);
    });
}

// Event listener for the "Delete Post" button
deleteBtn.addEventListener('click', () => {
    deletePost(postId);
});

// Fetch and display post details when the page loads
fetchPostContent();

