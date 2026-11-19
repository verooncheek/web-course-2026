export function createPostView() {
  const postsContainer = document.getElementById('postsContainer');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const errorContainer = document.getElementById('errorContainer');
  const errorMessage = document.getElementById('errorMessage');
  const endMessage = document.getElementById('endMessage');
  const searchInput = document.getElementById('searchInput');
  const retryBtn = document.getElementById('retryBtn');

  function createTextElement(tag, className, text) {
    const el = document.createElement(tag);
    el.className = className;
    el.textContent = text;
    return el;
  }

  function createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'post-card';

    const header = document.createElement('div');
    header.className = 'post-header';
    header.append(
      createTextElement('span', 'post-id', `#${post.id}`),
      createTextElement('span', 'author-badge', `Автор: ${post.userId}`)
    );

    card.append(
      header,
      createTextElement('h3', 'post-title', post.title),
      createTextElement('p', 'post-body', post.body)
    );
    return card;
  }

  function renderPosts(posts) {
    postsContainer.replaceChildren();

    if (posts.length === 0) {
      postsContainer.append(
        createTextElement('div', 'end-message', 'Постов по вашему запросу не найдено.')
      );
      return;
    }

    const fragment = document.createDocumentFragment();
    posts.forEach(post => fragment.append(createPostCard(post)));
    postsContainer.append(fragment);
  }

  function showLoading(show) {
    loadingIndicator.classList.toggle('hidden', !show);
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorContainer.classList.remove('hidden');
  }

  function hideError() {
    errorContainer.classList.add('hidden');
  }

  function showEndMessage(show) {
    endMessage.classList.toggle('hidden', !show);
  }

  function isNearBottom(offset) {
    const scrollBottom = window.innerHeight + window.scrollY;
    return scrollBottom >= document.documentElement.scrollHeight - offset;
  }

  function onSearchInput(handler) {
    searchInput.addEventListener('input', event => handler(event.target.value));
  }

  function onRetry(handler) {
    retryBtn.addEventListener('click', handler);
  }

  function onScroll(handler) {
    window.addEventListener('scroll', handler);
  }

  return {
    renderPosts,
    showLoading,
    showError,
    hideError,
    showEndMessage,
    isNearBottom,
    onSearchInput,
    onRetry,
    onScroll
  };
}