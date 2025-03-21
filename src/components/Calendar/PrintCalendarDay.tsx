
import React from 'react';

interface PrintCalendarDayProps {
  dayOfMonth: number;
  dayOfYear: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  quarter: number;
}

const PrintCalendarDay: React.FC<PrintCalendarDayProps> = ({
  dayOfMonth,
  dayOfYear,
  isToday,
  isCurrentMonth,
  quarter
}) => {
  const quarterClass = `q${quarter}`;
  const todayClass = isToday ? 'today' : '';
  const otherMonthClass = !isCurrentMonth ? 'other-month' : '';
  
  return (
    <td className={`${quarterClass} ${todayClass} ${otherMonthClass} day-column`}>
      <div className="day-content">
        <span className="day-of-month">{dayOfMonth}</span>
        <span className="day-of-year">{dayOfYear}</span>
      </div>
    </td>
  );
};

export default PrintCalendarDay;
