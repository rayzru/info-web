import { Search } from "lucide-react";

import { cn } from "~/lib/utils";

import { Button } from "./ui/button";

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
          "bg-muted/50 relative m-auto mx-6 hidden h-8 justify-start rounded-[0.5rem] text-sm font-normal shadow-none sm:pr-12 md:flex md:w-0 lg:w-full",
        )}
        // onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Поиск...</span>
        <kbd className="bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    </>
  );
}
