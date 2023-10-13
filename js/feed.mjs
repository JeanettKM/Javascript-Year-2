let allPosts = [];
let currentPage = 1;
const postsPerPage = 8;

const postFeed = document.getElementById('postFeed');
const loadMoreButton = document.getElementById('loadMoreButton');
const filterSelect = document.getElementById('filterSelect');
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const createPostForm = document.getElementById('createPostForm');

// Loading state...
function displayLoadingState() {
  postFeed.innerHTML = 'Loading...';
}

// Fetch posts from the API
async function fetchPosts() {
  try {
    const authToken = localStorage.getItem('accessToken');
    const response = await fetch('https://api.noroff.dev/api/v1/social/posts', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Failed to fetch posts');
    }
  } catch (error) {
    throw error;
  }
}

// Show posts as cards, styling by Bulma css framework
function displayPostsAsCards(posts, append = false) {
  if (!append) {
    postFeed.innerHTML = '';
  }

  if (posts.length === 0) {
    postFeed.innerHTML = 'No posts found.';
  } else {
    posts.forEach((post) => {
      const card = document.createElement('div');
      card.className = 'column';

      card.innerHTML = `
      <div class="card">
        <div class="card-content">
          <p class="title is-4">${post.title}</p>
          <div class="content">${post.body}</div>
          <p>Tags: ${post.tags.join(', ')}</p>
          ${post.author ? `
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="${post.author.profile_image_url}" alt="${post.author.name}">
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-5">${post.author.name}</p>
                <p class="subtitle is-6">@${post.author.username}</p>
              </div>
            </div>
          ` : ''}
          ${post.media ? `
            <div class="media">
              <div class="media-content">
                <img src="${post.media}" alt="Media">
              </div>
            </div>
          ` : ''}
          <div class="mt-4"> <!-- Add margin top for spacing -->
            <a href="post-detail.html?id=${post.id}" class="button">View Details</a>
          </div>
        </div>
      </div>
    `;

      if (append) {
        postFeed.appendChild(card);
      } else {
        postFeed.insertBefore(card, postFeed.firstChild);
      }
    });
  }
}

// Fetch posts by a specific user
export async function fetchPostsByUser(authToken) {
    try {
      const response = await fetch('https://api.noroff.dev/api/v1/social/posts', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to fetch user posts');
      }
    } catch (error) {
      throw error;
    }
  }

// Load and show the next 8 posts
function loadMorePosts(button = null) {
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const postsToDisplay = allPosts.slice(startIndex, endIndex);
  displayPostsAsCards(postsToDisplay, true); // Append new posts

  // Check for more posts to load
  if (endIndex < allPosts.length) {
    currentPage++;
  } else if (button) {
    button.style.display = 'none'; // Hide the "Load More" button when there are no more posts to load.
  }
}

// Event listener for the "Load More" button
if (loadMoreButton) {
  loadMoreButton.addEventListener('click', () => loadMorePosts(loadMoreButton));
}

// Load initial posts when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  const data = await fetchPosts();
  allPosts = data;
  loadMorePosts(loadMoreButton);
});

// Event listener for the filter dropdown
if (filterSelect) {
  filterSelect.addEventListener('change', () => {
    const selectedFilter = filterSelect.value;
    filterPosts(selectedFilter);
  });
}

// Function to filter posts based on selected filter
function filterPosts(selectedFilter) {
  currentPage = 1; 

  if (loadMoreButton) {
    loadMoreButton.style.display = 'block'; // Show "Load More" button
  }

  if (selectedFilter === 'all') {
    displayPostsAsCards(allPosts.slice(0, postsPerPage)); // Display the first 8 posts
  } else {
    const filteredPosts = allPosts.filter((post) => {
      if (selectedFilter === 'comments') {
        return post._count.comments > 0;
      } else if (selectedFilter === 'reactions') {
        return post._count.reactions > 0;
      }
    });

    if (filteredPosts.length === 0) {
      postFeed.innerHTML = 'No posts found.';

      if (loadMoreButton) {
        loadMoreButton.style.display = 'none'; // Hide "Load More" button
      }
    } else {
      displayPostsAsCards(filteredPosts.slice(0, postsPerPage)); // Display the first 8 filtered posts
    }
  }
}

// Search posts based on search input
function searchPosts(query, posts) {
    const filteredPosts = posts.filter((post) => {
      const postTitle = post.title.toLowerCase();
      const postTags = post.tags.join(', ').toLowerCase();
      query = query.toLowerCase();
  
      return postTitle.includes(query) || postTags.includes(query);
    });
  
    currentPage = 1; // Reset the page to the first page
  
    // Instead of hiding the "Load More" button, just load the initial 8 posts.
    displayPostsAsCards(filteredPosts.slice(0, postsPerPage));
  }
  


// Event listener for the search button
if (searchButton) {
  searchButton.addEventListener('click', async () => {
    const query = searchInput.value;

    try {
      displayLoadingState(); // Display loading state...
      const data = await fetchPosts();
      searchPosts(query, data);
    } catch (error) {
      console.error('Error fetching or filtering posts:', error);
    }
  });
}

// Create a new post
export async function createPost(title, content) {
  try {
    const authToken = localStorage.getItem('accessToken');
    const requestBody = { title, body: content };

    const response = await fetch('https://api.noroff.dev/api/v1/social/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Post created successfully', data);
    } else {
      throw new Error('Post creation failed');
    }
  } catch (error) {
    console.error('Post creation error', error);
  }
}

// Event listener for the create post form
if (createPostForm) {
  createPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const postTitle = document.getElementById('postTitle').value;
    const postContent = document.getElementById('postContent').value;

    await createPost(postTitle, postContent);
  });
}

// Export authToken
export default localStorage.getItem('accessToken');