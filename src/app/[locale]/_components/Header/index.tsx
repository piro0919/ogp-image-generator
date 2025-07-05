import NoSSR from "@mpth/react-no-ssr";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { Nunito_Sans } from "next/font/google";
import { FaMoon, FaSun } from "react-icons/fa";
import { GiEarthAmerica, GiJapan } from "react-icons/gi";
import Spacer from "react-spacer";
import { usePathname, useRouter } from "@/i18n/navigation";
import styles from "./style.module.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
});

export default function Header(): React.JSX.Element {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  return (
    <header className={styles.header}>
      <h1 className={clsx(nunitoSans.className, styles.h1)}>
        OGP Image Generator
      </h1>
      <Spacer grow={1} />
      {locale === "en" ? (
        <button
          onClick={() =>
            router.replace(pathname, {
              locale: "ja",
            })
          }
        >
          <GiEarthAmerica size={24} />
        </button>
      ) : (
        <button
          onClick={() =>
            router.replace(pathname, {
              locale: "en",
            })
          }
        >
          <GiJapan size={24} />
        </button>
      )}
      <NoSSR>
        {theme === "dark" ? (
          <button onClick={() => setTheme("light")}>
            <FaMoon size={24} />
          </button>
        ) : (
          <button onClick={() => setTheme("dark")}>
            <FaSun size={24} />
          </button>
        )}
      </NoSSR>
    </header>
  );
}
