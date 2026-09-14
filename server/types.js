/**
 * @typedef {Object} Category Объект категории услуг
 * @property {number} id Уникальный идентификатор категории
 * @property {string} name Название категории
 * @property {number} servicesCount Количество услуг в категории
 */

/**
 * @typedef {Object} Service Объект услуги внутри категории
 * @property {number} id Уникальный идентификатор услуги
 * @property {string} title Название услуги
 * @property {string} desc Описание услуги
 * @property {number} duration Продолжительность в минутах
 * @property {number} price Стоимость в рублях
 */

export const Types = {};