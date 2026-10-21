import {
  Architects_Daughter,
  DM_Sans,
  Fira_Code,
  Geist,
  Geist_Mono,
  Google_Sans_Flex,
  Instrument_Sans,
  Inter,
  JetBrains_Mono,
  Merriweather,
  Mulish,
  Playfair_Display,
  Noto_Sans_Mono,
  Outfit,
  Source_Code_Pro,
  Space_Mono
} from 'next/font/google';

import { cn } from '@/lib/utils';

// Only the default theme's font (Geist, see DEFAULT_THEME) is preloaded. The
// others load when a theme that uses them is picked, so pages don't download
// ~500 KB of fonts up front.
const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
});

const fontMono = Geist_Mono({
  preload: false,
  subsets: ['latin'],
  variable: '--font-mono'
});

const fontGoogleSansFlex = Google_Sans_Flex({
  preload: false,
  subsets: ['latin'],
  variable: '--font-google-sans-flex'
});

const fontSourceCodePro = Source_Code_Pro({
  preload: false,
  subsets: ['latin'],
  variable: '--font-source-code-pro'
});

const fontInstrument = Instrument_Sans({
  preload: false,
  subsets: ['latin'],
  variable: '--font-instrument'
});

const fontNotoMono = Noto_Sans_Mono({
  preload: false,
  subsets: ['latin'],
  variable: '--font-noto-mono'
});

const fontMullish = Mulish({
  preload: false,
  subsets: ['latin'],
  variable: '--font-mullish'
});

const fontInter = Inter({
  preload: false,
  subsets: ['latin'],
  variable: '--font-inter'
});

const fontArchitectsDaughter = Architects_Daughter({
  preload: false,
  subsets: ['latin'],
  weight: '400',
  variable: '--font-architects-daughter'
});

const fontDMSans = DM_Sans({
  preload: false,
  subsets: ['latin'],
  variable: '--font-dm-sans'
});

const fontFiraCode = Fira_Code({
  preload: false,
  subsets: ['latin'],
  variable: '--font-fira-code'
});

const fontOutfit = Outfit({
  preload: false,
  subsets: ['latin'],
  variable: '--font-outfit'
});

const fontSpaceMono = Space_Mono({
  preload: false,
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono'
});

const fontJetBrainsMono = JetBrains_Mono({
  preload: false,
  subsets: ['latin'],
  variable: '--font-jetbrains-mono'
});

const fontMerriweather = Merriweather({
  preload: false,
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather'
});

const fontPlayfairDisplay = Playfair_Display({
  preload: false,
  subsets: ['latin'],
  variable: '--font-playfair-display'
});

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontGoogleSansFlex.variable,
  fontSourceCodePro.variable,
  fontInstrument.variable,
  fontNotoMono.variable,
  fontMullish.variable,
  fontInter.variable,
  fontArchitectsDaughter.variable,
  fontDMSans.variable,
  fontFiraCode.variable,
  fontOutfit.variable,
  fontSpaceMono.variable,
  fontJetBrainsMono.variable,
  fontMerriweather.variable,
  fontPlayfairDisplay.variable
);
