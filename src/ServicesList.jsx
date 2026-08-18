export default function ServicesList({ services, loading }) {
  return (
    <section className="services-list">
      <div className="step-indicator">
        <div className="step">
          <div className="circle">
            <span>1</span>
          </div>
          <span className="step-label">Выбор услуги</span>
          <div className="step-line"></div>
        </div>
        <div className="step">
          <div className="circle empty">
            <span>2</span>
          </div>
          <span className="step-label light">Дата и время</span>
          <div className="step-line"></div>
        </div>
        <div className="step">
          <div className="circle empty">
            <span>3</span>
          </div>
          <span className="step-label light">Подтверждение</span>
        </div>
      </div>

      <div className="rows">
        {loading ? (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#6B6661" }}
          >
            Загрузка услуг...
          </div>
        ) : services.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "40px", color: "#6B6661" }}
          >
            В этой категории пока нет услуг
          </div>
        ) : (
          services.map((service) => {
            const formattedPrice = service.price.toLocaleString("ru-RU") + " ₽";
            return (
              <div
                key={service.id}
                className="service-row"
                data-service={service.id}
              >
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
          })
        )}
      </div>
    </section>
  );
}
