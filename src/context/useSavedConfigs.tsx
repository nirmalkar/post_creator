import { useContext } from 'react';
import { SavedConfigsContext } from './SavedConfigsContext';
import type { SavedConfigsContextType } from '../types/config';

export const useSavedConfigs = (): SavedConfigsContextType => {
  const context = useContext(SavedConfigsContext);
  if (context === undefined) {
    throw new Error('useSavedConfigs must be used within a SavedConfigsProvider');
  }
  return context as SavedConfigsContextType;
};
