import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Minimal Test', () => {
  it('should render a simple div', () => {
    render(<div>Test</div>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
}); 