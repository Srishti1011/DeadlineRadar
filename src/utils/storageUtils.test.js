import { describe, expect, it, vi } from 'vitest';
import { storage } from './storageUtils';

describe('storage utilities', () => {
  it('returns the provided default when a key has not been stored', () => {
    expect(storage.get('tasks', [])).toEqual([]);
  });

  it('saves and retrieves structured values across separate reads', () => {
    const tasks = [{ id: 'task-1', title: 'Submit report' }];
    storage.set('tasks', tasks);
    expect(storage.get('tasks', null)).toEqual(tasks);
  });

  it('updates existing records when a value is saved again', () => {
    storage.set('tasks', [{ id: 'task-1', title: 'Old title' }]);
    storage.set('tasks', [{ id: 'task-1', title: 'Updated title' }]);
    expect(storage.get('tasks', [])).toEqual([{ id: 'task-1', title: 'Updated title' }]);
  });

  it('removes a stored value', () => {
    storage.set('tasks', [{ id: 'task-1' }]);
    storage.remove('tasks');
    expect(storage.get('tasks', 'fallback')).toBe('fallback');
  });

  it('returns the fallback and warns when stored JSON is invalid', () => {
    window.localStorage.setItem('deadline_radar_tasks', '{not json');
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(storage.get('tasks', [])).toEqual([]);
    expect(warning).toHaveBeenCalledOnce();
  });

  it('clears only application keys and leaves unrelated storage untouched', () => {
    window.localStorage.setItem('unrelated-key', 'keep');
    storage.set('tasks', []);
    storage.set('settings', { theme: 'dark' });

    storage.clearAll();

    expect(storage.get('tasks', null)).toBeNull();
    expect(storage.get('settings', null)).toBeNull();
    expect(window.localStorage.getItem('unrelated-key')).toBe('keep');
  });
});
