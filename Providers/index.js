import { ThemeProvider, useTheme } from './Theme'
import { LocalizationProvider, useLocalization } from './Localization'

// import { combineProviders } from 'react-combine-provider';

// const AppProvider = ({ children, theme }) => {
//   const Provider = combineProviders([[ThemeProvider, { initialState: theme }]])

//   return (
//     <Provider>
//       {children}
//     </Provider>
//   );
// };

export {
  ThemeProvider, useTheme,
  LocalizationProvider, useLocalization
}