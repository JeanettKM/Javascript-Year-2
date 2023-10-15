import { addBulmaCardStyling } from './cardStyling.mjs';

/**
 * Variables
 */
let userPosts = [];

/**
 * DOM elements to be used through their ID
 */
const profileContent = document.getElementById('profileContent');

/**
 * Retrieve the user's email from local storage
 */
const userEmail = localStorage.getItem('userEmail');

/**
 * Show Loading state...
 */
function displayLoading() {
  profileContent.innerHTML = 'Loading...';
}

/**
 * Fetch posts from the API for the logged-in user
 */
async function fetchUserPosts() {
  try {
    const authenticationToken = localStorage.getItem('accessToken');
    const response = await fetch('https://api.noroff.dev/api/v1/social/posts/?_author=true', {
      headers: {
        'Authorization': `Bearer ${authenticationToken}`,
      },
    });
    if (response.ok) {
      const content = await response.json();
      return content.filter(post => post.author.email === userEmail);
    } else {
      throw new Error('Failed to fetch user posts');
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Show user posts as cards, styled using Bulma CSS framework
 */
function showUserPosts() {
  addBulmaCardStyling(profileContent, userPosts);
}

/**
 * Load the user's posts when the page is loaded.
 */
document.addEventListener('DOMContentLoaded', async () => {
  const content = await fetchUserPosts();
  userPosts = content;
  showUserPosts();
});
