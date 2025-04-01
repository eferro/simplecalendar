import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toaster } from '../toaster';
import { Toaster as Sonner } from '../sonner';
import { ThemeProvider } from 'next-themes';

// Create a wrapper component for providers
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    themes={['light', 'dark', 'system']}
  >
    {children}
  </ThemeProvider>
);

describe('Toast Components', () => {
  it('renders shadcn Toaster', () => {
    render(<Toaster />);
    const toaster = document.querySelector('[role="region"]');
    expect(toaster).toBeInTheDocument();
  });

  it('renders Sonner Toaster', async () => {
    const { container } = render(<Sonner />, { wrapper: Wrapper });
    
    // Wait for next tick to allow theme context to be initialized
    await new Promise((resolve) => setTimeout(resolve, 0));
    
    const toaster = document.querySelector('section[aria-label="Notifications alt+T"]');
    expect(toaster).toBeInTheDocument();
  });
}); 