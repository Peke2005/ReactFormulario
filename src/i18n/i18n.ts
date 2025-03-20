// Importa la biblioteca principal de i18next para manejar internacionalización
import i18n from "i18next";
// Importa el módulo para integrar i18next con React
import { initReactI18next } from "react-i18next";

// Importa los archivos de traducción en formato JSON para inglés y español
import en from "./locales/en.json"; // Traducciones en inglés
import es from "./locales/es.json"; // Traducciones en español

// Configura i18n con el plugin de React y lo inicializa
i18n.use(initReactI18next).init({
  // Objeto que contiene los recursos de traducción
  resources: {
    en: { translation: en }, // Asocia el idioma "en" con las traducciones del archivo en.json
    es: { translation: es }, // Asocia el idioma "es" con las traducciones del archivo es.json
  },
  lng: "es", // Establece el idioma predeterminado como español
  fallbackLng: "en", // Idioma de respaldo (inglés) si una traducción no está disponible
  interpolation: {
    escapeValue: false, // Desactiva el escape de valores (útil porque React ya maneja la seguridad)
  },
});

// Exporta la instancia configurada de i18n para usarla en otros archivos
export default i18n;
