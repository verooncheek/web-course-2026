export function createPostModel() {
  const N_PER_FETCH = 10;
  const loadedPosts = [];
  let startIndex = 0;
  let isLoading = false;
  let hasMore = true;
  let hasError = false;
  let searchQuery = '';

  return {
    getPerFetch: () => N_PER_FETCH,

    getLoadedPosts: () => loadedPosts,
    appendPosts: (posts) => {
      loadedPosts.push(...posts);
      startIndex += posts.length;
    },
    getStartIndex: () => startIndex,

    getIsLoading: () => isLoading,
    setIsLoading: (value) => {
      isLoading = Boolean(value);
    },

    getHasMore: () => hasMore,
    setHasMore: (value) => {
      hasMore = Boolean(value);
    },

    getHasError: () => hasError,
    setHasError: (value) => {
      hasError = Boolean(value);
    },

    getSearchQuery: () => searchQuery,
    setSearchQuery: (query) => {
      searchQuery = query;
    }
  };
}