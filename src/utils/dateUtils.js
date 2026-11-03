// Utility functions for robust academic date management

/**
 * Returns today's ISO string (YYYY-MM-DD)
 */
export const getTodayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Adds or subtracts days from a date string and returns ISO format
 */
export const addDays = (dateStr, days) => {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns difference in days between two date strings (target - base)
 */
export const getDaysDiff = (targetDateStr, baseDateStr = getTodayISO()) => {
  const target = new Date(targetDateStr + 'T00:00:00');
  const base = new Date(baseDateStr + 'T00:00:00');
  const diffTime = target.getTime() - base.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Checks if a task is overdue
 */
export const isTaskOverdue = (task) => {
  if (task.completed) return false;
  if (!task.dueDate) return false;

  const today = getTodayISO();
  if (task.dueDate < today) return true;

  if (task.dueDate === today && task.dueTime) {
    const now = new Date();
    const [dueH, dueM] = task.dueTime.split(':').map(Number);
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    if (currentH > dueH || (currentH === dueH && currentM > dueM)) {
      return true;
    }
  }

  return false;
};

/**
 * Checks if task is due today
 */
export const isTaskDueToday = (task) => {
  if (task.completed) return false;
  return task.dueDate === getTodayISO();
};

/**
 * Checks if task is due within next N days
 */
export const isTaskDueWithinDays = (task, days = 7) => {
  if (task.completed) return false;
  const diff = getDaysDiff(task.dueDate);
  return diff >= 0 && diff <= days;
};

/**
 * Formats a 24-hr time string (e.g., '14:30') to '2:30 PM'
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  const minStr = String(m).padStart(2, '0');
  return `${hour12}:${minStr} ${period}`;
};

/**
 * Formats date into readable format according to user preference
 */
export const formatDisplayDate = (dateStr, formatPref = 'MMM DD, YYYY') => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (formatPref === 'DD/MM/YYYY') {
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
  }
  if (formatPref === 'YYYY-MM-DD') {
    return dateStr;
  }
  if (formatPref === 'MMMM DD, YYYY') {
    return `${monthsFull[month - 1]} ${day}, ${year}`;
  }
  // Default: 'MMM DD, YYYY'
  return `${monthsShort[month - 1]} ${day}, ${year}`;
};

/**
 * Human relative deadline badge string and color category
 */
export const getRelativeDeadline = (task) => {
  if (task.completed) {
    return {
      label: 'Completed',
      status: 'completed',
      badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    };
  }

  const diff = getDaysDiff(task.dueDate);
  const isOverdue = isTaskOverdue(task);

  if (isOverdue) {
    const overdueDays = Math.abs(diff);
    return {
      label: overdueDays === 0 ? 'Overdue today' : `Overdue by ${overdueDays}d`,
      status: 'overdue',
      badgeClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800'
    };
  }

  if (diff === 0) {
    return {
      label: 'Due today',
      status: 'today',
      badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    };
  }

  if (diff === 1) {
    return {
      label: 'Due tomorrow',
      status: 'tomorrow',
      badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
    };
  }

  if (diff > 1 && diff <= 6) {
    return {
      label: `Due in ${diff} days`,
      status: 'upcoming',
      badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    };
  }

  return {
    label: formatDisplayDate(task.dueDate),
    status: 'later',
    badgeClass: 'bg-slate-50 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300 border-slate-200 dark:border-slate-700'
  };
};

/**
 * Returns the Monday of the week for given date
 */
export const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

/**
 * Gets 7 days (Monday - Sunday) for the given base date
 */
export const getWeekDays = (baseDate = new Date()) => {
  const monday = getMonday(baseDate);
  const days = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const todayStr = getTodayISO();

  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    days.push({
      dateStr,
      dayNumber: current.getDate(),
      dayName: dayNames[i],
      fullDayName: fullDayNames[i],
      isToday: dateStr === todayStr,
      rawDate: current
    });
  }

  return days;
};

/**
 * Gets full month calendar matrix (42 cells: 6 weeks)
 */
export const getMonthGrid = (year, monthIndex) => {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  // Day of week of 1st day (0 is Sun, 1 is Mon...)
  let startDay = firstDayOfMonth.getDay();
  // Adjust so Monday is 0, Sunday is 6
  startDay = startDay === 0 ? 6 : startDay - 1;

  const daysInMonth = lastDayOfMonth.getDate();
  const todayStr = getTodayISO();

  const cells = [];

  // Previous month padding
  const prevMonthLastDate = new Date(year, monthIndex, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    const d = prevMonthLastDate - i;
    const prevDate = new Date(year, monthIndex - 1, d);
    const m = String(prevDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const dateStr = `${prevDate.getFullYear()}-${m}-${dayStr}`;
    cells.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      rawDate: prevDate
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const m = String(monthIndex + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const dateStr = `${year}-${m}-${dayStr}`;
    cells.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      rawDate: new Date(year, monthIndex, d)
    });
  }

  // Next month padding to reach multiple of 7 (up to 35 or 42 cells)
  const remainingCells = (7 - (cells.length % 7)) % 7;
  const targetTotal = cells.length + remainingCells < 35 ? 35 : cells.length + remainingCells;
  let nextDay = 1;
  while (cells.length < targetTotal) {
    const nextDate = new Date(year, monthIndex + 1, nextDay);
    const m = String(nextDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(nextDay).padStart(2, '0');
    const dateStr = `${nextDate.getFullYear()}-${m}-${dayStr}`;
    cells.push({
      dateStr,
      dayNumber: nextDay,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      rawDate: nextDate
    });
    nextDay++;
  }

  return cells;
};
