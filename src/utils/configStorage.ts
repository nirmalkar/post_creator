import type { PostConfig } from '../types/config';

const STORAGE_KEY = 'insta_post_saved_configs';

export const loadSavedConfigs = (): PostConfig[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load saved configs:', error);
    return [];
  }
};

export const saveConfigsToStorage = (configs: PostConfig[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  } catch (error) {
    console.error('Failed to save configs:', error);
  }
};

export const generateConfigId = (): string => {
  return `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createNewConfig = (config: Omit<PostConfig, 'id' | 'createdAt'>): PostConfig => {
  return {
    ...config,
    id: generateConfigId(),
    createdAt: new Date().toISOString(),
  };
};
