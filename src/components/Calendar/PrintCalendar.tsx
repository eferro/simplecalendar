
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
              .page-break {
                page-break-after: always;
              }
              .month-container {
                width: 100%;
                height: 100%;
                padding: 1cm;
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
                border-collapse: collapse;
              }
              .calendar-grid th, .calendar-grid td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
              }
              .calendar-grid th {
                background-color: #f5f5f5;
                font-weight: bold;
              }
              .week-number {
                background-color: #f5f5f5;
                font-weight: bold;
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
      
      // Start month container
      htmlContent += `
        <div class="month-container ${quarterClass}">
          <div class="month-header">
            <div class="month-title">${monthName}</div>
            <div class="year">${year}</div>
          </div>
          <table class="calendar-grid">
            <thead>
              <tr>
                <th>Week</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
                <th>Sunday</th>
              </tr>
            </thead>
            <tbody>
      `;

      // Add week rows
      weeks.forEach(week => {
        htmlContent += `<tr>`;
        htmlContent += `<td class="week-number">${week.weekNumber}</td>`;
        
        // Add days in the week
        week.days.forEach(day => {
          const quarterClass = `q${day.quarter}`;
          const todayClass = day.isToday ? 'today' : '';
          const otherMonthClass = !day.isCurrentMonth ? 'other-month' : '';
          
          htmlContent += `
            <td class="${quarterClass} ${todayClass} ${otherMonthClass}">
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
        htmlContent += `<div class="page-break"></div>`;
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
