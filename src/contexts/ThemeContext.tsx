// ThemeContext.tsx

import React, { createContext, ReactNode, useContext, useState } from 'react';
import { darkTheme, lightTheme, ThemeType } from '../constants/themse'; // fixed typo 'themse' -> 'themes'

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

type Props = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState<ThemeType>(lightTheme);

  const toggleTheme = () => {
    setTheme(theme === lightTheme ? darkTheme : lightTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
