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

export function ArticleWithNav({
  title,
  description,
  sections,
  children,
}: ArticleWithNavProps) {
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
        <article className="flex-1 min-w-0 max-w-prose">
          <header className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </header>
          {children}
        </article>

        {/* Right navigation */}
        <aside className="hidden md:block w-48 shrink-0">
          <nav className="sticky top-6">
            <p className="text-xs text-muted-foreground font-medium mb-3 uppercase tracking-wide">
              На странице
            </p>
            <ul className="space-y-1">
              {sections.map(({ id, title }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className={cn(
                      "text-sm text-left w-full px-3 py-1.5 rounded-md transition-colors",
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
