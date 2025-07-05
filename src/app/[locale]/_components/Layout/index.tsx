"use client";
import { type ReactNode } from "react";
import useShowWindowSize from "use-show-window-size";
import Footer from "../Footer";
import Header from "../Header";
import styles from "./style.module.css";

export type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  useShowWindowSize({
    disable: process.env.NODE_ENV === "production",
  });

  return (
    <div className={styles.container}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
