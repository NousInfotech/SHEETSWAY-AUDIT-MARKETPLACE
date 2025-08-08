import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/lib/font'; 
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';
import { cn } from '@/lib/utils'; 
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import './theme.css';

import "@fontsource/great-vibes";

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export const metadata: Metadata = {
  title: {
    template: 'Sheetsway | %s',
    default: 'Sheetsway'
  },
  description: 'The premier audit marketplace for modern businesses.',
  icons: {
    icon: '/favicon/favicon.svg',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png'
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: META_THEME_COLORS.light },
    { media: '(prefers-color-scheme: dark)', color: META_THEME_COLORS.dark }
  ]
};

// This script prevents the "theme flicker" by applying the correct theme
// before the page is fully rendered.
const ThemeScript = () => {
  const script = `
    (function() {
      function getInitialColorMode() {
        const persistedColorPreference = window.localStorage.getItem('theme');
        const hasPersistedPreference = typeof persistedColorPreference === 'string';
        if (hasPersistedPreference) {
          return persistedColorPreference;
        }
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        const hasMediaQueryPreference = typeof mql.matches === 'boolean';
        if (hasMediaQueryPreference) {
          return mql.matches ? 'dark' : 'light';
        }
        return 'light'; // Your default theme
      }
      const colorMode = getInitialColorMode();
      if (colorMode === 'dark') {
        document.documentElement.classList.add('dark');
      }
    })()
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isScaled = activeThemeValue?.endsWith('-scaled');

  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          // <-- Using cn() to combine classes
          'bg-background overflow-hidden overscroll-none font-sans antialiased',
          fontVariables, // <-- Applying the CSS font variable to the body
          activeThemeValue ? `theme-${activeThemeValue}` : '',
          isScaled ? 'theme-scaled' : ''
        )}
      >
        {/* Flicker-prevention script */}
        {/* <ThemeScript />  */}
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <Providers activeThemeValue={activeThemeValue as string}>
              <Toaster />
              {children}
            </Providers>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
