import { useState } from 'react';

export interface UseLocalStorageReturn<T> {
    value: T;
    setValue: (value: T | ((prev: T) => T)) => void;
    removeValue: () => void;
}

export const useLocalStorage = <T>(
    key: string,
    initialValue: T
): UseLocalStorageReturn<T> => {
    // Get value from localStorage or use initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update localStorage when value changes
    const setValue = (value: T | ((prev: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Remove value from localStorage
    const removeValue = () => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    };

    return {
        value: storedValue,
        setValue,
        removeValue,
    };
};
