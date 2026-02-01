// themes.ts
export const lightTheme = {
  colors: {
    background: '#FAF3EB',
    card: '#FFFFFF',
    text: '#000000',
    button: '#FF9B85',
  },
};

export const darkTheme = {
  colors: {
    background: '#2C2B2B',
    card: '#1E1E1E',
    text: '#FFFFFF',
    button: '#FBF4ED',
  },
};

export type ThemeType = typeof lightTheme; // Type for TypeScript
