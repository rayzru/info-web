import Link from "next/link";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { TelegramLogo } from "./icons/telegram";
import { WhatsappLogo } from "./icons/whatsapp";

interface ChatButtonProps {
  url: string;
  title: string;
  description?: string;
  type: "telegram" | "whatsapp";
  className?: string;
}

export async function ChatButton({ className, title, description, url, type }: ChatButtonProps) {
  return (
    <Link href={url} target="blank" passHref>
      <Button
        variant="outline"
        type="button"
        className={cn("min-h-[65px] w-full rounded-md", className)}
      >
        <div className="flex flex-row items-center gap-2 [&>svg]:size-8">
          {type === "telegram" && <TelegramLogo />}
          {type === "whatsapp" && <WhatsappLogo />}
          <div className="flex flex-col text-left">
            <p>{title}</p>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </Button>
    </Link>
  );
}
