import ResponsiveWrapper from "./responsive-wrapper";

import "~/styles/globals.css";

interface ArticleLayoutProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function ArticleLayout({
  children,
  title,
  description,
}: Readonly<ArticleLayoutProps>) {
  return (
    <ResponsiveWrapper>
      <article className="max-w-prose">
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </header>
        <main className="prose prose-slate dark:prose-invert prose-p:text-foreground prose-p:leading-relaxed prose-li:text-foreground">
          {children}
        </main>
      </article>
    </ResponsiveWrapper>
  );
}
