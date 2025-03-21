
import React from 'react';

interface PrintCalendarMonthInfoProps {
  initialDayOfYear: number;
  finalDayOfYear: number;
  initialWeek: number;
  finalWeek: number;
  year: number;
}

const PrintCalendarMonthInfo: React.FC<PrintCalendarMonthInfoProps> = ({
  initialDayOfYear,
  finalDayOfYear,
  initialWeek,
  finalWeek,
  year
}) => {
  return (
    <div className="month-info">
      <div>Initial Day: {initialDayOfYear} of {year}</div>
      <div>Final Day: {finalDayOfYear} of {year}</div>
      <div>Week Range: {initialWeek} - {finalWeek}</div>
    </div>
  );
};

export default PrintCalendarMonthInfo;
