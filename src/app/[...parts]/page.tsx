import { notFound } from 'next/navigation';

import { Header } from '@/components/Header';
import { InfoCard } from '@/components/InfoCard';
import data from '@/data';
import { GroupInfo } from '@/types';

interface Props {
  params: {
    parts: string[];
  }[],
  searchParams?: {
    search?: string;
  };
}

export async function generateStaticParams() {

  const mappableProps = [
    'addresses' as keyof GroupInfo,
    'phones' as keyof GroupInfo,
    'messengers' as keyof GroupInfo,
    'urls' as keyof GroupInfo
  ];
  return data.reduce(
    (acc: Props['params'], { id, ...groupData }: GroupInfo) => {
      acc.push({ parts: [id] });
      for (const props in mappableProps) {
        if (groupData[props as keyof GroupInfo]) {
          acc.push({ parts: [id, props] });
        }
      }
      return acc;
    },
    []
  );
}

export default async function Page({ params }: Readonly<Props>) {
  console.log(params);
  const info = data.find(el => el.id === params.parts[0]);
  if (!info) {
    notFound();
  }

  const subtitle = [info.subtitle].filter(Boolean);

  // const ['phones']

  return (
    <main>
      <Header
        logo={ info.logo }
        title={ info.title }
        subtitle={ subtitle as string[] }
        showSettingsButton={ false }
        showSearch={ false }
        showBack={ true }
      />
      <InfoCard key={ info.id } info={ info } singleCard={ true } style={ { margin: '0 24px' } } />
    </main >
  );


}
