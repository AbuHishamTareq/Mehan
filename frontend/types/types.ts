// Language Context Types
export type Language = 'en' | 'ar';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

// Auth Context Types
export type User = {
  id: number;
  name: string;
  email: string;
}

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, rememberMe: boolean, language: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}