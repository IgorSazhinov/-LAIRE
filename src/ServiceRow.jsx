/**
 * Компонент карточки услуги
 *
 * @param {Object} props
 * @param {Object} props.service - Данные услуги
 * @param {number} props.service.id - ID услуги
 * @param {string} props.service.title - Название услуги
 * @param {string} props.service.desc - Описание услуги
 * @param {number} props.service.duration - Продолжительность в минутах
 * @param {number} props.service.price - Стоимость в рублях
 */
export default function ServiceRow({ service }) {
  const formattedPrice = service.price.toLocaleString("ru-RU") + " ₽";

  return (
    <div className="service-row" data-service={service.id}>
      <div className="info">
        <span className="title">{service.title}</span>
        <span className="desc">{service.desc}</span>
      </div>
      <div className="meta">
        <span className="duration">{service.duration} мин</span>
        <span className="price">{formattedPrice}</span>
      </div>
      <button className="select-btn">
        <span>Выбрать</span>
      </button>
    </div>
  );
}
