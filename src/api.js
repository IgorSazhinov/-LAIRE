/**
 * api.js — API клиент для взаимодействия с сервером
 *
 * Содержит функции для отправки запросов к API эндпоинтам.
 * Все функции асинхронные и возвращают Promise.
 *
 * @module back.js
 */

/**
 * @typedef {Object} Category
 * @property {number} id Уникальный идентификатор категории
 * @property {string} name Название категории
 * @property {number} servicesCount Количество услуг в категории
 */

/**
 * @typedef {Object} Service
 * @property {number} id Уникальный идентификатор категории
 * @property {string} title Название услуги
 * @property {string} desc Описание услуги
 * @property {number} duration Продолжительность в минутах
 * @property {number} price Стоимость в рублях
 */

/**
 * Получить список всех категорий с сервера
 * @returns {Promise<Array<Category>} Promise с массивом категорий
 * @throws {Error} Если запрос не удался или сервер вернул ошибку
 * 
 * @example
 * const categories = await fetchCategories();
 * // Результат: [{ id: 1, name: "Стрижки и укладки", servicesCount: 5 }, ...]
 */
export async function fetchCategories() {
  try {
    // Отправляем GET запрос к эндпоинту /api/categories
    const response = await fetch("/api/categories");

    // Проверяем статус ответа, если не 2xx — выбрасываем ошибку
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Парсим JSON ответ и возвращаем данные наружу
    const result = await response.json();
    return result;

  } catch (error) {
    // Логируем ошибку
    console.error("Ошибка загрузки категорий:", error);
    throw error;
  }
}

/**
 * Получить список услуг по ID категории
 * @param {number} categoryId ID категории, для которой нужно получить услуги
 * @returns {Promise<Array<Service>>} Promise с массивом услуг
 * @throws {Error} Если запрос не удался или категория не найдена
 *
 * @example
 * const services = await fetchServicesByCategory(1);
 * // Результат: [{ id: 1, title: "Стрижка женская", price: 4500, ... }, ...]
 *
 * @see {@link fetchCategories} Для получения списка всех категорий
 */
export async function fetchServicesByCategory(categoryId) {
  try {
    // Формируем URL с подстановкой ID категории и отправляем запрос
    const response = await fetch(`/api/categories/${categoryId}/services`);

    // Проверяем статус ответа, если не 2xx — выбрасываем ошибку
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Парсим JSON ответ и возвращаем данные наружу
    const result = await response.json();
    return result;

  } catch (error) {
    // Логируем ошибку
    console.error("Ошибка загрузки услуг:", error);
    throw error;
  }
}
