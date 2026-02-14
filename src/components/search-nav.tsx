import { Search } from "lucide-react";
import dynamic from "next/dynamic";

import { cn } from "~/lib/utils";

import { Button } from "./ui/button";

// Lazy load the keyboard shortcut component (client-only, OS detection)
const KeyboardShortcutInline = dynamic(
  () => import("./keyboard-shortcut").then((mod) => mod.KeyboardShortcutInline),
  { ssr: false }
);

export async function SearchNav() {
  return (
    <>
      <Button className="md:hidden" disabled size={"icon"} variant={"ghost"}>
        <Search />
      </Button>

      <Button
        disabled
        variant="outline"
        className={cn(
          "bg-muted/50 relative m-auto mx-6 hidden h-8 justify-start rounded-[0.5rem] text-sm font-normal shadow-none sm:pr-12 md:flex md:w-0 lg:w-full"
        )}
        // onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Поиск...</span>
        <div className="absolute right-[0.3rem] top-[0.3rem] hidden sm:block">
          <KeyboardShortcutInline shortcutKey="K" />
        </div>
      </Button>
    </>
  );
}
