/**
 * api.js — API клиент для взаимодействия с сервером
 *
 * Содержит функции для отправки запросов к API эндпоинтам.
 * Все функции асинхронные и возвращают Promise.
 *
 * @module back.js
 */

/**
 * Получить список всех категорий с сервера
 *
 * Отправляет GET запрос на /api/categories
 *
 * @async
 * @function fetchCategories
 * @returns {Promise<Array>} Promise с массивом категорий
 * @returns {Promise<Array>} Каждый объект категории содержит:
 *   @property {number} id - Уникальный идентификатор категории
 *   @property {string} name - Название категории
 *   @property {number} servicesCount - Количество услуг в категории
 *
 * @example
 * // Получение списка категорий
 * const categories = await fetchCategories();
 * // Результат: [{ id: 1, name: "Стрижки и укладки", servicesCount: 5 }, ...]
 *
 * @throws {Error} Если запрос не удался или сервер вернул ошибку
 *
 * @description
 * Функция выполняет следующие шаги:
 * 1. Отправляет GET запрос к эндпоинту /api/categories
 * 2. Проверяет статус ответа (если не 2xx — выбрасывает ошибку)
 * 3. Парсит JSON ответ и возвращает данные
 * 4. В случае ошибки логирует её в консоль и пробрасывает дальше
 */
export async function fetchCategories() {
  try {
    const response = await fetch("/api/categories");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка загрузки категорий:", error);
    throw error;
  }
}

/**
 * Получить список услуг по ID категории
 *
 * Отправляет GET запрос на /api/categories/{categoryId}/services
 *
 * @async
 * @function fetchServicesByCategory
 * @param {number} categoryId - ID категории, для которой нужно получить услуги
 * @returns {Promise<Array>} Promise с массивом услуг
 * @returns {Promise<Array>} Каждый объект услуги содержит:
 *   @property {number} id - Уникальный идентификатор услуги
 *   @property {string} title - Название услуги
 *   @property {string} desc - Описание услуги
 *   @property {number} duration - Продолжительность в минутах
 *   @property {number} price - Стоимость услуги в рублях
 *
 * @example
 * // Получение услуг для категории с ID 1
 * const services = await fetchServicesByCategory(1);
 * // Результат: [{ id: 1, title: "Стрижка женская", price: 4500, ... }, ...]
 *
 * @throws {Error} Если запрос не удался или категория не найдена
 *
 * @description
 * Функция выполняет следующие шаги:
 * 1. Формирует URL с подстановкой ID категории
 * 2. Отправляет GET запрос к эндпоинту
 * 3. Проверяет статус ответа (если не 2xx — выбрасывает ошибку)
 * 4. Парсит JSON ответ и возвращает данные
 * 5. В случае ошибки логирует её в консоль и пробрасывает дальше
 *
 * @see {@link fetchCategories} Для получения списка всех категорий
 */
export async function fetchServicesByCategory(categoryId) {
  try {
    const response = await fetch(`/api/categories/${categoryId}/services`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка загрузки услуг:", error);
    throw error;
  }
}
