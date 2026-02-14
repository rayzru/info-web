"use client";

import { cn } from "~/lib/utils";

/**
 * VK ID Stack - при наведении раскрывает Mail.ru и OK из-под VK
 * VK по центру, Mail.ru выезжает влево, OK выезжает вправо
 *
 * ВАЖНО: Родительская кнопка должна иметь класс "group/vk"
 */
export function VkIdStack({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-9 items-center justify-center", className)}>
      {/* Mail.ru - выезжает влево */}
      <img
        src="/logos/mailru.svg"
        alt=""
        className="absolute size-6 scale-75 rounded-full opacity-0 shadow-sm transition-all duration-300 ease-out group-hover/vk:-translate-x-6 group-hover/vk:scale-100 group-hover/vk:opacity-100"
        aria-hidden="true"
      />

      {/* VK - центр, всегда виден */}
      <img
        src="/logos/vk.svg"
        alt="VK ID"
        className="relative z-10 size-9 rounded-full shadow-md transition-transform duration-300"
      />

      {/* OK - выезжает вправо */}
      <img
        src="/logos/ok.svg"
        alt=""
        className="absolute size-6 scale-75 rounded-full opacity-0 shadow-sm transition-all duration-300 ease-out group-hover/vk:translate-x-6 group-hover/vk:scale-100 group-hover/vk:opacity-100"
        aria-hidden="true"
      />
    </div>
  );
}
