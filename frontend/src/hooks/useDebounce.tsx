import React, { useEffect } from "react";

export default function useDebounce<T>(value: T, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(debouncedValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedValue, delay]);
  return debouncedValue;
}
