import ServiceRow from "./ServiceRow";
import StepIndicator from "./StepIndicator";
import { LoadingState, EmptyState } from "./LoadingState";

/**
 * Компонент списка услуг
 */
export default function ServicesList({ services, loading }) {
  return (
    <section className="services-list">
      <StepIndicator />
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
    </section>
  );
}
