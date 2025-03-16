
import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { getMonthData, navigateMonth, getDayOfYear } from '@/utils/calendarUtils';
import { getQuarterName, getQuarterColor } from '@/utils/calendarUtils';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { weeks, monthName, year } = getMonthData(currentDate);
  const dayOfYear = getDayOfYear(currentDate);
  
  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => navigateMonth(prevDate, 'prev'));
  };
  
  const handleNextMonth = () => {
    setCurrentDate((prevDate) => navigateMonth(prevDate, 'next'));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
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
        onToday={handleToday}
      />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 animate-slide-up">
        <div className="flex items-center space-x-4 mb-2 md:mb-0">
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
        
        <div className="text-sm font-medium">
          Day of Year: <span className="font-bold">{dayOfYear}</span>
        </div>
      </div>
      
      <div className="bg-card rounded-xl shadow-sm overflow-hidden border">
        <CalendarGrid weeks={weeks} />
      </div>
    </div>
  );
};

export default Calendar;
