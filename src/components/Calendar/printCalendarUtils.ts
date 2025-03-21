
import { format, addMonths, startOfYear, getMonth } from 'date-fns';
import { getMonthData } from '@/utils/calendarUtils';
import { generatePrintStyles } from './PrintCalendarStyles';

export const generatePrintableContent = (yearToDisplay: number) => {
  const startDate = startOfYear(new Date(yearToDisplay, 0, 1));
  
  // Create HTML content
  let htmlContent = `
    <html>
      <head>
        <title>Calendar ${yearToDisplay}</title>
        <style>
          ${generatePrintStyles()}
        </style>
      </head>
      <body>
  `;

  // Generate 12 months
  for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
    const monthDate = addMonths(startDate, monthOffset);
    const { weeks, monthName, year } = getMonthData(monthDate);
    const month = getMonth(monthDate) + 1;
    const quarter = Math.ceil(month / 3);
    
    // Find initial and final day of year and weeks for this month
    const firstDay = weeks.flatMap(week => week.days)
                         .find(day => day.isCurrentMonth);
    
    const lastDay = [...weeks.flatMap(week => week.days)]
                         .reverse()
                         .find(day => day.isCurrentMonth);
    
    const initialDayOfYear = firstDay ? firstDay.dayOfYear : 0;
    const finalDayOfYear = lastDay ? lastDay.dayOfYear : 0;
    
    const initialWeek = weeks[0].weekNumber;
    const finalWeek = weeks[weeks.length - 1].weekNumber;
    
    // Build month HTML
    htmlContent += `
      <div class="month-container q${quarter}">
        <div class="month-header">
          <div class="month-title">${monthName}</div>
          <div class="year">${year}</div>
        </div>
        <div class="month-info">
          <div>Initial Day: ${initialDayOfYear} of ${year}</div>
          <div>Final Day: ${finalDayOfYear} of ${year}</div>
          <div>Week Range: ${initialWeek} - ${finalWeek}</div>
        </div>
        <table class="calendar-grid">
          <thead>
            <tr>
              <th class="week-number">Week</th>
              <th class="day-column">Monday</th>
              <th class="day-column">Tuesday</th>
              <th class="day-column">Wednesday</th>
              <th class="day-column">Thursday</th>
              <th class="day-column">Friday</th>
              <th class="day-column">Saturday</th>
              <th class="day-column">Sunday</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Add week rows
    weeks.forEach(week => {
      // Get the quarter of the first day in the week (Monday)
      const weekQuarter = week.days[0].quarter;
      
      htmlContent += `<tr>`;
      htmlContent += `
        <td class="week-number">
          ${week.weekNumber}
          <span class="week-quarter">Q${weekQuarter}</span>
        </td>
      `;
      
      // Add days in the week
      week.days.forEach(day => {
        const quarterClass = `q${day.quarter}`;
        const todayClass = day.isToday ? 'today' : '';
        const otherMonthClass = !day.isCurrentMonth ? 'other-month' : '';
        
        htmlContent += `
          <td class="${quarterClass} ${todayClass} ${otherMonthClass} day-column">
            <div class="day-content">
              <span class="day-of-month">${day.dayOfMonth}</span>
              <span class="day-of-year">${day.dayOfYear}</span>
            </div>
          </td>
        `;
      });
      
      htmlContent += `</tr>`;
    });

    // Close table and month container
    htmlContent += `
          </tbody>
        </table>
      </div>
    `;
    
    // Add page break after each month except the last one
    if (monthOffset < 11) {
      htmlContent += `<div style="page-break-after: always;"></div>`;
    }
  }

  // Close HTML
  htmlContent += `
      </body>
    </html>
  `;

  return htmlContent;
};

export const openPrintWindow = (htmlContent: string) => {
  const printWindow = window.open('', '_blank', 'width=1200,height=800');
  if (!printWindow) {
    alert('Please allow popups for this website to print the calendar.');
    return null;
  }
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  return printWindow;
};
