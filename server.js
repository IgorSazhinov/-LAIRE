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

/**
 * Основная база данных приложения
 *
 * Содержит все категории и услуги салона красоты.
 * В реальном проекте данные хранились бы в настоящей БД,
 * а здесь используется для имитации.
 *
 * @constant {Object} database
 * @property {Array<Category>} categories - Массив категорий
 */
const database = {
  categories: [
    {
      id: 1,
      name: "Стрижки и укладки",
      services: [
        {
          id: 1,
          title: "Стрижка женская",
          desc: "Моделирование формы с учетом типа волос.",
          duration: 60,
          price: 4500,
        },
        {
          id: 2,
          title: "Укладка феном",
          desc: "Объемная укладка с фиксацией.",
          duration: 40,
          price: 2800,
        },
        {
          id: 3,
          title: "Кератиновое выпрямление",
          desc: "Восстановление и гладкость до 3 месяцев.",
          duration: 120,
          price: 8500,
        },
        {
          id: 4,
          title: "Стрижка мужская",
          desc: "Стильная мужская стрижка любой сложности.",
          duration: 40,
          price: 3200,
        },
        {
          id: 5,
          title: "Окрашивание тонирование",
          desc: "Мягкое тонирование без повреждения структуры.",
          duration: 90,
          price: 5800,
        },
      ],
    },
    {
      id: 2,
      name: "Маникюр и педикюр",
      services: [
        {
          id: 6,
          title: "Японский эстетический маникюр P.Shine",
          desc: "Идеальная чистота линий, сертифицированные премиум препараты.",
          duration: 50,
          price: 3200,
        },
        {
          id: 7,
          title: "Комбинированный маникюр с покрытием гель-лак Luxio",
          desc: "Идеальная чистота линий, сертифицированные премиум препараты.",
          duration: 60,
          price: 3800,
        },
        {
          id: 8,
          title: "Аппаратный премиум педикюр KART",
          desc: "Идеальная чистота линий, сертифицированные премиум препараты.",
          duration: 80,
          price: 5500,
        },
        {
          id: 9,
          title: "Укрепление ногтей и IBX-терапия",
          desc: "Идеальная чистота линий, сертифицированные премиум препараты.",
          duration: 30,
          price: 1800,
        },
        {
          id: 10,
          title: "Экспресс маникюр и педикюр в 4 руки",
          desc: "Идеальная чистота линий, сертифицированные премиум препараты.",
          duration: 90,
          price: 7800,
        },
      ],
    },
    {
      id: 3,
      name: "Брови и ресницы",
      services: [
        {
          id: 11,
          title: "Коррекция бровей воском",
          desc: "Четкая форма с учетом анатомии лица.",
          duration: 30,
          price: 1200,
        },
        {
          id: 12,
          title: "Окрашивание бровей хной",
          desc: "Стойкий цвет до 3 недель.",
          duration: 40,
          price: 1800,
        },
        {
          id: 13,
          title: "Ламинирование ресниц",
          desc: "Эффект распахнутого взгляда на 6-8 недель.",
          duration: 60,
          price: 3500,
        },
        {
          id: 14,
          title: "Ботокс для ресниц",
          desc: "Восстановление и укрепление ресниц.",
          duration: 45,
          price: 2800,
        },
      ],
    },
    {
      id: 4,
      name: "Спа-процедуры",
      services: [
        {
          id: 15,
          title: 'SPA-программа "Релакс"',
          desc: "Массаж лица и зоны декольте с аромамаслами.",
          duration: 90,
          price: 6500,
        },
        {
          id: 16,
          title: "Обертывание шоколадное",
          desc: "Питание и увлажнение кожи.",
          duration: 60,
          price: 4200,
        },
        {
          id: 17,
          title: "Пилинг тела с солями Мёртвого моря",
          desc: "Глубокое очищение и регенерация.",
          duration: 50,
          price: 3800,
        },
        {
          id: 18,
          title: "Массаж спины классический",
          desc: "Расслабляющий массаж для снятия напряжения.",
          duration: 60,
          price: 4500,
        },
      ],
    },
  ],
};

/**
 * Получить список всех категорий с количеством услуг
 *
 * @function getCategories
 * @returns {Array<{id: number, name: string, servicesCount: number}>}
 *          Массив категорий с ID, названием и количеством услуг
 *
 * @description
 * Трансформирует данные из базы в формат для API:
 * - Берет каждую категорию из database.categories
 * - Возвращает только нужные поля: id, name, servicesCount
 *
 * @example
 * const categories = getCategories();
 * // [
 * //   { id: 1, name: "Стрижки и укладки", servicesCount: 5 },
 * //   { id: 2, name: "Маникюр и педикюр", servicesCount: 5 }
 * // ]
 */
function getCategories() {
  return database.categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    servicesCount: cat.services.length,
  }));
}

/**
 * Получить список услуг по ID категории
 *
 * @function getServicesByCategory
 * @param {number} categoryId - ID категории
 * @returns {Array<{id: number, title: string, desc: string, duration: number, price: number}>}
 *          Массив услуг в категории
 * @throws {Error} Если категория с указанным ID не найдена
 *
 * @description
 * Ищет категорию по ID в базе данных и возвращает ее услуги.
 * Если категория не найдена, выбрасывает ошибку.
 *
 * @example
 * const services = getServicesByCategory(1);
 * // [
 * //   { id: 1, title: "Стрижка женская", duration: 60, price: 4500 },
 * //   { id: 2, title: "Укладка феном", duration: 40, price: 2800 }
 * // ]
 */
function getServicesByCategory(categoryId) {
  const category = database.categories.find((cat) => cat.id === categoryId);
  if (!category) {
    throw new Error(`Категория с ID ${categoryId} не найдена`);
  }
  return category.services;
}

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

        // Разрешаем кросс-доменные запросы для разработки
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
         *
         * @example
         * Response: [{ id: 1, name: "Стрижки и укладки", servicesCount: 5 }]
         */
        if (req.url === "/api/categories" || req.url === "/api/categories/") {
          try {
            const categories = getCategories();
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify(categories));
            console.log(`Отправлены категории: ${categories.length}`);
          } catch (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
          }
          return;
        }

        /**
         * GET /api/categories/{id}/services
         * Получить услуги по ID категории
         *
         * @example
         * Request: GET /api/categories/1/services
         * Response: [{ id: 1, title: "Стрижка женская", ... }]
         */
        const servicesMatch = req.url.match(
          /^\/api\/categories\/(\d+)\/services$/
        );
        if (servicesMatch) {
          const categoryId = parseInt(servicesMatch[1]);

          try {
            const services = getServicesByCategory(categoryId);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify(services));
            console.log(
              `Отправлены услуги для категории ${categoryId}: ${services.length}`
            );
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
