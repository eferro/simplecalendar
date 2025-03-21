
export const generatePrintStyles = () => `
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
    .month-container {
      width: 100%;
      padding: 0.5cm;
      box-sizing: border-box;
      height: 90vh; /* Use 90% of viewport height */
      display: flex;
      flex-direction: column;
    }
    .month-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5cm;
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
      flex-grow: 1; /* Take up remaining vertical space */
    }
    .calendar-grid th, .calendar-grid td {
      border: 1px solid #ddd; /* Ensure border is visible for each cell */
      padding: 6px;
      text-align: center;
      overflow: hidden; /* Prevent content overflow */
      height: 12vh; /* Make cells taller */
      vertical-align: top; /* Align content to the top */
    }
    .calendar-grid th {
      background-color: #f5f5f5;
      font-weight: bold;
      height: auto; /* Reset height for header row */
    }
    .week-number {
      background-color: #f5f5f5;
      font-weight: bold;
      width: 5%;
      vertical-align: middle;
    }
    /* Set fixed widths for day columns */
    .day-column {
      width: 13%; /* Distribute remaining width (95%) among 7 days */
      position: relative;
    }
    .day-content {
      display: flex;
      align-items: flex-start;
      justify-content: center; /* Center the content horizontally */
      padding: 5px;
    }
    .day-of-month {
      font-size: 18pt;
      font-weight: bold;
      margin-right: 5px;
    }
    .day-of-year {
      font-size: 10pt;
      color: #777;
      margin-top: 3px;
    }
    .other-month {
      color: #ccc;
    }
    .other-month .day-of-year {
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
`;
