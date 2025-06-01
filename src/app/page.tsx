import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Welcome to My Next.js App</h1>

      <a href="/game/station"> Station </a>
      <a href="/game/player"> Player </a>
    </main>
  );
}
