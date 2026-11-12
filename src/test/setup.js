import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.mock('canvas-confetti', () => ({ default: vi.fn() }));

globalThis.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(target) {
    this.callback([{ target, contentRect: { width: 1024, height: 768 } }]);
  }
  unobserve() {}
  disconnect() {}
};

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.documentElement.classList.remove('dark');
  vi.restoreAllMocks();
  vi.useRealTimers();
});
