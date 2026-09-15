import { useState, useEffect } from 'react';
import ServiceRow from './ServiceRow';
import { EmptyState, LoadingState } from './LoadingState';
import { fetchServicesByCategory } from '../api';

/**
 * Компонент списка услуг
 */
export default function ServicesList({ activeCategoryId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка услуг по категории
  async function loadServices(categoryId) {
  setLoading(true);
  setError(null);

    try {
      const data = await fetchServicesByCategory(categoryId);
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices(activeCategoryId);
  }, [activeCategoryId])

  if (loading) {
    return (
      <div className="rows">
        <LoadingState message="Загрузка услуг..." />
      </div>
    )
  }

  if (error) {
    const message = `Произошла ошибка ${error.message}`;

    return (
      <div className="rows">
        <EmptyState message={message} />
      </div>
    );
  }

  return (
    <div className="rows">
      {services.length === 0 ? (
        <EmptyState message="В этой категории пока нет услуг" />
      ) : (
        services.map((service) => (
          <ServiceRow key={service.id} service={service} />
        ))
      )}
    </div>
  );
}
