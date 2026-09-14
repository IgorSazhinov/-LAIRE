import ServiceRow from "./ServiceRow";
import { EmptyState, LoadingState } from "./LoadingState";

/**
 * Компонент списка услуг
 */
export default function ServicesList({ services, loading }) {
  return (
    <div className="rows">
      {loading ? (
          <LoadingState message="Загрузка услуг..." />
        ) : services.length === 0 ? (
          <EmptyState message="В этой категории пока нет услуг" />
        ) : (
          services.map((service) => (
            <ServiceRow key={service.id} service={service} />
          ))
        )}
    </div>
  );
}
