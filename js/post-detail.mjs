// Getting ID from the query parameter
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

// Function to fetch post details and show them
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
        // Create a card structure for the post gotten from Bulma css framework
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
                <button id="editButton" class="button is-primary mt-4">Edit Post</button>
            </div>
        `;

        //event listener on the "Edit Post" button
        const editButton = postCard.querySelector('#editButton');
        editButton.addEventListener('click', () => {
            displayEditForm(post);
        });

        postDetailsContainer.appendChild(postCard);
    })
    .catch((error) => {
        console.error('Error fetching post details:', error);
    });
}

// Display the edit form
export function displayEditForm(post) {
    editTitleInput.value = post.title;
    editBodyInput.value = post.body;
    editTagsInput.value = post.tags.join(', ');

    postDetailsContainer.style.display = 'none';
    editPostForm.style.display = 'block';
}

export function handleFormSubmit(event) {
    event.preventDefault();

    const editedPost = {
        title: editTitleInput.value,
        body: editBodyInput.value,
        tags: editTagsInput.value.split(',').map(tag => tag.trim()),
    };

    //PUT request to update the post
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
            window.location.href = `post-detail.html?id=${postId}`;
        } else {
            response.json().then(data => {
                console.error('Error updating post:', data);
            });
        }
    })
    .catch((error) => {
        console.error('Error updating post:', error);
    });
}

// Delete the post
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
            // Post deleted successfully, go back to feed
            window.location.href = 'feed.html';
        } else {
            throw new Error('Failed to delete post');
        }
    })
    .catch((error) => {
        console.error('Error deleting post:', error);
    });
}

// Event listener to the "Delete Post" button
deleteButton.addEventListener('click', () => {
    deletePost(postId);
});

// Fetch and show posts when the page loads
fetchPostDetails();


editForm.addEventListener('submit', handleFormSubmit);