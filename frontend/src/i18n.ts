import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en/translation.json';
import uk from './locales/ua/translation.json';
import pl from './locales/pl/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            pl: { translation: pl },
            uk: { translation: uk },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            // порядок перевірки
            order: ["querystring", "localStorage", "navigator"],
            caches: ["localStorage"],
        },
    });

export default i18n;
