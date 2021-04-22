import { useState, useEffect, useMemo } from "react";

import * as Localization from 'expo-localization'; // or whatever library you want
import i18n from 'i18n-js'; // or whatever library you want

import { createContainer } from 'unstated-next';

import { usePersistStorage as usePersistState } from "react-native-use-persist-storage";

const LocalizationContext = (initialState = {}) => {
  const [locale, setLocale, restored] = usePersistState("@persist_localization", Localization.locale?.substring(0, 2) || "", {persist: !!initialState['persist']});
  const [initialStateChange, setInitialStateChange] = useState();

  useEffect(() => {
    if (initialState) {
      if(initialState['fallbacks']) i18n.fallbacks = Boolean(initialState['fallbacks']);
      if(initialState['translations'] && typeof initialState['translations'] == 'object') i18n.translations = initialState['translations'];
      setInitialStateChange(initialState);
    }
  }, [initialState])

  return useMemo(
    () => ({
      t: (scope, options) => i18n.t(scope, { locale, ...options }),
      locale,
      setLocale,
      restored
    }),
    [locale, initialStateChange]
  );
}

const useLocalization = createContainer(LocalizationContext);
const LocalizationProvider = useLocalization.Provider

export { useLocalization, LocalizationProvider }