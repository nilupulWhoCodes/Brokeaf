import english from '@assets/locale/English.json';
import sinhala from '@assets/locale/Sinhala.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

interface TranslationResources {
  welcome: string;
  sign_out: string;
  [key: string]: string;
}

const resources = {
  en: {
    translation: english as TranslationResources,
  },
  fr: {
    translation: {
      welcome: 'Bienvenue!',
      greeting: 'Salut, {{name}}!',
    },
  },
  sn: {
    translation: sinhala,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'sn',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

export const updateTranslation = (
  lang: string,
  key: keyof TranslationResources,
  newValue: string
) => {
  const currentResources = i18n.getResourceBundle(
    lang,
    'translation'
  ) as TranslationResources;

  if (!currentResources) {
    console.error(`Language "${lang}" not found in resources.`);
    return;
  }

  currentResources[key] = newValue;
  i18n.addResourceBundle(lang, 'translation', currentResources, true, true);
};
