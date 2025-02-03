import { createContext, useState, useCallback, useMemo } from 'react';

export const themes = {
  dark: 'dark',
  light: 'light',
};

const switchTheme = (theme) =>
  theme === themes.dark ? themes.light : themes.dark;

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const savedTheme = sessionStorage.getItem('themeMode');
  const initialTheme = savedTheme ? savedTheme : themes.light; 
  
  const [theme, setTheme] = useState(initialTheme);

  const toggleTheme = useCallback(() => {
    const newThemeValue = switchTheme(theme);
    setTheme(newThemeValue);
    sessionStorage.setItem('themeMode', newThemeValue);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, textTheme: switchTheme(theme), toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
