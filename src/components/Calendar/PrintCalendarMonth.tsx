
import React from 'react';
import PrintCalendarWeek from './PrintCalendarWeek';
import PrintCalendarMonthInfo from './PrintCalendarMonthInfo';
import { CalendarWeek } from '@/utils/calendarUtils';

interface PrintCalendarMonthProps {
  monthName: string;
  year: number;
  weeks: CalendarWeek[];
  initialDayOfYear: number;
  finalDayOfYear: number;
  initialWeek: number;
  finalWeek: number;
  quarter: number;
}

const PrintCalendarMonth: React.FC<PrintCalendarMonthProps> = ({
  monthName,
  year,
  weeks,
  initialDayOfYear,
  finalDayOfYear,
  initialWeek,
  finalWeek,
  quarter
}) => {
  const quarterClass = `q${quarter}`;
  
  return (
    <div className={`month-container ${quarterClass}`}>
      <div className="month-header">
        <div className="month-title">{monthName}</div>
        <div className="year">{year}</div>
      </div>
      
      <PrintCalendarMonthInfo
        initialDayOfYear={initialDayOfYear}
        finalDayOfYear={finalDayOfYear}
        initialWeek={initialWeek}
        finalWeek={finalWeek}
        year={year}
      />
      
      <table className="calendar-grid">
        <thead>
          <tr>
            <th className="week-number">Week</th>
            <th className="day-column">Monday</th>
            <th className="day-column">Tuesday</th>
            <th className="day-column">Wednesday</th>
            <th className="day-column">Thursday</th>
            <th className="day-column">Friday</th>
            <th className="day-column">Saturday</th>
            <th className="day-column">Sunday</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, index) => (
            <PrintCalendarWeek
              key={index}
              weekNumber={week.weekNumber}
              days={week.days}
              weekQuarter={week.days[0].quarter}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintCalendarMonth;
