const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
const SCROLL_OFFSET = 200;
const SEARCH_DEBOUNCE_MS = 300;

export function createPostController(model, view) {
  let debounceTimer = null;

  function renderFilteredPosts() {
    const query = model.getSearchQuery().trim().toLowerCase();
    const loadedPosts = model.getLoadedPosts();

    const filtered = query
      ? loadedPosts.filter(post => post.title.toLowerCase().includes(query))
      : loadedPosts;

    view.renderPosts(filtered);
    view.showEndMessage(!model.getHasMore() && !query);
  }

  async function requestPosts() {
    const start = model.getStartIndex();
    const limit = model.getPerFetch();
    const response = await fetch(`${POSTS_URL}?_start=${start}&_limit=${limit}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText || 'Ошибка сервера'}`);
    }
    return response.json();
  }

  async function fetchNextBatch() {
    if (model.getIsLoading() || !model.getHasMore()) return;

    model.setIsLoading(true);
    model.setHasError(false);
    view.showLoading(true);
    view.hideError();

    try {
      const posts = await requestPosts();

      model.appendPosts(posts);
      if (posts.length < model.getPerFetch()) {
        model.setHasMore(false);
      }
      renderFilteredPosts();
    } catch (error) {
      model.setHasError(true);
      view.showError(`Не удалось загрузить посты: ${error.message}`);
    } finally {
      model.setIsLoading(false);
      view.showLoading(false);
    }

    if (!model.getSearchQuery().trim()) {
      loadMoreIfNeeded();
    }
  }

  function loadMoreIfNeeded() {
    if (model.getIsLoading() || !model.getHasMore() || model.getHasError()) return;

    if (view.isNearBottom(SCROLL_OFFSET)) {
      fetchNextBatch();
    }
  }

  function handleSearchInput(value) {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      model.setSearchQuery(value);
      renderFilteredPosts();
    }, SEARCH_DEBOUNCE_MS);
  }

  function init() {
    view.onSearchInput(handleSearchInput);
    view.onRetry(fetchNextBatch);
    view.onScroll(loadMoreIfNeeded);

    fetchNextBatch();
  }

  return { init };
}