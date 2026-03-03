import { useState, useRef, useEffect } from 'react';

const langFlags: Record<string, string> = {
  it: '🇮🇹',
  en: '🇬🇧',
  de: '🇩🇪',
  fr: '🇫🇷',
  es: '🇪🇸',
};

const langNames: Record<string, string> = {
  it: 'Italiano',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
};

// Maps slug segments between locales
const slugMaps: Record<string, Record<string, string>> = {
  funzionalita: 'features', features: 'features', funktionen: 'features', fonctionnalites: 'features', funcionalidades: 'features',
  prezzi: 'pricing', pricing: 'pricing', preise: 'pricing', tarifs: 'pricing', precios: 'pricing',
  'chi-siamo': 'about', about: 'about', 'ueber-uns': 'about', 'a-propos': 'about', nosotros: 'about',
  contatti: 'contact', contact: 'contact', kontakt: 'contact', contacto: 'contact',
  privacy: 'privacy', datenschutz: 'privacy', confidentialite: 'privacy', privacidad: 'privacy',
  demo: 'demo',
};

const reverseMap: Record<string, Record<string, string>> = {
  features: { it: 'funzionalita', en: 'features', de: 'funktionen', fr: 'fonctionnalites', es: 'funcionalidades' },
  pricing: { it: 'prezzi', en: 'pricing', de: 'preise', fr: 'tarifs', es: 'precios' },
  about: { it: 'chi-siamo', en: 'about', de: 'ueber-uns', fr: 'a-propos', es: 'nosotros' },
  contact: { it: 'contatti', en: 'contact', de: 'kontakt', fr: 'contact', es: 'contacto' },
  privacy: { it: 'privacy', en: 'privacy', de: 'datenschutz', fr: 'confidentialite', es: 'privacidad' },
  demo: { it: 'demo', en: 'demo', de: 'demo', fr: 'demo', es: 'demo' },
};

interface Props {
  locale: string;
  currentPath: string;
}

export default function LanguageSelector({ locale, currentPath }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getLocalizedPath = (targetLocale: string): string => {
    const segments = currentPath.split('/').filter(Boolean);
    // Remove current locale
    const rest = segments.slice(1);
    // Translate each segment
    const translated = rest.map(seg => {
      const canonical = slugMaps[seg];
      if (canonical && reverseMap[canonical]?.[targetLocale]) {
        return reverseMap[canonical][targetLocale];
      }
      return seg;
    });
    return `/${targetLocale}/${translated.join('/')}${translated.length ? '/' : ''}`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-sm rounded-lg text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-navy-800 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={locale === 'it' ? 'Lingua' : locale === 'de' ? 'Sprache' : locale === 'fr' ? 'Langue' : locale === 'es' ? 'Idioma' : 'Language'}
      >
        <span className="text-base">{langFlags[locale]}</span>
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1 w-40 py-1 bg-white dark:bg-navy-900 rounded-lg shadow-lg border border-stone-200 dark:border-navy-700 z-50"
          role="listbox"
          aria-label="Language"
        >
          {Object.entries(langNames).map(([code, name]) => (
            <a
              key={code}
              href={getLocalizedPath(code)}
              className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                code === locale
                  ? 'text-teal-700 bg-teal-50 dark:text-teal-400 dark:bg-teal-900/20 font-medium'
                  : 'text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-navy-800'
              }`}
              role="option"
              aria-selected={code === locale}
              onClick={() => setIsOpen(false)}
            >
              <span>{langFlags[code]}</span>
              <span>{name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
