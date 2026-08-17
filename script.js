/**
 * script.js — Клиентская логика приложения ÉLAIRE
 *
 * Отвечает за:
 * - Загрузку данных с сервера через API клиент (api.js)
 * - Рендеринг категорий и услуг в DOM
 * - Обработку кликов по категориям
 * - Управление состоянием приложения
 * - Плавное обновление контента без перезагрузки страницы
 *
 * @module script
 * @requires api.js - API клиент (fetchCategories, fetchServicesByCategory)
 * @requires DOMContentLoaded - событие для старта приложения после загрузки HTML
 *
 * @see {@link api.js} Для работы с API
 * @see {@link index.html} Для структуры DOM
 */

/**
 * Событие DOMContentLoaded гарантирует, что HTML полностью загружен
 * перед выполнением скрипта, чтобы все элементы были доступны
 */
document.addEventListener("DOMContentLoaded", function () {
  /**
   * Ссылка на контейнер сайдбара
   * @type {HTMLElement}
   */
  const sidebar = document.querySelector(".sidebar");
  /**
   * Ссылка на контейнер для отображения услуг
   * @type {HTMLElement}
   */
  const servicesContainer = document.getElementById("servicesContainer");

  /**
   * Массив категорий, загруженных с сервера
   * @type {Array<{id: number, name: string, servicesCount: number}>}
   */
  let categories = [];
  /**
   * ID текущей выбранной категории
   * @type {number|null}
   */
  let currentCategoryId = null;

  /**
   * Отрисовывает список категорий в сайдбаре
   *
   * Удаляет все старые категории и создает новые на основе
   * данных из состояния `categories`. Активная категория
   * получает класс `active`.
   *
   * @function renderCategories
   * @param {number|null} activeCategoryId - ID категории, которая должна быть активной
   *
   * @description
   * Алгоритм работы:
   * 1. Находит заголовок "Категории" в сайдбаре
   * 2. Удаляет все существующие категории (с классом category-item)
   * 3. Для каждой категории из `categories` создает DOM элемент
   * 4. Если ID категории совпадает с activeCategoryId — добавляет класс active
   * 5. Вставляет категорию после заголовка
   * 6. Навешивает обработчики кликов на новые категории
   *
   * @example
   * // После загрузки данных
   * renderCategories(1); // Активная категория с ID 1
   */
  function renderCategories(activeCategoryId) {
    // Находим заголовок с кнопкой "Назад"
    const titleWithBack = sidebar.querySelector(".title-with-back");
    // Удаляем все старые категории (они прямые потомки sidebar)
    const oldCategories = sidebar.querySelectorAll(".category-item");
    oldCategories.forEach((item) => item.remove());

    // Создаем и вставляем новые категории
    categories.forEach((category) => {
      // Определяем, активна ли категория
      const isActive = category.id === activeCategoryId ? "active" : "";
      const count = category.servicesCount || 0;

      // Создаем DOM элемент категории
      const categoryDiv = document.createElement("div");
      categoryDiv.className = `category-item ${isActive}`;
      categoryDiv.dataset.id = category.id;
      categoryDiv.innerHTML = `
        <span class="cat-name">${category.name}</span>
        <div class="count-badge"><span>${count}</span></div>
      `;

      // Вставляем после заголовка (сохраняя порядок)
      titleWithBack.insertAdjacentElement("afterend", categoryDiv);
    });

    // Навешиваем обработчики на новые категории
    setupCategoryListeners();
  }

  /**
   * Отрисовывает список услуг в контейнере
   *
   * @function renderServices
   * @param {Array<{id: number, title: string, desc: string, duration: number, price: number}>} services
   *        Массив услуг для отображения
   *
   * @description
   * 1. Сохраняет текущую ширину контейнера (для предотвращения прыжков)
   * 2. Если услуг нет — показывает сообщение
   * 3. Если услуги есть — генерирует HTML и вставляет в контейнер
   * 4. Форматирует цену с пробелами (1 800 ₽ вместо 1800₽)
   * 5. Сбрасывает min-width после рендера
   *
   * @example
   * renderServices([
   *   { id: 1, title: "Стрижка", price: 4500, duration: 60 },
   *   { id: 2, title: "Укладка", price: 2800, duration: 40 }
   * ]);
   */
  function renderServices(services) {
    // Фиксируем ширину контейнера для предотвращения прыжков
    const currentWidth = servicesContainer.offsetWidth;
    if (currentWidth > 0) {
      servicesContainer.style.minWidth = currentWidth + "px";
    }

    // Если услуг нет — показываем сообщение
    if (!services || services.length === 0) {
      servicesContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #6B6661; font-size: 16px;">
          В этой категории пока нет услуг
        </div>
      `;
    } else {
      // Генерируем HTML для всех услуг
      let html = "";
      services.forEach((service) => {
        // Форматируем цену с пробелами (например: 4 500 ₽)
        const formattedPrice = service.price.toLocaleString("ru-RU") + " ₽";

        html += `
          <div class="service-row" data-service="${service.id}">
            <div class="info">
              <span class="title">${service.title}</span>
              <span class="desc">${service.desc}</span>
            </div>
            <div class="meta">
              <span class="duration">${service.duration} мин</span>
              <span class="price">${formattedPrice}</span>
              <button class="select-btn"><span>Выбрать</span></button>
            </div>
          </div>
        `;
      });

      servicesContainer.innerHTML = html;
    }

    // Сбрасываем min-width после рендера (через 50мс)
    setTimeout(() => {
      servicesContainer.style.minWidth = "";
    }, 50);
  }

  /**
   * Загружает услуги для выбранной категории с сервера
   *
   * @async
   * @function loadServices
   * @param {number} categoryId - ID категории, для которой нужно загрузить услуги
   *
   * @description
   * 1. Показывает индикатор загрузки в контейнере услуг
   * 2. Делает запрос к API через fetchServicesByCategory
   * 3. При успехе — обновляет текущую категорию и рендерит услуги
   * 4. При ошибке — показывает сообщение об ошибке
   *
   * @example
   * // Загрузить услуги для категории с ID 1
   * await loadServices(1);
   */
  async function loadServices(categoryId) {
    // Показываем индикатор загрузки
    servicesContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #6B6661; font-size: 16px;">
          Загрузка услуг...
        </div>
      `;

    try {
      // Запрашиваем услуги с сервера
      const services = await fetchServicesByCategory(categoryId);
      // Обновляем состояние и рендерим
      currentCategoryId = categoryId;
      renderServices(services);
    } catch (error) {
      // Обрабатываем ошибку
      console.error("Ошибка загрузки услуг:", error);
      servicesContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #e74c3c; font-size: 16px;">
          Ошибка загрузки услуг. Попробуйте обновить страницу.
        </div>
      `;
    }
  }

  /**
   * Навешивает обработчики кликов на все категории
   *
   * @function setupCategoryListeners
   * @description
   * Удаляет старые обработчики (чтобы избежать дублирования)
   * и добавляет новые. Использует отдельную функцию handleCategoryClick
   * для обработки клика.
   */
  function setupCategoryListeners() {
    const categoryItems = sidebar.querySelectorAll(".category-item");

    categoryItems.forEach((item) => {
      // Удаляем старый обработчик, чтобы не было дублирования
      item.removeEventListener("click", handleCategoryClick);
      // Добавляем новый
      item.addEventListener("click", handleCategoryClick);
    });
  }

  /**
   * Обработчик клика по категории
   *
   * @function handleCategoryClick
   * @this {HTMLElement} - DOM элемент категории, на которую кликнули
   *
   * @description
   * 1. Получает ID категории из data-атрибута
   * 2. Если категория уже активна — ничего не делает
   * 3. Убирает класс active у всех категорий
   * 4. Добавляет класс active кликнутой категории
   * 5. Загружает услуги для выбранной категории
   */
  function handleCategoryClick() {
    const categoryId = parseInt(this.dataset.id);

    // Если кликнули по уже активной категории — ничего не делаем
    if (categoryId === currentCategoryId) return;

    // Переключаем класс active
    const categoryItems = sidebar.querySelectorAll(".category-item");
    categoryItems.forEach((cat) => cat.classList.remove("active"));
    this.classList.add("active");

    // Загружаем услуги
    loadServices(categoryId);
  }

  /**
   * Загружает список всех категорий с сервера
   *
   * @async
   * @function loadCategories
   * @description
   * 1. Показывает индикатор загрузки
   * 2. Делает запрос к API через fetchCategories
   * 3. При успехе — сохраняет данные и рендерит категории
   * 4. Автоматически загружает услуги для первой категории
   * 5. При ошибке — показывает сообщение об ошибке
   *
   * @example
   * // Загрузить все категории
   * await loadCategories();
   * // После загрузки автоматически отобразятся услуги первой категории
   */
  async function loadCategories() {
    // Показываем индикатор загрузки
    servicesContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #6B6661; font-size: 16px;">
        Загрузка категорий...
      </div>
    `;

    try {
      // Запрашиваем категории с сервера
      const data = await fetchCategories();
      categories = data;

      // Определяем ID первой категории
      const firstCategoryId = categories[0]?.id || null;
      // Рендерим категории (первая будет активной)
      renderCategories(firstCategoryId);

      // Автоматически загружаем услуги для первой категории
      if (firstCategoryId) {
        loadServices(firstCategoryId);
      }
    } catch (error) {
      // Обрабатываем ошибку
      console.error("Ошибка загрузки категорий:", error);
      servicesContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #e74c3c; font-size: 16px;">
          Ошибка загрузки категорий. Попробуйте обновить страницу.
        </div>
      `;
    }
  }

  /**
   * Инициализирует приложение
   *
   * @function init
   * @description
   * Запускает процесс загрузки категорий. Все остальное
   * происходит автоматически в цепочке вызовов.
   */
  function init() {
    loadCategories();
  }

  /**
   * Запускаем приложение
   * @see {@link init}
   */
  init();
});
