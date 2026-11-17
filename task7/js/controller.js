const TOPICS = [
  'Асинхронный JavaScript: как работают Promise и async/await',
  'Архитектура MVC во фронтенде без фреймворков и классов',
  'Оптимизация рендеринга DOM через DocumentFragment',
  'Дебаунс и троттлинг: защищаем интерфейс от лишних вызовов',
  'Проектирование REST API на Python и Django',
  'Бесконечный скролл: сравнение scroll-событий и IntersectionObserver',
  'Обработка сетевых ошибок при работе с Fetch API',
  'Современный CSS: Glassmorphism, градиенты и плавные анимации',
  'Чистый код: декомпозиция на модули и именованные функции',
  'Безопасность веб-приложений: защита от XSS при вставке HTML',
];

const DETAILS = [
  'Разбираем на практике, как управлять состоянием загрузки, корректно перехватывать исключения в блоках try/catch и показывать пользователю понятный статус ответа сервера.',
  'Чёткое разделение данных, представления и логики упрощает поддержку кода и позволяет легко масштабировать даже небольшие учебные веб-приложения.',
  'Вместо перерисовки всего дерева элементов на каждую карточку мы собираем фрагмент в памяти и добавляем порцию постов в DOM за одну операцию.',
  'Задержка в 300 миллисекунд перед запуском фильтрации избавляет браузер от лишних перерисовок при быстром наборе текста в строке поиска.',
  'Показываем, как пагинация через параметры _start и _limit позволяет подгружать данные с сервера небольшими порциями по мере прокрутки страницы.',
];

function localizePost(rawPost) {
  const topicIndex = (rawPost.id - 1) % TOPICS.length;
  const detailIndex = (rawPost.id + rawPost.userId) % DETAILS.length;
  const batchNumber = Math.ceil(rawPost.id / TOPICS.length);

  return {
    id: rawPost.id,
    userId: rawPost.userId,
    title: `${TOPICS[topicIndex]} (выпуск №${batchNumber})`,
    body: `${DETAILS[detailIndex]} Данные получены с сервера JSONPlaceholder для записи #${rawPost.id} пользователя ${rawPost.userId}.`,
  };
}

export function createPostController(model, view) {
  let debounceTimer = null;

  function renderFilteredPosts() {
    const query = model.getSearchQuery().trim().toLowerCase();
    const loadedPosts = model.getLoadedPosts();

    const filtered = query
      ? loadedPosts.filter((post) => post.title.toLowerCase().includes(query))
      : loadedPosts;

    view.renderPosts(filtered, Boolean(query));
    view.showEndMessage(!model.getHasMore() && !query);
  }

  async function fetchNextBatch() {
    if (model.getIsLoading() || !model.getHasMore()) return;

    model.setIsLoading(true);
    view.showLoading(true);
    view.hideError();

    const start = model.getStartIndex();
    const limit = model.getPerFetch();
    const url = `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText || 'Ошибка сервера'}`);
      }

      const rawPosts = await response.json();
      const localizedPosts = rawPosts.map(localizePost);

      model.appendPosts(localizedPosts);

      if (rawPosts.length < limit) {
        model.setHasMore(false);
      }

      renderFilteredPosts();
    } catch (error) {
      view.showError(`Не удалось загрузить посты: ${error.message}`);
    } finally {
      model.setIsLoading(false);
      view.showLoading(false);
    }
  }

  function handleScroll() {
    if (model.getIsLoading() || !model.getHasMore()) return;

    const scrollBottom = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.scrollHeight - 200;

    if (scrollBottom >= threshold) {
      fetchNextBatch();
    }
  }

  function handleSearchInput(event) {
    const value = event.target.value;
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      model.setSearchQuery(value);
      renderFilteredPosts();
    }, 300);
  }

  function init() {
    view.searchInput.addEventListener('input', handleSearchInput);
    view.retryBtn.addEventListener('click', fetchNextBatch);
    window.addEventListener('scroll', handleScroll);

    fetchNextBatch();
  }

  return { init };
}