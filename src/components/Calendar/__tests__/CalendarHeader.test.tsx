import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarHeader from '../CalendarHeader';

// Mock the Button component
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  )
}));

// Mock the icons
vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span>←</span>,
  ChevronRight: () => <span>→</span>,
  Calendar: () => <span>📅</span>
}));

describe('CalendarHeader Component', () => {
  it('displays month and year correctly', () => {
    const mockProps = {
      monthName: 'March',
      year: 2024,
      onPrevMonth: vi.fn(),
      onNextMonth: vi.fn(),
      onToday: vi.fn()
    };

    render(<CalendarHeader {...mockProps} />);
    
    // Check if month and year are displayed
    expect(screen.getByText('March')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('calls navigation functions when buttons are clicked', () => {
    const mockProps = {
      monthName: 'March',
      year: 2024,
      onPrevMonth: vi.fn(),
      onNextMonth: vi.fn(),
      onToday: vi.fn()
    };

    render(<CalendarHeader {...mockProps} />);
    
    // Find and click the navigation buttons
    fireEvent.click(screen.getByText('←'));
    expect(mockProps.onPrevMonth).toHaveBeenCalled();

    fireEvent.click(screen.getByText('→'));
    expect(mockProps.onNextMonth).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Today'));
    expect(mockProps.onToday).toHaveBeenCalled();
  });
}); 