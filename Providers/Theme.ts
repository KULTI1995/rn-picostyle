import { useState, useEffect } from "react";

import { createContainer } from 'unstated-next';

import { usePersistStorage as usePersistState } from "react-native-use-persist-storage";

const ThemeContext = (initialState = {theme: {}, persist: false}) => {
  // const ThemeProps = useMemo(() => (initialState), [initialState])
  const [theme, setTheme, restored] = usePersistState<"light"|"dark">("@persist_theme", "light", {persist: !!initialState['persist']});
  const [themeStyle, setThemeStyle] = useState(initialState['theme']);
  
  const switchTheme = (theme:"light"|"dark") => setTheme(theme);

  useEffect(() => {
    if (initialState['theme']) {
      setThemeStyle(initialState['theme'] || {});
    }
  }, [initialState.theme])

  return { theme, themeStyle, switchTheme, restored }
}

const useTheme = createContainer(ThemeContext);
const ThemeProvider = useTheme.Provider

export { ThemeProvider, useTheme };