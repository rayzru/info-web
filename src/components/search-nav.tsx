import { cn } from "@sr2/lib/utils";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

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
          "relative hidden md:flex mx-6 h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64 m-auto"
        )}
        // onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Поиск по справочнику...</span>
        <span className="inline-flex lg:hidden">Поиск...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    </>
  );
}
