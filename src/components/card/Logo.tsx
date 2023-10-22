import { PropsWithStyles } from '@/types';

export type LogoType = 'msk' | 'sr2' | 'root' | 'teploservice' | 'tns' | 'gis';

interface Props extends PropsWithStyles {
    type: LogoType;
    alt?: string;
}

export const Logo = ({ type, className, alt }: Props) => {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            className={ className }
            src={ `/logos/${type}.svg` }
            alt={ alt }
        />
    );
};