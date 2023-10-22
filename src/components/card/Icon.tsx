import { PropsWithStyles } from '@/types';

export type IconType =
    | 'geo'
    | 'phone'
    | 'chat'
    | 'copy'
    | 'yandex-maps'
    | 'telegram'
    | 'whatsapp';

interface Props extends PropsWithStyles {
    type: IconType;
    alt?: string;
}

export const Icon = ({ type, className, alt }: Props) => {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <svg className={ className } width={ 16 } height={ 16 }>
            <use href={ `/icons/icons.svg#${type}` } />
        </svg>
    );
};