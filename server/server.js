/**
 * server.js — Серверный API для Vite с имитацией бэкенда
 *
 * Этот файл создает API middleware для Vite сервера,
 * который обрабатывает запросы к эндпоинтам /api/*
 *
 * @module server
 * @requires vite
 *
 * @example
 * // В vite.config.js:
 * import apiMiddleware from './server.js';
 * export default defineConfig({
 *   plugins: [apiMiddleware()]
 * });
 */

import * as Types from './types.js';
import { database } from './database.js';

/**
 * Создает Vite плагин для обработки API запросов
 *
 * @function apiMiddleware
 * @returns {Object} Vite плагин с middleware для API
 *
 * @description
 * Плагин для Vite сервера, который перехватывает запросы к /api/*
 * и обрабатывает их как API эндпоинты.
 *
 * Поддерживаемые эндпоинты:
 * - GET /api/categories - получить все категории
 * - GET /api/categories/{id}/services - получить услуги категории
 *
 * Ответы приходят в формате JSON с CORS заголовками.
 *
 * @example
 * // Запрос всех категорий
 * fetch('/api/categories')
 *   .then(res => res.json())
 *   .then(data => console.log(data));
 *
 * @example
 * // Запрос услуг категории 1
 * fetch('/api/categories/1/services')
 *   .then(res => res.json())
 *   .then(data => console.log(data));
 */
export default function apiMiddleware() {
  return {
    name: "api-middleware",
    configureServer(server) {
      console.log("API Middleware загружен");

      /**
       * Обработчик всех запросов к серверу
       *
       * Проверяет URL запроса, и если он начинается с /api/,
       * обрабатывает его как API запрос. Иначе пропускает
       * для обычной обработки Vite.
       */
      server.middlewares.use((req, res, next) => {
        // Пропускаем запросы, не относящиеся к API
        if (!req.url.startsWith("/api/")) {
          return next();
        }

        // Разрешаем кросс-доменные запросы, иначе браузер не даст сделать запрос к серверу
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, OPTIONS"
        );
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Обработка preflight запросов (OPTIONS)
        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          res.end();
          return;
        }

        /**
         * GET /api/categories
         * Получить список всех категорий
         */
        if (req.url === "/api/categories" || req.url === "/api/categories/") {
          try {
            const categories = getCategories();
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify(categories));
            console.log(`Отправлены категории: ${categories.length}`);
          } catch (error) {
            // Какая-то внутренняя ошибка сервера
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
          }
          return;
        }

        /**
         * GET /api/categories/{id}/services
         * Получить услуги по ID категории
         */
        const servicesMatch = req.url.match(
          /^\/api\/categories\/(\d+)\/services$/
        );
        if (servicesMatch) {
          const categoryId = parseInt(servicesMatch[1]);

          try {
            const services = getServicesByCategory(categoryId);
            // имитация задержки получения данных по услугам
            setTimeout(() => {
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 200;
              res.end(JSON.stringify(services));
              console.log(
                `Отправлены услуги для категории ${categoryId}: ${services.length}`
              );
            }, 1000);
          } catch (error) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: error.message }));
          }
          return;
        }

        // Если URL не соответствует ни одному эндпоинту
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({ error: `API endpoint not found: ${req.url}` })
        );
      });
    },
  };
}

/**
 * Получить список всех категорий с количеством услуг
 * @returns {Array<Types.Category>} Массив категорий услуг
 */
function getCategories() {
  return database.categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    servicesCount: cat.services.length, // Вычисляемое поле
  }));
}

/**
 * Получить список услуг по ID категории
 *
 * @param {number} categoryId - ID категории
 * @returns {Array<Types.Service>} Массив услуг в категории
 * @throws {Error} Если категория с указанным ID не найдена
 */
function getServicesByCategory(categoryId) {
  const category = database.categories.find((cat) => cat.id === categoryId);
  if (!category) {
    throw new Error(`Категория с ID ${categoryId} не найдена`);
  }
  return category.services;
}
