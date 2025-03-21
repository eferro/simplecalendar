
import React from 'react';
import PrintCalendarDay from './PrintCalendarDay';
import { CalendarDay } from '@/utils/calendarUtils';

interface PrintCalendarWeekProps {
  weekNumber: number;
  days: CalendarDay[];
  weekQuarter: number;
}

const PrintCalendarWeek: React.FC<PrintCalendarWeekProps> = ({
  weekNumber,
  days,
  weekQuarter
}) => {
  return (
    <tr>
      <td className="week-number">
        {weekNumber}
        <span className="week-quarter">Q{weekQuarter}</span>
      </td>
      
      {days.map((day, index) => (
        <PrintCalendarDay
          key={index}
          dayOfMonth={day.dayOfMonth}
          dayOfYear={day.dayOfYear}
          isToday={day.isToday}
          isCurrentMonth={day.isCurrentMonth}
          quarter={day.quarter}
        />
      ))}
    </tr>
  );
};

export default PrintCalendarWeek;
