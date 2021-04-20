import { useState, useEffect } from "react";

import { createContainer } from 'unstated-next';

const ThemeContext = (initialState = {}) => {
  // const ThemeProps = useMemo(() => (initialState), [initialState])
  const [theme, setTheme] = useState<"light"|"dark">("light");
  const [themeStyle, setThemeStyle] = useState(initialState);
  
  const switchTheme = (theme:"light"|"dark") => setTheme(theme);
  const switchThemeStyle = (themeStyle: {}) => setThemeStyle(themeStyle);

  useEffect(() => {
    if (initialState) {
      setThemeStyle(initialState || {})
    }
  }, [initialState])

  return { theme, themeStyle, switchTheme, switchThemeStyle }
}

const useTheme = createContainer(ThemeContext);
const ThemeProvider = useTheme.Provider

export { ThemeProvider, useTheme };