/**
 * Get post ID and accessToken
 */ 
const urlSearch = new URLSearchParams(window.location.search);
const postId = urlSearch.get('id');
const authenticationToken = localStorage.getItem('accessToken');


/**
 * HTML elements / DOM elemets to be used through their ID
 */ 
const postContentContainer = document.getElementById('postDetails');
const editPostForm = document.getElementById('editPostForm');
const editForm = document.getElementById('editForm');
const editTitleText = document.getElementById('editTitle');
const editBodyText = document.getElementById('editBody');
const editTagsInput = document.getElementById('editTags');
const deleteBtn = document.getElementById('deleteBtn');


/**
 * Get user email from local storage
 */ 
const userEmail = localStorage.getItem('userEmail');


/**
 * Function to fetch and display post details
 */ 
function fetchPostContent() {
    /**
     * console.log post ID and the Autheticationtoken to check if it    * works as it should
     */ 
    console.log('Fetching post details for postId:', postId);
    console.log('Using authenticationToken:', authenticationToken);

    /**
     * Send an HTTP GET request to the API to fetch the post details
     */
    fetch(`https://api.noroff.dev/api/v1/social/posts/${postId}?_author=true`, {
        headers: {
            'Authorization': `Bearer ${authenticationToken}`
        }
    })
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

        /**
         * fetch the posts and put them into the Card styling from Bulma * CSS framework
         */ 
        const postCard = document.createElement('div');
        postCard.classList.add('card', 'post-card');
        postCard.innerHTML = `
        <div class="card-image is-centered m-2">
        <figure class="has-text-centered">
            ${post.media ? `<img class="post-image" src="${post.media}" alt="Post Media">` : ''}
        </figure>
        </div>
            <div class="card-content">
                <h2 class="title mb-6">${post.title}</h2>
                <p>${post.body}</p>
                <p class="mt-6">Tags: ${post.tags.join(', ')}</p>
                ${post.author ? `<p class="mb-2 m-2 ownerColor">Published by: ${post.author.name}</p>` : ''}
                <section class="m-3">
                <div>
                <p>Comments: ${post._count.comments}</p>
                </div>
                <div>
                <p>Reactions: ${post._count.reactions}</p>
                </div>
                </section>
            </div>
        `;
        
        /**
         * Check if the post publisher is the logged-in user and show   *the Edit and Delete buttons if thats the case
         */ 
        if (userEmail === post.author.email) {
            const editBtn = document.createElement('button');
            editBtn.id = 'editBtn';
            editBtn.className = 'button is-primary mt-4';
            editBtn.textContent = 'Edit Post';
            postCard.querySelector('.card-content').appendChild(editBtn);
            /**
             * Show Delete button
             */
            if (deleteBtn) {
                deleteBtn.style.display = 'block';
            }
            /**
             * Event listeners for the Edit and Delete buttons
             */
            editBtn.addEventListener('click', () => {
                showEditForm(post);
            });
            deleteBtn.addEventListener('click', () => {
                deletePost(post.id);
            });
        }
        /**
         * Adding the post details to the html
         */ 
        postContentContainer.innerHTML = '',
        postContentContainer.appendChild(postCard);
    })
    .catch((error) => {
        console.error('Error fetching post details:', error);
    });
}



/**
 * Show the edit form
 */ 
function showEditForm(post) {
    editTitleText.value = post.title;
    editBodyText.value = post.body;
    editTagsInput.value = post.tags.join(', ');

    postContentContainer.style.display = 'none';
    editPostForm.style.display = 'block';
}


/**
 * Event listener for the edit form
 */ 
editForm.addEventListener('submit', formSubmission);


/**
 * Handle form submission
 */ 
function formSubmission(event) {
    console.log('formSubmission called');
    event.preventDefault();

    const editedPost = {
        title: editTitleText.value,
        body: editBodyText.value,
        tags: editTagsInput.value.split(',').map(tag => tag.trim()),
    };
    
    /**
     * HTTP PUT request to update the post
     */ 
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
            console.log('Post updated! post ID:', postId);
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


/**
 * HTTP DELETE request to delete the post
 */ 
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
            console.log('Post deleted. Sending you to feed.html');
            window.location.href = 'profile.html';
        } else {
            console.error('Could not delete the post.', response.status);
            throw new Error('Could not delete the post.');
        }
    })
    .catch((error) => {
        console.error('There was an error deleting the post:', error);
    });
}


/**
 * Show the posts when the page has loaded
 */ 
fetchPostContent();
