// eslint-disable-next-line filenames/match-exported
import { Analytics } from "@vercel/analytics/next";
import { type Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Noto_Sans_JP } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  languageAlternates,
  localePath,
  ogAlternateLocales,
  ogLocale,
} from "@/i18n/urls";
import Layout from "./_components/Layout";
import "@djthoms/pretty-checkbox";
import "react-tooltip/dist/react-tooltip.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const APP_NAME = "OGP ImgGen";
  // 日本語で探す人は「OGP画像」と打つ。title を英語のままにすると ja が拾われない。
  const APP_DEFAULT_TITLE = t("title");
  const APP_TITLE_TEMPLATE = `%s - ${APP_DEFAULT_TITLE}`;
  // ホーム画面に並ぶ名前は言語で変えない。入れ直しになる
  const APP_INSTALLED_TITLE = "OGP Image Generator";
  const APP_DESCRIPTION = t("description");
  const path = localePath(locale);

  return {
    // localePrefix が as-needed なので、既定ロケールだけ接頭辞が付かない。
    // canonical と hreflang が無いと en と ja が重複ページ扱いになる。
    alternates: {
      canonical: path,
      languages: languageAlternates(),
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default" as const,
      title: APP_INSTALLED_TITLE,
      // startUpImage: [],
    },
    applicationName: APP_NAME,
    description: APP_DESCRIPTION,
    formatDetection: {
      telephone: false,
    },
    metadataBase: new URL("https://ogpimggen.kkweb.io"),
    openGraph: {
      alternateLocale: ogAlternateLocales(locale),
      description: APP_DESCRIPTION,
      locale: ogLocale(locale),
      siteName: APP_NAME,
      title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
      },
      type: "website" as const,
      url: path,
    },
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    twitter: {
      card: "summary_large_image" as const,
      description: APP_DESCRIPTION,
      title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>): Promise<React.JSX.Element> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body className={notoSansJP.className}>
        <NextIntlClientProvider>
          <ThemeProvider enableSystem={false}>
            <Layout>{children}</Layout>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
