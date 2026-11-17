export function createPostView() {
  const postsContainer = document.getElementById('postsContainer');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');
  const endMessage = document.getElementById('endMessage');
  const searchInput = document.getElementById('searchInput');
  const retryBtn = document.getElementById('retryBtn');

  function renderPosts(posts) {
    postsContainer.innerHTML = '';
    if (posts.length === 0) {
      postsContainer.innerHTML = '<div class="end-message">Постов по вашему запросу не найдено.</div>';
      return;
    }

    const fragment = document.createDocumentFragment();
    posts.forEach(post => {
      const card = document.createElement('article');
      card.className = 'post-card';
      card.innerHTML = `
        <div class="post-header">
          <span class="post-id">#${post.id}</span>
          <span class="author-badge">Автор: ${post.userId}</span>
        </div>
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <p class="post-body">${escapeHtml(post.body)}</p>
      `;
      fragment.appendChild(card);
    });
    postsContainer.appendChild(fragment);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showLoading(show) {
    if (show) {
      loadingIndicator.classList.remove('hidden');
    } else {
      loadingIndicator.classList.add('hidden');
    }
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorContainer.classList.remove('hidden');
  }

  function hideError() {
    errorContainer.classList.add('hidden');
  }

  function showEndMessage(show) {
    if (show) {
      endMessage.classList.remove('hidden');
    } else {
      endMessage.classList.add('hidden');
    }
  }

  return {
    renderPosts,
    showLoading,
    showError,
    hideError,
    showEndMessage,
    searchInput,
    retryBtn
  };
}