import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Welcome to My Next.js App</h1>

      <Link href="/game/station"> Station </Link>
      <Link href="/game/player"> Player </Link>
    </main>
  );
}
