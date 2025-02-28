
import { cn } from "@sr2/lib/utils";
import { Button } from "@sr2/components/ui/button";

import { TelegramLogo } from "./social-icons/telegram";
import { WhatsappLogo } from "./social-icons/whatsapp";
import Link from "next/link";

interface ChatButtonProps {
  url: string;
  title: string;
  description?: string;
  type: "telegram" | "whatsapp";
  className?: string;
}

export async function ChatButton({
  className,
  title,
  description,
  url,
  type,
}: ChatButtonProps) {
  return (
    <Link href={url} target="blank" passHref>
      <Button
        variant="outline"
        type="button"
        className={cn("w-full min-h-[65px] rounded-md", className)}
      >
        <div className="flex flex-row gap-2 [&>svg]:size-8 items-center">
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
