import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>Потрачено</h2>
      <p>Вы зашли в тупиковую ветвь интернета.</p>
      <Link href="/">На главную</Link>
    </div>
  );
}
