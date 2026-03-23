import { useEffect, useCallback, useState } from 'react';

/**
 * Custom hook to use localStorage with SSR support
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

/**
 * useTour Hook - Manage onboarding tour state
 * 
 * Handles:
 * - Tour display logic based on first-time user
 * - Current step tracking
 * - Tour completion tracking
 * - Session-persistent state
 */

export const useTour = (tourId) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [completedTours, setCompletedTours] = useLocalStorage('completedTours', {});

  // Check if tour has been completed
  const hasCompletedTour = useCallback(() => {
    return completedTours[tourId] === true;
  }, [completedTours, tourId]);

  // Initialize tour on mount or when button is clicked
  // Remove condition to allow restarting tour via "Lihat Tutorial" button
  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsVisible(true);
  }, []);

  // Move to next step
  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  // Move to previous step
  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  // Skip/close tour
  const skipTour = useCallback(() => {
    setIsVisible(false);
    setCurrentStep(0);
  }, []);

  // Complete tour
  const completeTour = useCallback(() => {
    setIsVisible(false);
    setCompletedTours(prev => ({
      ...prev,
      [tourId]: true
    }));
  }, [tourId, setCompletedTours]);

  // Go to specific step
  const goToStep = useCallback((step) => {
    setCurrentStep(step);
    setIsVisible(true);
  }, []);

  return {
    currentStep,
    isVisible,
    setIsVisible,
    hasCompletedTour: hasCompletedTour(),
    startTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    goToStep,
  };
};
