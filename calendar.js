/**
 * Данные для страницы выбора даты и времени.
 * TODO: Позже эти данные будут приходить с backend.
 */
 const BOOKING_DATA = {
  // Текущий отображаемый месяц (0 = январь)
  currentMonth: 9, // октябрь
  currentYear: 2026,
  // Выбранная дата
  selectedDate: {
    day: 17,
    month: 9,
    year: 2026,
  },
  // Выбранное время
  selectedTime: "12:00",
  // Доступные слоты времени
  timeSlots: [
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: false },
    { time: "11:30", available: true },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: false },
    { time: "17:30", available: true },
    { time: "18:00", available: true },
    { time: "19:30", available: true },
  ],
};

/**
 * Названия месяцев в родительном падеже (для отображения в календаре).
 */
const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

/**
 * Названия месяцев в именительном падеже (для заголовка календаря).
 */
const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

/**
 * Названия дней недели для отображения в нижней панели.
 */
const DAYS_OF_WEEK = [
  "Воскресенье", "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота",
];

/**
 * Отрисовывает календарь на текущий месяц.
 * Учитывает выбранную дату и сегодняшний день.
 */
function renderCalendar() {
  const monthYearEl = document.querySelector(".month-year");
  const calendarGrid = document.querySelector(".grid-days");

  const year = BOOKING_DATA.currentYear;
  const month = BOOKING_DATA.currentMonth;

  // Заголовок
  monthYearEl.textContent = `${MONTHS_NOMINATIVE[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = воскресенье
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // сдвиг для понедельника

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const today = new Date();
  const days = [];

  // Дни предыдущего месяца
  for (let i = offset - 1; i >= 0; i--) {
    days.push({ day: prevMonthLastDay - i, otherMonth: true });
  }

  // Дни текущего месяца
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, otherMonth: false });
  }

  // Дни следующего месяца (добиваем до полной недели)
  const totalCells = Math.ceil(days.length / 7) * 7;
  while (days.length < totalCells) {
    const nextDay = days.length - daysInMonth - offset + 1;
    days.push({ day: nextDay, otherMonth: true });
  }

  // Строим HTML
  let html = "";
  for (let i = 0; i < days.length; i += 7) {
    html += '<div class="week-row">';
    for (let j = i; j < i + 7 && j < days.length; j++) {
      const d = days[j];
      let classes = "day-cell";

      if (d.otherMonth) classes += " other-month";

      const isToday =
        !d.otherMonth &&
        d.day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      if (isToday) classes += " today";

      const isSelected =
        !d.otherMonth &&
        d.day === BOOKING_DATA.selectedDate.day &&
        month === BOOKING_DATA.selectedDate.month &&
        year === BOOKING_DATA.selectedDate.year;
      if (isSelected) classes += " selected";

      html += `<div class="${classes}" data-day="${d.day}" data-month="${month}" data-year="${year}" data-other="${d.otherMonth}">${d.day}</div>`;
    }
    html += "</div>";
  }

  calendarGrid.innerHTML = html;

  // Обработчики на дни
  const dayCells = calendarGrid.querySelectorAll(".day-cell:not(.other-month)");
  dayCells.forEach((cell) => {
    cell.addEventListener("click", onDayClick);
  });
}

/**
 * Обработчик клика по дню в календаре.
 */
function onDayClick(event) {
  const cell = event.currentTarget;
  const day = parseInt(cell.dataset.day);
  const month = parseInt(cell.dataset.month);
  const year = parseInt(cell.dataset.year);

  BOOKING_DATA.selectedDate = { day, month, year };

  renderCalendar();
  updateBottomBar();
}

/**
 * Отрисовывает сетку доступного времени.
 */
function renderTimeSlots() {
  const timeGrid = document.querySelector(".time-grid");

  let html = "";
  BOOKING_DATA.timeSlots.forEach((slot) => {
    let classes = "time-slot";
    if (!slot.available) classes += " unavailable";
    if (slot.time === BOOKING_DATA.selectedTime && slot.available) {
      classes += " selected";
    }
    html += `<button class="${classes}" data-time="${slot.time}" ${!slot.available ? "disabled" : ""}>${slot.time}</button>`;
  });

  timeGrid.innerHTML = html;

  // Обработчики на доступные слоты
  const slots = timeGrid.querySelectorAll(".time-slot:not(.unavailable)");
  slots.forEach((slot) => {
    slot.addEventListener("click", onTimeSlotClick);
  });
}

/**
 * Обработчик клика по слоту времени.
 */
function onTimeSlotClick(event) {
  const slot = event.currentTarget;
  const time = slot.dataset.time;

  BOOKING_DATA.selectedTime = time;

  renderTimeSlots();
  updateBottomBar();
}

/**
 * Обновляет нижнюю панель с выбранной датой и временем.
 */
function updateBottomBar() {
  const valueEl = document.querySelector(".bottom-bar .value");

  const { day, month, year } = BOOKING_DATA.selectedDate;
  const dateObj = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[month];

  valueEl.textContent = `${dayName}, ${day} ${monthName} ${year} • ${BOOKING_DATA.selectedTime}`;
}

/**
 * Обработчик навигации по месяцам (стрелки влево/вправо).
 */
function setupMonthNavigation() {
  const navButtons = document.querySelectorAll(".calendar-nav button");

  navButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      if (index === 0) {
        // Назад
        BOOKING_DATA.currentMonth -= 1;
        if (BOOKING_DATA.currentMonth < 0) {
          BOOKING_DATA.currentMonth = 11;
          BOOKING_DATA.currentYear -= 1;
        }
      } else {
        // Вперёд
        BOOKING_DATA.currentMonth += 1;
        if (BOOKING_DATA.currentMonth > 11) {
          BOOKING_DATA.currentMonth = 0;
          BOOKING_DATA.currentYear += 1;
        }
      }
      renderCalendar();
    });
  });
}

/**
 * Обработчик кнопки "Назад".
 */
function setupBackButton() {
  const backButton = document.querySelector(".back-button");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}

/**
 * Обработчик кнопки "Далее".
 */
function setupNextButton() {
  const nextBtn = document.querySelector(".next-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      window.location.href = "forma.html";
    });
  }
}

/**
 * Инициализация модуля.
 */
function init() {
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  setupMonthNavigation();
  setupBackButton();
  setupNextButton();
}

document.addEventListener("DOMContentLoaded", function () {
  init();
});