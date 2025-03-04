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
      <article>
        <header>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </header>
        <main>{children}</main>
      </article>
    </ResponsiveWrapper>
  );
}
