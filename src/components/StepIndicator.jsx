import React from "react";

/**
 * Компонент индикатора шагов
 */
export default function StepIndicator() {
    const steps = [
      { number: 1, label: 'Выбор услуги', active: true },
      { number: 2, label: 'Дата и время', active: false },
      { number: 3, label: 'Подтверждение', active: false },
    ];
  
    return (
      <div className="step-indicator">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="step">
              <div className={`circle ${!step.active ? 'empty' : ''}`}>
                <span>{step.number}</span>
              </div>
              <span className={`step-label ${!step.active ? 'light' : ''}`}>
                {step.label}
              </span>
              {index < steps.length - 1 && <div className="step-line"></div>}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }