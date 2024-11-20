import { useState, useEffect, useCallback } from 'react';

function useThrottle<T extends (...args: any[]) => any>(callback: T, delay: number): [T, () => void] {
  const [lastExecuted, setLastExecuted] = useState(0);

  const throttledCallback = useCallback(
    (...args: any[]) => {
      const now = Date.now();
      if (now - lastExecuted > delay) {
        setLastExecuted(now);
        callback(...args);
      }
    },
    [callback, delay, lastExecuted]
  );

  const clearThrottle = useCallback(() => {
    setLastExecuted(0);
  }, []);

  useEffect(() => {
    return () => {
      // Clear the timeout when the component unmounts
      setLastExecuted(0);
    };
  }, []);

  return [throttledCallback as T, clearThrottle];
}

export default useThrottle;







// Use this hook like this

// const throttledCallback = useThrottle((...args: any[]) => {
//   // Your callback logic here
// }, interval, { leading: true, trailing: true });
