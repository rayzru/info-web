import { notFound } from 'next/navigation';

import { Header } from '@/components/Header';
import { InfoCard } from '@/components/InfoCard';
import data from '@/data';
import { pick } from '@/helpers';
import { GroupInfo } from '@/types';

interface Props {
  params: {
    parts: [
      id: string,
      info?: keyof GroupInfo,
      num?: string
    ];
  },
  searchParams?: {
    search?: string;
  };
}

const mappableProps = [
  'addresses',
  'phones',
  'messengers',
  'urls'
] as (keyof GroupInfo)[];

export async function generateStaticParams() {

  return data.reduce(
    (acc: Props['params'][], group: GroupInfo) => {
      acc.push({ parts: [group.id] });
      for (const props of mappableProps) {
        if (group[props] && (group[props] as unknown[]).length) {
          acc.push({ parts: [group.id, props] });
          for (let i = 0; i < (group[props] as unknown[]).length; i++) {
            acc.push({ parts: [group.id, props, `${i + 1}`] });
          }
        }
      }
      return acc;
    },
    []
  );
}

export default async function Page({ params: { parts: [id, group, num] } }: Readonly<Props>) {
  const picked = data.find(el => el.id === id);
  if (!picked) {
    notFound();
  }

  let info: GroupInfo = {
    ...pick<GroupInfo, keyof GroupInfo>(picked, 'id', 'title', 'subtitle', 'logo')
  };

  if (group && mappableProps.includes(group)) {
    for (const g of mappableProps) {
      if (g !== group) {
        delete picked?.[g];
      }
    }
    if (num && picked[group] && (picked[group] as []).length) {
      info = {
        ...info,
        [group]: [(picked[group] as unknown[])[Number(num) - 1]]
      };
    } else {
      info = {
        ...info,
        [group]: picked[group]
      };
    }
  } else {
    info = picked;
  }

  const subtitle = [info.subtitle].filter(Boolean);

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
      <InfoCard key={ info.id } info={ info } singleCard={ true } skipCopy={ true } style={ { margin: '0 24px' } } />
    </main >
  );


}
