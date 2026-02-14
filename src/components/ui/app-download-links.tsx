"use client";

import { cn } from "~/lib/utils";

/**
 * App store types
 */
type AppStore = "appstore" | "googleplay" | "rustore";

interface AppLink {
  store: AppStore;
  url: string;
}

interface AppDownloadLinksProps {
  /**
   * App name for display
   */
  appName: string;
  /**
   * Links to app stores
   */
  links: readonly AppLink[];
  /**
   * Optional className
   */
  className?: string;
  /**
   * Show store name labels
   */
  showLabels?: boolean;
  /**
   * Layout direction
   */
  direction?: "horizontal" | "vertical";
  /**
   * Button size
   */
  size?: "sm" | "md" | "lg";
}

const STORE_CONFIG: Record<AppStore, { label: string; icon: React.ReactNode; bgColor: string }> = {
  appstore: {
    label: "App Store",
    bgColor: "bg-black hover:bg-gray-800",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  googleplay: {
    label: "Google Play",
    bgColor: "bg-black hover:bg-gray-800",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
      </svg>
    ),
  },
  rustore: {
    label: "RuStore",
    bgColor: "bg-[#00B4D8] hover:bg-[#0096B4]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
};

const SIZE_CONFIG = {
  sm: {
    button: "px-3 py-1.5 text-xs",
    icon: "h-4 w-4",
  },
  md: {
    button: "px-4 py-2 text-sm",
    icon: "h-5 w-5",
  },
  lg: {
    button: "px-5 py-2.5 text-base",
    icon: "h-6 w-6",
  },
};

/**
 * App Download Links component
 * Shows buttons to download apps from various stores
 */
export function AppDownloadLinks({
  appName,
  links,
  className,
  showLabels = true,
  direction = "horizontal",
  size = "md",
}: AppDownloadLinksProps) {
  const sizeConfig = SIZE_CONFIG[size];

  return (
    <div
      className={cn(
        "flex gap-2",
        direction === "vertical" ? "flex-col" : "flex-row flex-wrap",
        className
      )}
    >
      {links.map(({ store, url }) => {
        const config = STORE_CONFIG[store];
        return (
          <a
            key={store}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg text-white transition-colors",
              config.bgColor,
              sizeConfig.button
            )}
            title={`Скачать ${appName} из ${config.label}`}
          >
            <span className={sizeConfig.icon}>{config.icon}</span>
            {showLabels && (
              <span className="flex flex-col leading-tight">
                <span className="text-[0.65em] opacity-80">Скачать в</span>
                <span className="font-semibold">{config.label}</span>
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}

/**
 * Preset app configurations for common apps
 */
export const APP_PRESETS = {
  vdome: {
    appName: "В доме (VDome)",
    links: [
      {
        store: "appstore" as const,
        url: "https://apps.apple.com/ru/app/в-доме-мтс-домофон/id1453045572",
      },
      {
        store: "googleplay" as const,
        url: "https://play.google.com/store/apps/details?id=ru.mts.vdome",
      },
      {
        store: "rustore" as const,
        url: "https://www.rustore.ru/catalog/app/ru.mts.vdome",
      },
    ],
  },
  dmss: {
    appName: "DMSS",
    links: [
      {
        store: "appstore" as const,
        url: "https://apps.apple.com/ru/app/dmss/id1493268618",
      },
      {
        store: "googleplay" as const,
        url: "https://play.google.com/store/apps/details?id=com.mm.android.direct.gdmss",
      },
      {
        store: "rustore" as const,
        url: "https://www.rustore.ru/catalog/app/com.mm.android.direct.gdmss",
      },
    ],
  },
  hikconnect: {
    appName: "HIK-CONNECT",
    links: [
      {
        store: "appstore" as const,
        url: "https://apps.apple.com/ru/app/hik-connect/id1087104855",
      },
      {
        store: "googleplay" as const,
        url: "https://play.google.com/store/apps/details?id=com.hikvision.hikconnect",
      },
      {
        store: "rustore" as const,
        url: "https://www.rustore.ru/catalog/app/com.hikvision.hikconnect",
      },
    ],
  },
  gosuslugiDom: {
    appName: "Госуслуги Дом",
    links: [
      {
        store: "appstore" as const,
        url: "https://apps.apple.com/ru/app/госуслуги-дом/id1616115234",
      },
      {
        store: "googleplay" as const,
        url: "https://play.google.com/store/apps/details?id=ru.gosuslugi.dom",
      },
      {
        store: "rustore" as const,
        url: "https://www.rustore.ru/catalog/app/ru.gosuslugi.dom",
      },
    ],
  },
  kvartplataOnline: {
    appName: "Квартплата Онлайн",
    links: [
      {
        store: "appstore" as const,
        url: "https://apps.apple.com/ru/app/kvartplata-online/id1069037498",
      },
      {
        store: "googleplay" as const,
        url: "https://play.google.com/store/apps/details?id=ru.kvartplata.client",
      },
      {
        store: "rustore" as const,
        url: "https://www.rustore.ru/catalog/app/ru.kvartplata.client",
      },
    ],
  },
} as const;

/**
 * Shorthand component for preset apps
 */
export function AppDownloadPreset({
  preset,
  ...props
}: {
  preset: keyof typeof APP_PRESETS;
} & Omit<AppDownloadLinksProps, "appName" | "links">) {
  const config = APP_PRESETS[preset];
  return <AppDownloadLinks {...config} {...props} />;
}

export default AppDownloadLinks;
