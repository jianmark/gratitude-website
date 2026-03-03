import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gratitude.esseginformatica.it',
  integrations: [
    react(),
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'it',
        locales: {
          it: 'it-IT',
          en: 'en-GB',
          de: 'de-DE',
          fr: 'fr-FR',
          es: 'es-ES',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en', 'de', 'fr', 'es'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  vite: {
    ssr: {
      noExternal: ['lucide-react'],
    },
  },
});
