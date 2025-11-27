import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  console.log('ThemeProvider initializing...');
  
  const [theme, setThemeState] = useState<Theme>(() => {
    console.log('Initializing theme state...');
    
    // Check localStorage first
    const saved = localStorage.getItem('qr-designer-theme');
    console.log('Saved theme from localStorage:', saved);
    
    if (saved === 'light' || saved === 'dark') {
      console.log('Using saved theme:', saved);
      return saved;
    }
    
    // Check system preference
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('System prefers dark:', systemDark);
    
    const initialTheme = systemDark ? 'dark' : 'light';
    console.log('Initial theme:', initialTheme);
    
    return initialTheme;
  });

  const setTheme = (newTheme: Theme) => {
    console.log('Setting theme to:', newTheme);
    setThemeState(newTheme);
    localStorage.setItem('qr-designer-theme', newTheme);
    
    // Force update document class and data attribute
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    console.log('Document classes:', document.documentElement.className);
    console.log('Data theme:', document.documentElement.getAttribute('data-theme'));
  };

  const toggleTheme = () => {
    console.log('=== TOGGLE THEME FUNCTION CALLED ===');
    console.log('Current theme:', theme);
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('New theme will be:', newTheme);
    setTheme(newTheme);
    console.log('setTheme called with:', newTheme);
  };

  useEffect(() => {
    console.log('Theme effect running, theme:', theme);
    
    // Apply theme on mount - force it regardless of system preference
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
    
    console.log('Applied theme classes:', document.documentElement.className);

    // Don't listen to system changes if user has manually set a preference
    const saved = localStorage.getItem('qr-designer-theme');
    if (saved) {
      console.log('User has manual preference, ignoring system changes');
      return;
    }

    // Listen for system theme changes only if no manual preference is set
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      console.log('System theme changed:', e.matches ? 'dark' : 'light');
      const newTheme = e.matches ? 'dark' : 'light';
      setThemeState(newTheme);
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
