import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './spendlio.css';
import { ThemeProvider } from './_lib/theme-context';
import { LanguageProvider } from './_lib/i18n';
import { AuthProvider } from './_lib/auth-context';
import { DemoBar } from './_components/demo-bar';

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--sp-font-sans' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--sp-font-display',
});

export const metadata: Metadata = {
  title: 'Spendlio – live demo',
  description: 'Interactive demo of Spendlio, an AI-powered expense tracker. Runs in the browser on sample data.',
};

export default function SpendlioDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <LanguageProvider>
        <AuthProvider>
          <DemoBar />
          {children}
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
