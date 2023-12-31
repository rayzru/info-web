import React from 'react';

const useSessionStorage = <T>(keyName: string, defaultValue: T) => {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      const value = window.sessionStorage.getItem(keyName);

      if (value) {
        return JSON.parse(value);
      } else {
        window.sessionStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue: T) => {
    try {
      window.sessionStorage.setItem(keyName, JSON.stringify(newValue));
      // eslint-disable-next-line no-empty
    } catch (err) { }
    setStoredValue(newValue);
  };

  return [storedValue as T, setValue];
};

export default useSessionStorage;
