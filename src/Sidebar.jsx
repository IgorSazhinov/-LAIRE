import CategoryItem from './CategoryItem'

/**
 * Компонент сайдбара со списком категорий
 */
export default function Sidebar({
  categories,
  currentCategoryId,
  onCategoryClick,
}) {
  return (
    <aside className="sidebar">
      <div className="title-with-back">
        <button className="back-button">←</button>
        <span className="categories-title">Категории</span>
      </div>
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isActive={category.id === currentCategoryId}
          onClick={() => onCategoryClick(category.id)}
        />
      ))}
    </aside>
  );
}
