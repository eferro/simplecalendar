import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CalendarDay from '../CalendarDay';
import { format } from 'date-fns';

// Mock the hover card components
vi.mock('@/components/ui/hover-card', () => ({
  HoverCard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  HoverCardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="hover-content">{children}</div>,
  HoverCardTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock the mobile hook
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}));

describe('CalendarDay Component', () => {
  const mockDay = {
    date: new Date('2024-03-15'),
    dayOfMonth: 15,
    isCurrentMonth: true,
    isToday: false,
    weekNumber: 11,
    quarter: 1,
    dayOfYear: 75
  };

  it('renders day number correctly', () => {
    render(
      <CalendarDay
        day={mockDay}
        quarterColor="bg-quarter-q1"
        isSelected={false}
        onSelect={vi.fn()}
      />
    );
    
    // Check for day number
    expect(screen.getByText('15')).toBeInTheDocument();
    
    // Check for visible day of year
    const visibleDayOfYear = screen.getAllByText('75').find(element => 
      !element.classList.contains('invisible')
    );
    expect(visibleDayOfYear).toBeInTheDocument();
  });

  it('shows correct hover card content', () => {
    render(
      <CalendarDay
        day={mockDay}
        quarterColor="bg-quarter-q1"
        isSelected={false}
        onSelect={vi.fn()}
      />
    );
    
    // Check hover card content
    const formattedDate = format(mockDay.date, 'EEEE, MMMM d, yyyy');
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
    expect(screen.getByText(`Week ${mockDay.weekNumber} • Quarter ${mockDay.quarter} • Day ${mockDay.dayOfYear} of Year`)).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(
      <CalendarDay
        day={mockDay}
        quarterColor="bg-quarter-q1"
        isSelected={false}
        onSelect={onSelect}
      />
    );
    
    // Find the clickable div and click it
    const dayElement = screen.getByText('15').closest('.calendar-day');
    fireEvent.click(dayElement!);
    expect(onSelect).toHaveBeenCalled();
  });

  it('applies correct CSS classes based on props', () => {
    render(
      <CalendarDay
        day={{ ...mockDay, isToday: true }}
        quarterColor="bg-quarter-q1"
        isSelected={true}
        onSelect={vi.fn()}
      />
    );
    
    const dayElement = screen.getByText('15').closest('.calendar-day');
    expect(dayElement).toHaveClass('today-highlight');
    expect(dayElement).toHaveClass('selected-highlight');
    expect(dayElement).toHaveClass('bg-quarter-q1');
  });
}); 