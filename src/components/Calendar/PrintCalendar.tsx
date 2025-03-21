
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { generatePrintableContent, openPrintWindow } from './printCalendarUtils';

interface PrintCalendarProps {
  currentDate: Date;
}

const PrintCalendar: React.FC<PrintCalendarProps> = ({ currentDate }) => {
  const handlePrint = () => {
    // Get the current year
    const yearToDisplay = currentDate.getFullYear();
    
    // Generate printable content
    const htmlContent = generatePrintableContent(yearToDisplay);
    
    // Open print window
    const printWindow = openPrintWindow(htmlContent);
    
    if (printWindow) {
      // Print after everything has loaded
      printWindow.onload = function() {
        printWindow.print();
        // Don't close the window automatically to allow the user to cancel the print
      };
    }
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
