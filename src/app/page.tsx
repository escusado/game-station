import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Welcome to My Next.js App</h1>

      <Link href="/game/station"> Station </Link>
      <Link href="/game/player"> Player </Link>
    </main>
  );
}
