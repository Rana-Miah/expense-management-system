// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key:string, initialValue:T) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    // Check for SSR environment
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) as T : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error(error);
      return initialValue;
    }
  });

  // useEffect to update local storage when the state changes
  useEffect(() => {
    // Check for SSR environment
    if (typeof window !== 'undefined') {
      try {
        // Allow the stored value to be a function for lazy state updates
        const valueToStore = storedValue instanceof Function ? storedValue(storedValue) : storedValue;
        // Save state to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.error(error);
      }
    }
  }, [key, storedValue]);

  return {storedValue, setStoredValue}
};
