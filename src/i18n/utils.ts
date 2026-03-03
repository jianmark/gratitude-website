import it from './it.json';
import en from './en.json';
import de from './de.json';
import fr from './fr.json';
import es from './es.json';

export const languages = {
  it: 'Italiano',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
} as const;

export type Locale = keyof typeof languages;

export const defaultLocale: Locale = 'it';

const translations: Record<Locale, Record<string, string>> = { it, en, de, fr, es };

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] ?? translations[defaultLocale]?.[key] ?? key;
}

export function getLocale(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const lang = segments[0] as Locale;
  if (lang && lang in languages) return lang;
  return defaultLocale;
}

export function localizedUrl(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean === '/' ? '/' : clean}`;
}

export function getAlternateUrls(currentPath: string): { locale: Locale; url: string }[] {
  const segments = currentPath.split('/').filter(Boolean);
  const currentLocale = segments[0] as Locale;
  const restPath = segments.slice(1).join('/');

  // Map localized slugs between languages
  const slugMap: Record<string, Record<Locale, string>> = {
    'funzionalita': { it: 'funzionalita', en: 'features', de: 'funktionen', fr: 'fonctionnalites', es: 'funcionalidades' },
    'features': { it: 'funzionalita', en: 'features', de: 'funktionen', fr: 'fonctionnalites', es: 'funcionalidades' },
    'funktionen': { it: 'funzionalita', en: 'features', de: 'funktionen', fr: 'fonctionnalites', es: 'funcionalidades' },
    'fonctionnalites': { it: 'funzionalita', en: 'features', de: 'funktionen', fr: 'fonctionnalites', es: 'funcionalidades' },
    'funcionalidades': { it: 'funzionalita', en: 'features', de: 'funktionen', fr: 'fonctionnalites', es: 'funcionalidades' },
    'prezzi': { it: 'prezzi', en: 'pricing', de: 'preise', fr: 'tarifs', es: 'precios' },
    'pricing': { it: 'prezzi', en: 'pricing', de: 'preise', fr: 'tarifs', es: 'precios' },
    'preise': { it: 'prezzi', en: 'pricing', de: 'preise', fr: 'tarifs', es: 'precios' },
    'tarifs': { it: 'prezzi', en: 'pricing', de: 'preise', fr: 'tarifs', es: 'precios' },
    'precios': { it: 'prezzi', en: 'pricing', de: 'preise', fr: 'tarifs', es: 'precios' },
    'chi-siamo': { it: 'chi-siamo', en: 'about', de: 'ueber-uns', fr: 'a-propos', es: 'nosotros' },
    'about': { it: 'chi-siamo', en: 'about', de: 'ueber-uns', fr: 'a-propos', es: 'nosotros' },
    'ueber-uns': { it: 'chi-siamo', en: 'about', de: 'ueber-uns', fr: 'a-propos', es: 'nosotros' },
    'a-propos': { it: 'chi-siamo', en: 'about', de: 'ueber-uns', fr: 'a-propos', es: 'nosotros' },
    'nosotros': { it: 'chi-siamo', en: 'about', de: 'ueber-uns', fr: 'a-propos', es: 'nosotros' },
    'contatti': { it: 'contatti', en: 'contact', de: 'kontakt', fr: 'contact', es: 'contacto' },
    'contact': { it: 'contatti', en: 'contact', de: 'kontakt', fr: 'contact', es: 'contacto' },
    'kontakt': { it: 'contatti', en: 'contact', de: 'kontakt', fr: 'contact', es: 'contacto' },
    'contacto': { it: 'contatti', en: 'contact', de: 'kontakt', fr: 'contact', es: 'contacto' },
    'demo': { it: 'demo', en: 'demo', de: 'demo', fr: 'demo', es: 'demo' },
    'privacy': { it: 'privacy', en: 'privacy', de: 'datenschutz', fr: 'confidentialite', es: 'privacidad' },
    'datenschutz': { it: 'privacy', en: 'privacy', de: 'datenschutz', fr: 'confidentialite', es: 'privacidad' },
    'confidentialite': { it: 'privacy', en: 'privacy', de: 'datenschutz', fr: 'confidentialite', es: 'privacidad' },
    'privacidad': { it: 'privacy', en: 'privacy', de: 'datenschutz', fr: 'confidentialite', es: 'privacidad' },
  };

  return (Object.keys(languages) as Locale[]).map((locale) => {
    const parts = restPath.split('/');
    const translatedParts = parts.map(part => slugMap[part]?.[locale] ?? part);
    const translatedPath = translatedParts.join('/');
    return {
      locale,
      url: `/${locale}${translatedPath ? `/${translatedPath}` : ''}`,
    };
  });
}

export const featureSlugMap: Record<Locale, Record<string, string>> = {
  it: {
    'tablet-checkout': 'tablet-checkout',
    'qr-code': 'qr-code',
    'dashboard': 'dashboard',
    'distribuzione': 'distribuzione',
    'report-fiscali': 'report-fiscali',
    'integrazione-passepartout': 'integrazione-passepartout',
    'feedback-ospiti': 'feedback-ospiti',
    'sicurezza': 'sicurezza',
  },
  en: {
    'tablet-checkout': 'tablet-checkout',
    'qr-code': 'qr-code',
    'dashboard': 'dashboard',
    'distribution': 'distribution',
    'fiscal-reports': 'fiscal-reports',
    'passepartout-integration': 'passepartout-integration',
    'guest-feedback': 'guest-feedback',
    'security': 'security',
  },
  de: {
    'tablet-checkout': 'tablet-checkout',
    'qr-code': 'qr-code',
    'dashboard': 'dashboard',
    'verteilung': 'verteilung',
    'steuerberichte': 'steuerberichte',
    'passepartout-integration': 'passepartout-integration',
    'gaestefeedback': 'gaestefeedback',
    'sicherheit': 'sicherheit',
  },
  fr: {
    'tablet-checkout': 'tablet-checkout',
    'qr-code': 'qr-code',
    'dashboard': 'dashboard',
    'distribution': 'distribution',
    'rapports-fiscaux': 'rapports-fiscaux',
    'integration-passepartout': 'integration-passepartout',
    'feedback-clients': 'feedback-clients',
    'securite': 'securite',
  },
  es: {
    'tablet-checkout': 'tablet-checkout',
    'qr-code': 'qr-code',
    'dashboard': 'dashboard',
    'distribucion': 'distribucion',
    'informes-fiscales': 'informes-fiscales',
    'integracion-passepartout': 'integracion-passepartout',
    'feedback-huespedes': 'feedback-huespedes',
    'seguridad': 'seguridad',
  },
};
