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
        <div
          key={category.id}
          className={`category-item ${
            category.id === currentCategoryId ? "active" : ""
          }`}
          data-id={category.id}
          onClick={() => onCategoryClick(category.id)}
        >
          <span className="cat-name">{category.name}</span>
          <div className="count-badge">
            <span>{category.servicesCount}</span>
          </div>
        </div>
      ))}
    </aside>
  );
}
