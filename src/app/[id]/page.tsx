import { notFound } from 'next/navigation';

import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import data from '@/data';

import styles from './page.module.scss';
interface Props {
  params: {
    id: string;
  },
  searchParams?: {
    search?: string;
  };
}

export async function generateStaticParams() {
  return data.map(({ id }) => ({ id }));
}

export default async function Page({ params }: Props) {
  const info = data.find(el => el.id === params.id);
  if (!info) {
    notFound();
  }

  const subtitle = [info.subtitle].filter(Boolean);

  return (
    <main className={ styles.main }>
      <Header
        logo={ info.logo }
        title={ info.title }
        subtitle={ subtitle as string[] }
        showSettingsButton={ false }
        showBack={ true }
      />
      <Card key={ info.id } info={ info } singleCard={ true } />
      {/* <Map className={ styles.map } /> */ }
    </main >
  );


}
