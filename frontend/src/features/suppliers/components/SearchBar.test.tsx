import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders with initial value', () => {
    render(<SearchBar value="test" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test');
  });

  it('calls onChange after debounce', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} debounce={400} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'RFC123' } });
    vi.advanceTimersByTime(400);
    expect(onChange).toHaveBeenCalledWith('RFC123');
  });
});
