/**
 * Компонент карточки категории
 *
 * @param {Object} props
 * @param {Object} props.category - Данные категории { id, name, servicesCount }
 * @param {number} props.category.id - ID категории
 * @param {string} props.category.name - Название категории
 * @param {number} props.category.servicesCount - Количество услуг
 * @param {boolean} props.isActive - Активна ли категория
 * @param {function} props.onClick - Обработчик клика по категории
 *
 * @example
 * <CategoryItem
 *   category={category}
 *   isActive={category.id === currentCategoryId}
 *   onClick={() => handleCategoryClick(category.id)}
 * />
 */
export default function CategoryItem({ category, isActive, onClick }) {
  return (
    <div
      className={`category-item ${isActive ? "active" : ""}`}
      data-id={category.id}
      onClick={onClick}
    >
      <span className="cat-name">{category.name}</span>
      <div className="count-badge">
        <span>{category.servicesCount}</span>
      </div>
    </div>
  );
}
