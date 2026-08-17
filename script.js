document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const servicesContainer = document.getElementById("servicesContainer");
  let servicesData = [];

  function renderCategories() {
    const titleWithBack = sidebar.querySelector(".title-with-back");

    servicesData.forEach((category, index) => {
      const isActive = index === 0 ? "active" : "";
      const count = category.services.length;

      const categoryDiv = document.createElement("div");
      categoryDiv.className = `category-item ${isActive}`;
      categoryDiv.dataset.index = index;
      categoryDiv.innerHTML = `
          <span class="cat-name">${category.name}</span>
          <div class="count-badge"><span>${count}</span></div>
        `;

      if (titleWithBack) {
        titleWithBack.insertAdjacentElement("afterend", categoryDiv);
      } else {
        sidebar.appendChild(categoryDiv);
      }
    });
  }

  function renderServices(categoryIndex) {
    const category = servicesData[categoryIndex];

    if (!category || !category.services || category.services.length === 0) {
      servicesContainer.innerHTML = `
          <div style="text-align: center; padding: 40px; color: #6B6661; font-size: 16px;">
            В этой категории пока нет услуг
          </div>
        `;
      return;
    }

    let html = "";
    category.services.forEach((service) => {
      const formattedPrice = service.price.toLocaleString("ru-RU") + " ₽";

      html += `
          <div class="service-row" data-service="${service.id}">
            <div class="info">
              <span class="title">${service.title}</span>
              <span class="desc">${service.desc}</span>
            </div>
            <div class="meta">
              <span class="duration">${service.duration} мин</span>
              <span class="price">${formattedPrice}</span>
            </div>
            <button class="select-btn"><span>Выбрать</span></button>
          </div>
        `;
    });

    servicesContainer.innerHTML = html;
  }

  function setupCategoryListeners() {
    const categoryItems = sidebar.querySelectorAll(".category-item");

    categoryItems.forEach((item) => {
      item.addEventListener("click", function () {
        categoryItems.forEach((cat) => cat.classList.remove("active"));
        this.classList.add("active");
        const index = parseInt(this.dataset.index);
        renderServices(index);
      });
    });
  }

  function loadData() {
    // Показываем индикатор загрузки
    servicesContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #6B6661; font-size: 16px;">
            Загрузка услуг...
        </div>
    `;

    fetchServicesData()
      .then((data) => {
        servicesData = data;

        renderCategories();
        renderServices(0);
        setupCategoryListeners();

        console.log("Данные загружены с сервера");
        console.log("Получено категорий:", servicesData.length);
      })
      .catch((error) => {
        console.error("Ошибка загрузки данных:", error);
        servicesContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #e74c3c; font-size: 16px;">
                    Ошибка загрузки данных. Попробуйте обновить страницу.
                </div>
            `;
      });
  }

  // ===== 5. ИНИЦИАЛИЗАЦИЯ =====
  function init() {
    loadData();
  }
  init();
});
