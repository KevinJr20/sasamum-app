import { describe, it, expect } from 'vitest';
import { getBackTarget, popHistory } from '../navigation';

describe('navigation helpers', () => {
  it('returns last history entry when available', () => {
    const history = ['dashboard', 'profile', 'photos'];
    expect(getBackTarget(history)).toBe('photos');
  });

  it('falls back to dashboard when history empty', () => {
    expect(getBackTarget([])).toBe('dashboard');
    expect(getBackTarget(undefined as any)).toBe('dashboard');
    expect(getBackTarget([], 'welcome')).toBe('welcome');
  });

  it('popHistory removes last entry', () => {
    const history = ['a', 'b', 'c'];
    const popped = popHistory(history);
    expect(popped).toEqual(['a', 'b']);
  });

  it('popHistory on empty returns empty array', () => {
    expect(popHistory([])).toEqual([]);
  });
});
