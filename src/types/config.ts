export interface PostConfig {
  id?: string;
  name: string;
  title: string;
  content: string;
  footer: string;
  theme: 'dark' | 'light' | 'teal';
  template: 'modern' | 'minimal' | 'gradient';
  titleFontSize: number;
  contentFontSize: number;
  titleFontWeight: string;
  contentFontWeight: string;
  titleY: number;
  contentY: number;
  showNextArrow: boolean;
  showCodeSection: boolean;
  codeBoxHeight: number;
  code: string;
  createdAt?: string;
}

export interface SavedConfigsContextType {
  savedConfigs: PostConfig[];
  saveConfig: (config: Omit<PostConfig, 'id' | 'createdAt'>) => void;
  loadConfig: (configId: string) => PostConfig | null;
  deleteConfig: (configId: string) => void;
  renameConfig: (configId: string, newName: string) => void;
}
