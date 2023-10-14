// Variables
let allPosts = [];
let thisPage = 1;
const amountOfPosts = 8;

// DOM elements to be used through their ID
const feedContent = document.getElementById('feedContent');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const chosenFilter = document.getElementById('chosenFilter');
const searchBtn = document.getElementById('searchBtn');
const searchText = document.getElementById('searchText');
const newPostForm = document.getElementById('newPostForm');

// Loading state... to indicate that the posts are being gathered by the API
function displayLoading() {
  feedContent.innerHTML = 'Loading...';
}

// Fetch posts from the API
async function fetchPosts() {
  try {
    // Get access token from local storage
    const authenticationToken = localStorage.getItem('accessToken');
    // Send a request to the API to get posts with authentication token from the request headers
    const response = await fetch('https://api.noroff.dev/api/v1/social/posts', {
      headers: {
        'Authorization': `Bearer ${authenticationToken}`
      }
    });

    if (response.ok) {
       // If the request is successful, load the posts and content into the DOM
      const content = await response.json();
      return content;
    } else {
      throw new Error('Failed to fetch posts');
    }
  } catch (error) {
    throw error;
  }
}

// Show posts as cards, styling by Bulma CSS framework
function addBulmaCardStyling(posts, append = false) {
  if (!append) {
    feedContent.innerHTML = '';
  }

  if (posts.length === 0) {
    feedContent.innerHTML = 'No posts found.';
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
              <div class="media-content feed-img">
                <img src="${post.media}" alt="Media">
              </div>
            </div>
          ` : ''}
          <div class="mt-4">
            <a href="post-detail.html?id=${post.id}" class="button">View Details</a>
          </div>
        </div>
      </div>
    `;

      if (append) {
        feedContent.appendChild(card);
      } else {
        feedContent.insertBefore(card, feedContent.firstChild);
      }
    });
  }
}

// Load and show the next 8 posts
function showMorePosts(button = null) {
  const postStart = (thisPage - 1) * amountOfPosts;
  const postEnd = postStart + amountOfPosts;
  const postsToShow = allPosts.slice(postStart, postEnd);
  addBulmaCardStyling(postsToShow, true); // Add new posts

  // Check for more posts to load
  if (postEnd < allPosts.length) {
    thisPage++;
  } else if (button) {
    button.style.display = 'none'; // Hide the "Load More" button when there are no more posts to load.
  }
}

// Event listener for the "Load More" button
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => showMorePosts(loadMoreBtn));
}

// Load the first posts when the page is loaded.
document.addEventListener('DOMContentLoaded', async () => {
  const content = await fetchPosts();
  allPosts = content;
  showMorePosts(loadMoreBtn);
});

// Event listener for the filter dropdown
if (chosenFilter) {
  chosenFilter.addEventListener('change', () => {
    const selectedFilter = chosenFilter.value;
    filterPosts(selectedFilter);
  });
}

// Function to filter posts based on the chosen filter
function filterPosts(chosenFilter) {
  thisPage = 1; 

  if (loadMoreBtn) {
    loadMoreBtn.style.display = 'block'; // Show "Load More" button
  }

  if (chosenFilter === 'all') {
    addBulmaCardStyling(allPosts.slice(0, amountOfPosts)); // Display the first 8 posts
  } else {
    const filterResults = allPosts.filter((post) => {
      if (chosenFilter === 'comments') {
        return post._count.comments > 0;
      } else if (chosenFilter === 'reactions') {
        return post._count.reactions > 0;
      }
    });

    if (filterResults.length === 0) {
      feedContent.innerHTML = 'No posts found.';

      if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none'; // Hide "Load More" button
      }
    } else {
      addBulmaCardStyling(filterResults.slice(0, amountOfPosts)); // Display the first 8 filtered posts
    }
  }
}

// Search posts based on search input
function searchPosts(query, posts) {
    const filterResults = posts.filter((post) => {
      const postTitle = post.title.toLowerCase();
      const postTags = post.tags.join(', ').toLowerCase();
      query = query.toLowerCase();
  
      return postTitle.includes(query) || postTags.includes(query);
    });
  
    thisPage = 1; // Reset the page to the first page
  
    // Instead of hiding the "Load More" button, just load the first 8 posts.
    addBulmaCardStyling(filterResults.slice(0, amountOfPosts));
  }
  


// Event listener for the search button
if (searchBtn) {
  searchBtn.addEventListener('click', async () => {
    const query = searchText.value;

    try {
      displayLoading(); // Display loading state...
      const content = await fetchPosts();
      searchPosts(query, content);
    } catch (error) {
      console.error('Error fetching or filtering posts:', error);
    }
  });
}

// Create a new post
export async function newPost(title, content) {
  try {
    const authenticationToken = localStorage.getItem('accessToken');
    const userInfoRequest = { title, body: content };

    const response = await fetch('https://api.noroff.dev/api/v1/social/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authenticationToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfoRequest),
    });

    if (response.ok) {
      const content = await response.json();
      console.log('Post created!', content);
    } else {
      throw new Error('Could not create post.');
    }
  } catch (error) {
    console.error('Post creation error', error);
  }
}

// Event listener for the create post form
if (newPostForm) {
  newPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const postTitle = document.getElementById('postTitle').value;
    const postContent = document.getElementById('postContent').value;

    await newPost(postTitle, postContent);
  });
}

// Export authenticationToken
export default localStorage.getItem('accessToken');