import { addBulmaCardStyling } from './cardStyling.mjs';

/**
 * Variables
 */
let allPosts = [];
let thisPage = 1;
const amountOfPosts = 8;

/**
 * DOM elements to be used through their ID
 */
const feedContent = document.getElementById('feedContent');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const chosenFilter = document.getElementById('chosenFilter');
const searchBtn = document.getElementById('searchBtn');
const searchText = document.getElementById('searchText');
const newPostForm = document.getElementById('newPostForm');

/**
 * Loading state... to indicate that the posts are being gathered by the API
 */
function displayLoading() {
  feedContent.innerHTML = 'Loading...';
}

/**
 * Fetch posts from the API
 */
async function fetchPosts() {
  try {
    /**
     * Get access token from local storage
     */
    const authenticationToken = localStorage.getItem('accessToken');
    /**
     * Send a request to the API to get posts with authentication token from the request headers
     */
    const response = await fetch('https://api.noroff.dev/api/v1/social/posts/?_author=true', {
      headers: {
        'Authorization': `Bearer ${authenticationToken}`
      }
    });
    if (response.ok) {
    /**
     * If the request is good, load the posts into the DOM
     */
      const content = await response.json();
      return content;
    } else {
      throw new Error('Something went wrong while fetching posts');
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Load and show the next 8 posts
 */
function showMorePosts(button = null) {
  const postStart = (thisPage - 1) * amountOfPosts;
  let postEnd; 
  postEnd = postStart + amountOfPosts; 

  const postsToShow = allPosts.slice(postStart, postEnd);

 /**
  * Add new posts
  */
  addBulmaCardStyling(feedContent, postsToShow, true);
 /**
  * Now you can use postEnd in this scope
  */
  if (postEnd < allPosts.length) {
    thisPage++;
  } else if (button) {
   /**
    * Hide the Load More button
    */
    button.style.display = 'none';
  }
}

/**
 * Event listener for the Load More button
 */
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => showMorePosts(loadMoreBtn));
}

/**
 * Load the first posts when the page is loaded.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const content = await fetchPosts();
    allPosts = content;
    showMorePosts(loadMoreBtn);
  });
  

/**
 * Event listener for the filter dropdown
 */
if (chosenFilter) {
  chosenFilter.addEventListener('change', () => {
    const selectedFilter = chosenFilter.value;
    filterPosts(selectedFilter);
  });
}


/**
 * Function to filter posts based on the chosen filter
 */
function filterPosts(chosenFilter) {
    thisPage = 1;
  
    if (loadMoreBtn) {
      loadMoreBtn.style.display = 'block';
    }
  
    if (chosenFilter === 'all') {
      addBulmaCardStyling(feedContent, allPosts.slice(0, amountOfPosts));
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
          loadMoreBtn.style.display = 'none';
        }
      } else {
        addBulmaCardStyling(feedContent, filterResults);
      }
    }
  }
  
  


/**
 * Search posts based on search input
 */
function searchPosts(query, posts) {
    const filterResults = posts.filter((post) => {
      const postTitle = post.title.toLowerCase();
      const postTags = post.tags.join(', ').toLowerCase();
      query = query.toLowerCase();
  
      return postTitle.includes(query) || postTags.includes(query);
    });
  
    thisPage = 1;

    addBulmaCardStyling(feedContent, filterResults.slice(0, amountOfPosts));
  }
  
  

/**
 * Event listener for the search button
 */
if (searchBtn) {
  searchBtn.addEventListener('click', async () => {
    const query = searchText.value;

    try {
      /**
       * Display loading state...
       */
      displayLoading(); 
      const content = await fetchPosts();
      searchPosts(query, content);
    } catch (error) {
      console.error('Error fetching or filtering posts:', error);
    }
  });
}


/**
 * Create a new post
 */
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
      /**
       * Send to the profile page after creating a post
       */
      window.location.href = 'profile.html';
    } else {
      throw new Error('Could not create the new post.');
    }
  } catch (error) {
    console.error('Could not create the new post', error);
  }
}


/**
 * Event listener for the create post form
 */
if (newPostForm) {
  newPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const postTitle = document.getElementById('postTitle').value;
    const postContent = document.getElementById('postContent').value;

    await newPost(postTitle, postContent);
  });
}


/**
 * Export authenticationToken
 */
export default localStorage.getItem('accessToken');
