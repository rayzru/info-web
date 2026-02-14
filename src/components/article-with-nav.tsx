"use client";

import { useEffect, useState } from "react";

import { cn } from "~/lib/utils";

interface Section {
  id: string;
  title: string;
}

interface ArticleWithNavProps {
  title: string;
  description?: string;
  sections: Section[];
  children: React.ReactNode;
}

export function ArticleWithNav({ title, description, sections, children }: ArticleWithNavProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="py-6">
      <div className="flex gap-8">
        {/* Main content */}
        <article className="min-w-0 max-w-prose flex-1">
          <header className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </header>
          {children}
        </article>

        {/* Right navigation */}
        <aside className="hidden w-48 shrink-0 md:block">
          <nav className="sticky top-6">
            <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wide">
              На странице
            </p>
            <ul className="space-y-1">
              {sections.map(({ id, title }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className={cn(
                      "w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                      activeSection === id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
