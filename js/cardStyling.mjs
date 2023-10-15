/**
 * Posts styling from Bulma CSS framework
 */
export function addBulmaCardStyling(targetElement, posts) {
    targetElement.innerHTML = '';
  
    if (posts.length === 0) {
      targetElement.innerHTML = 'No posts found.';
    } else {
      posts.forEach((post) => {
        const card = document.createElement('div');
        card.className = 'column';
        card.innerHTML = `
        <div class="card">
          <div class="card-content has-text-centered">
            <p class="title is-4">${post.title}</p>
            <div class="content">${post.body}</div>
            ${post.author ? `<p class="mb-2 m-2 ownerColor">Published by: ${post.author.name}</p>` : ''}
            <p>Tags: ${post.tags.join(', ')}</p>
            ${post.media ? `
              <div class="media">
                <div class="media-content feed-img">
                  <img src="${post.media}" alt="Media">
                </div>
              </div>
            ` : ''}
            <div class="mt-4">
              <a href="post-detail.html?id=${post.id}" class="button is-primary is-outlined">View Details</a>
            </div>
            <section class="m-3">
            <div>
            <p>Comments: ${post._count.comments}</p>
            </div>
            <div>
            <p>Reactions: ${post._count.reactions}</p>
            </div>
            </section>
          </div>
        </div>
      `;
      targetElement.appendChild(card);
      });
    }
  }