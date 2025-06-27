import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  cleanup(); // Destroy rendered components
});