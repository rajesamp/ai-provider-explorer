import '@testing-library/jest-dom/vitest';
import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

// jsdom does not implement scrollTo; framer-motion touches it during layout.
if (!window.scrollTo) {
  window.scrollTo = () => {};
}

// jsdom lacks matchMedia (used indirectly by framer-motion MotionConfig).
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; },
  });
}
