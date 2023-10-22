'use client';

import { MessengerInfo, PhoneInfo } from '@/types';
import { Action, Base } from '@/components/card/Base';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useRef } from 'react';
import { IconType } from './Icon';


interface Props extends MessengerInfo {
    title: string;
}

export const Messenger = ({ mesengerType, link, ...props }: Props) => {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const [, copy] = useCopyToClipboard();

    const actions: Action[] = [
        {
            icon: mesengerType as IconType,
            label: 'Открыть',
            callback: () => { linkRef?.current?.click(); }
        },
        {
            icon: 'copy',
            label: 'Скопировать',
            callback: () => copy(link)
        },
    ];

    return (
        <Base icon={ 'phone' } actions={ actions } { ...props } >
            { link && (
                <>
                    <a ref={ linkRef } href={ link }>{ link }</a>
                </>
            ) }
        </Base>
    );

};