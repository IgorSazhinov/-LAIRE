import { useState, useEffect } from 'react';
import {fetchCategories} from './api';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ServicesList from './components/ServicesList';
import StepIndicator from './components/StepIndicator';

function App() {
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Загрузка категорий с сервера
  async function loadCategories() {
    try {
      const data = await fetchCategories();
      setCategories(data);

      const firstCategoryId = data[0]?.id || null;
      if (firstCategoryId) {
        setActiveCategoryId(firstCategoryId);
        await loadServices(firstCategoryId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function handleCategoryClick(categoryId) {
    setActiveCategoryId(categoryId);
  };

  useEffect(() => {
    loadCategories();
  }, []);

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
          activeCategoryId={activeCategoryId}
          onCategoryClick={handleCategoryClick}
        />
        
        <section className="services-list">
          <StepIndicator />
          <ServicesList activeCategoryId={activeCategoryId} />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
export default App;