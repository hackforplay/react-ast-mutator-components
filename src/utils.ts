import { useState, useCallback } from 'react';

/**
 * Create forceUpdate.
 * forceUpdate function identity is stable and won’t change on re-renders.
 */
export const useForceUpdate = () => {
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
};
