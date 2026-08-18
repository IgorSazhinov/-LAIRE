import React, { useState, useEffect } from "react";
import { fetchCategories, fetchServicesByCategory } from "../api";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ServicesList from "./ServicesList";
import Footer from "./Footer";

function App() {
  const [categories, setCategories] = useState([]);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка категорий при монтировании
  useEffect(() => {
    loadCategories();
  }, []);

  // Загрузка категорий с сервера
  async function loadCategories() {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCategories();
      setCategories(data);

      const firstCategoryId = data[0]?.id || null;
      if (firstCategoryId) {
        setCurrentCategoryId(firstCategoryId);
        await loadServices(firstCategoryId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Загрузка услуг по категории
  async function loadServices(categoryId) {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchServicesByCategory(categoryId);
      setServices(data);
      setCurrentCategoryId(categoryId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Обработчик клика по категории
  function handleCategoryClick(categoryId) {
    if (categoryId === currentCategoryId) return;
    loadServices(categoryId);
  }

  // Если загрузка и нет данных
  if (loading && categories.length === 0) {
    return (
      <div className="page">
        <Header />
        <div style={{ textAlign: "center", padding: "40px", flex: 1 }}>
          Загрузка...
        </div>
        <Footer />
      </div>
    );
  }

  // Если ошибка
  if (error && categories.length === 0) {
    return (
      <div className="page">
        <Header />
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#e74c3c",
            flex: 1,
          }}
        >
          Ошибка: {error}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page">
      <Header />
      <main className="main-booking-flow">
        <Sidebar
          categories={categories}
          currentCategoryId={currentCategoryId}
          onCategoryClick={handleCategoryClick}
        />
        <ServicesList services={services} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}

export default App;