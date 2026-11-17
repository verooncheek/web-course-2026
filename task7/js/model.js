export function createPostModel() {
  let allPosts = [];
  let displayedPosts = [];
  let currentPage = 1;
  const pageSize = 10;
  let isLoading = false;
  let hasMore = true;
  let currentSearchQuery = '';

  return {
    getAllPosts: () => allPosts,
    setAllPosts: (posts) => { allPosts = posts; },
    getDisplayedPosts: () => displayedPosts,
    setDisplayedPosts: (posts) => { displayedPosts = posts; },
    getCurrentPage: () => currentPage,
    incrementPage: () => { currentPage += 1; },
    getPageSize: () => pageSize,
    getIsLoading: () => isLoading,
    setIsLoading: (val) => { isLoading = val; },
    getHasMore: () => hasMore,
    setHasMore: (val) => { hasMore = val; },
    getSearchQuery: () => currentSearchQuery,
    setSearchQuery: (query) => { currentSearchQuery = query; }
  };
}