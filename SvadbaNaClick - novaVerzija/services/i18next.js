import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import srb from '../locales/srb.json';

const languageResources = {
  en: { translation: en },
  srb: { translation: srb },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'srb',
  fallingbackLng: 'srb',
  resources: languageResources,

});

export default i18next;
