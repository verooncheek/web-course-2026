export function createPostController(model, view) {
  let debounceTimer = null;

  async function fetchAllPosts() {
    model.setIsLoading(true);
    view.showLoading(true);
    view.hideError();

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      model.setAllPosts(data);
      
      loadNextBatch();
    } catch (error) {
      view.showError(`Не удалось загрузить ленту постов. Проверьте подключение к интернету. (${error.message})`);
    } finally {
      model.setIsLoading(false);
      view.showLoading(false);
    }
  }

  function loadNextBatch() {
    if (model.getIsLoading() || !model.getHasMore()) return;

    model.setIsLoading(true);
    view.showLoading(true);

    setTimeout(() => {
      const all = model.getAllPosts();
      const pageSize = model.getPageSize();
      const currentPage = model.getCurrentPage();

      const startIndex = 0;
      const endIndex = currentPage * pageSize;
      const batch = all.slice(startIndex, endIndex);

      model.setDisplayedPosts(batch);
      
    
      applyFilter(model.getSearchQuery(), false);

      if (endIndex >= all.length) {
        model.setHasMore(false);
        view.showEndMessage(true);
      } else {
        model.incrementPage();
      }

      model.setIsLoading(false);
      view.showLoading(false);
    }, 400);
  }

  function applyFilter(query, resetPageIfNeeded = true) {
    const all = model.getAllPosts();
    const queryLower = query.toLowerCase().trim();

    model.setSearchQuery(queryLower);

    const filtered = all.filter(post => post.title.toLowerCase().includes(queryLower));
    
    const currentLimit = model.getCurrentPage() * model.getPageSize();
    const visibleFiltered = filtered.slice(0, queryLower ? filtered.length : currentLimit);

    view.renderPosts(visibleFiltered);

    if (queryLower) {
      view.showEndMessage(false);
    } else {
      view.showEndMessage(!model.getHasMore());
    }
  }

  function handleScroll() {
    if (model.getSearchQuery()) return;

    const scrollTotal = document.documentElement.scrollHeight;
    const scrollCurrent = window.innerHeight + window.scrollY;
    if (scrollTotal - scrollCurrent <= 200) {
      loadNextBatch();
    }
  }

  function handleSearchInput(e) {
    const val = e.target.value;
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      applyFilter(val);
    }, 300);
  }

  function init() {
    view.searchInput.addEventListener('input', handleSearchInput);
    view.retryBtn.addEventListener('click', fetchAllPosts);
    window.addEventListener('scroll', handleScroll);

    fetchAllPosts();
  }

  return { init };
}