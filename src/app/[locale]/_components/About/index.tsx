import { getTranslations } from "next-intl/server";
import styles from "./style.module.css";

export default async function About(): Promise<React.JSX.Element> {
  const t = await getTranslations("About");

  return (
    // 折りたたんであっても HTML には出る。検索エンジンが読むのはこの本文
    <details className={styles.details}>
      <summary className={styles.summary}>{t("title")}</summary>
      <div className={styles.body}>
        <p className={styles.paragraph}>{t("summary")}</p>
        <section>
          <h2 className={styles.heading}>{t("filesTitle")}</h2>
          <ul className={styles.list}>
            <li>{t("file1")}</li>
            <li>{t("file2")}</li>
            <li>{t("file3")}</li>
            <li>{t("file4")}</li>
          </ul>
        </section>
        <section>
          <h2 className={styles.heading}>{t("stepsTitle")}</h2>
          <ol className={styles.orderedList}>
            <li>{t("step1")}</li>
            <li>{t("step2")}</li>
            <li>{t("step3")}</li>
            <li>{t("step4")}</li>
          </ol>
        </section>
      </div>
    </details>
  );
}
