import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { PostConfig, SavedConfigsContextType } from '../types/config';
import {
  loadSavedConfigs,
  saveConfigsToStorage,
  createNewConfig,
} from '../utils/configStorage';

const SavedConfigsContext = createContext<SavedConfigsContextType | undefined>(undefined);

interface SavedConfigsProviderProps {
  children: ReactNode;
}

export const SavedConfigsProvider: React.FC<SavedConfigsProviderProps> = ({ children }) => {
  const [savedConfigs, setSavedConfigs] = useState<PostConfig[]>([]);

  useEffect(() => {
    setSavedConfigs(loadSavedConfigs());
  }, []);

  const saveConfig = (config: Omit<PostConfig, 'id' | 'createdAt'>) => {
    const newConfig = createNewConfig(config);
    const updatedConfigs = [...savedConfigs, newConfig];
    setSavedConfigs(updatedConfigs);
    saveConfigsToStorage(updatedConfigs);
  };

  const loadConfig = (configId: string): PostConfig | null => {
    return savedConfigs.find(config => config.id === configId) || null;
  };

  const deleteConfig = (configId: string) => {
    const updatedConfigs = savedConfigs.filter(config => config.id !== configId);
    setSavedConfigs(updatedConfigs);
    saveConfigsToStorage(updatedConfigs);
  };

  const renameConfig = (configId: string, newName: string) => {
    const updatedConfigs = savedConfigs.map(config =>
      config.id === configId ? { ...config, name: newName } : config
    );
    setSavedConfigs(updatedConfigs);
    saveConfigsToStorage(updatedConfigs);
  };

  const value: SavedConfigsContextType = {
    savedConfigs,
    saveConfig,
    loadConfig,
    deleteConfig,
    renameConfig,
  };

  return (
    <SavedConfigsContext.Provider value={value}>
      {children}
    </SavedConfigsContext.Provider>
  );
};

export { SavedConfigsContext };
