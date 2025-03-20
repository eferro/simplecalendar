
import React from 'react';
import { format, addMonths, startOfYear, getMonth, getDaysInMonth } from 'date-fns';
import { getMonthData, getQuarterColor } from '@/utils/calendarUtils';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface PrintCalendarProps {
  currentDate: Date;
}

const PrintCalendar: React.FC<PrintCalendarProps> = ({ currentDate }) => {
  const handlePrint = () => {
    // Create a new window for the printable content
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      alert('Please allow popups for this website to print the calendar.');
      return;
    }

    // Get the current year
    const yearToDisplay = currentDate.getFullYear();
    const startDate = startOfYear(new Date(yearToDisplay, 0, 1));
    
    // Create HTML content for all 12 months
    let htmlContent = `
      <html>
        <head>
          <title>Calendar ${yearToDisplay}</title>
          <style>
            @media print {
              @page {
                size: landscape;
                margin: 0.5cm;
              }
              body {
                font-family: Arial, sans-serif;
                color: #333;
                padding: 0;
                margin: 0;
              }
              /* Removed page-break class to eliminate empty pages */
              .month-container {
                width: 100%;
                padding: 1cm;
                box-sizing: border-box;
              }
              .month-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1cm;
              }
              .month-title {
                font-size: 24pt;
                font-weight: bold;
              }
              .year {
                font-size: 24pt;
                color: #666;
              }
              .calendar-grid {
                width: 100%;
                table-layout: fixed; /* Fixed table layout to manage column widths */
                border-collapse: collapse;
              }
              .calendar-grid th, .calendar-grid td {
                border: 1px solid #ddd;
                padding: 6px;
                text-align: center;
                overflow: hidden; /* Prevent content overflow */
              }
              .calendar-grid th {
                background-color: #f5f5f5;
                font-weight: bold;
              }
              .week-number {
                background-color: #f5f5f5;
                font-weight: bold;
                width: 5%;
              }
              /* Set fixed widths for day columns */
              .day-column {
                width: 13%; /* Distribute remaining width (95%) among 7 days */
              }
              .day-of-month {
                font-size: 14pt;
                font-weight: bold;
              }
              .day-of-year {
                font-size: 8pt;
                color: #999;
              }
              .other-month {
                color: #ccc;
              }
              .today {
                background-color: #fff3cd;
              }
              .q1 { background-color: rgba(191, 219, 254, 0.3); }
              .q2 { background-color: rgba(187, 247, 208, 0.3); }
              .q3 { background-color: rgba(254, 240, 138, 0.3); }
              .q4 { background-color: rgba(254, 202, 202, 0.3); }
              .quarter-indicator {
                position: absolute;
                top: 0;
                right: 0;
                font-size: 7pt;
                color: #666;
                padding: 1px 3px;
              }
              .week-quarter {
                font-size: 7pt;
                color: #666;
                display: block;
              }
              .month-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5cm;
                font-size: 9pt;
                color: #666;
              }
              .month-info div {
                border: 1px solid #ddd;
                padding: 4px 8px;
                background-color: #f9f9f9;
              }
            }
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
      const quarterClass = `q${quarter}`;
      
      // Find initial and final day of year and weeks for this month
      const firstDay = weeks[0].days.find(day => day.isCurrentMonth);
      const lastDay = [...weeks].reverse()[0].days.find(day => day.isCurrentMonth);
      
      const initialDayOfYear = firstDay ? firstDay.dayOfYear : 0;
      const finalDayOfYear = lastDay ? lastDay.dayOfYear : 0;
      
      const initialWeek = weeks[0].weekNumber;
      const finalWeek = weeks[weeks.length - 1].weekNumber;
      
      // Start month container
      htmlContent += `
        <div class="month-container ${quarterClass}">
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
        
        // Add days in the week - ensuring they're in the correct order (Monday to Sunday)
        week.days.forEach((day, index) => {
          const quarterClass = `q${day.quarter}`;
          const todayClass = day.isToday ? 'today' : '';
          const otherMonthClass = !day.isCurrentMonth ? 'other-month' : '';
          
          htmlContent += `
            <td class="${quarterClass} ${todayClass} ${otherMonthClass} day-column">
              <div class="day-of-month">${day.dayOfMonth}</div>
              <div class="day-of-year">Day ${day.dayOfYear}</div>
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

    // Write the HTML content to the print window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Print after everything has loaded
    printWindow.onload = function() {
      printWindow.print();
      // Don't close the window automatically to allow the user to cancel the print
    };
  };

  return (
    <Button 
      onClick={handlePrint}
      variant="outline"
      className="ml-2"
    >
      <Printer className="mr-2 h-4 w-4" />
      Print Calendar
    </Button>
  );
};

export default PrintCalendar;
