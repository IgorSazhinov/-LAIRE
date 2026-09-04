import ServiceRow from "./ServiceRow";
import { EmptyState } from "./LoadingState";

/**
 * Компонент списка услуг
 */
export default function ServicesList({ services }) {
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
