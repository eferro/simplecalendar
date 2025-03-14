
import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { getMonthData, navigateMonth } from '@/utils/calendarUtils';
import { getQuarterName, getQuarterColor } from '@/utils/calendarUtils';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { weeks, monthName, year } = getMonthData(currentDate);
  
  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => navigateMonth(prevDate, 'prev'));
  };
  
  const handleNextMonth = () => {
    setCurrentDate((prevDate) => navigateMonth(prevDate, 'next'));
  };
  
  // Get unique quarters in this view for the legend
  const uniqueQuarters = [...new Set(weeks.flatMap(week => 
    week.days.filter(day => day.isCurrentMonth).map(day => day.quarter)
  ))].sort();
  
  return (
    <div className="calendar-container">
      <CalendarHeader
        monthName={monthName}
        year={year}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      
      <div className="mb-4 flex items-center space-x-4 animate-slide-up">
        <span className="text-sm font-medium">Quarters:</span>
        {uniqueQuarters.map((quarter) => (
          <div key={quarter} className="flex items-center">
            <div 
              className={`${getQuarterColor(quarter)} w-4 h-4 rounded mr-1`}
              aria-hidden="true"
            ></div>
            <span className="text-sm">{getQuarterName(quarter)}</span>
          </div>
        ))}
      </div>
      
      <div className="bg-card rounded-xl shadow-sm overflow-hidden border">
        <CalendarGrid weeks={weeks} />
      </div>
    </div>
  );
};

export default Calendar;
