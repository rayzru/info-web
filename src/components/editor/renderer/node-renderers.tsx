import { type ReactNode } from "react";

import type { JSONContent } from "@tiptap/react";
import Image from "next/image";
import Link from "next/link";

import type {
  HeadingAttrs,
  HighlightAttrs,
  ImageAttrs,
  LinkAttrs,
  MentionAttrs,
  ReferenceCardAttrs,
  YoutubeAttrs,
} from "~/lib/editor";
import { cn } from "~/lib/utils";

// ============================================================================
// Mark Renderers
// ============================================================================

interface MarkRendererProps {
  mark: { type: string; attrs?: Record<string, unknown> };
  children: ReactNode;
}

export function renderMark({ mark, children }: MarkRendererProps): ReactNode {
  switch (mark.type) {
    case "bold":
      return <strong>{children}</strong>;

    case "italic":
      return <em>{children}</em>;

    case "underline":
      return <u>{children}</u>;

    case "strike":
      return <s>{children}</s>;

    case "code":
      return <code className="bg-muted rounded px-1 py-0.5 font-mono text-sm">{children}</code>;

    case "link": {
      const attrs = mark.attrs as LinkAttrs | undefined;
      const href = attrs?.href ?? "#";
      const isExternal = href.startsWith("http");

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:opacity-80"
          >
            {children}
          </a>
        );
      }

      return (
        <Link href={href} className="text-primary underline underline-offset-2 hover:opacity-80">
          {children}
        </Link>
      );
    }

    case "highlight": {
      const attrs = mark.attrs as HighlightAttrs | undefined;
      return (
        <mark
          className="rounded px-0.5"
          style={{ backgroundColor: attrs?.color ?? "hsl(50, 100%, 70%)" }}
        >
          {children}
        </mark>
      );
    }

    case "textStyle": {
      const attrs = mark.attrs as { color?: string } | undefined;
      return <span style={{ color: attrs?.color }}>{children}</span>;
    }

    default:
      return children;
  }
}

// ============================================================================
// Node Renderers
// ============================================================================

interface NodeRendererProps {
  node: JSONContent;
  renderChildren: (children: JSONContent[]) => ReactNode;
}

export function Paragraph({ node, renderChildren }: NodeRendererProps) {
  const textAlign = (node.attrs?.textAlign as string) ?? "left";

  return (
    <p className={cn("mb-4 last:mb-0")} style={{ textAlign: textAlign as any }}>
      {node.content ? renderChildren(node.content) : null}
    </p>
  );
}

export function Heading({ node, renderChildren }: NodeRendererProps) {
  const attrs = node.attrs as HeadingAttrs | undefined;
  const level = attrs?.level ?? 2;
  const textAlign = attrs?.textAlign ?? "left";

  const className = cn("font-semibold", {
    "mb-6 mt-8 text-3xl": level === 1,
    "mb-4 mt-6 text-2xl": level === 2,
    "mb-3 mt-5 text-xl": level === 3,
    "mb-2 mt-4 text-lg": level === 4,
  });

  const style = { textAlign: textAlign as React.CSSProperties["textAlign"] };
  const content = node.content ? renderChildren(node.content) : null;

  switch (level) {
    case 1:
      return (
        <h1 className={className} style={style}>
          {content}
        </h1>
      );
    case 2:
      return (
        <h2 className={className} style={style}>
          {content}
        </h2>
      );
    case 3:
      return (
        <h3 className={className} style={style}>
          {content}
        </h3>
      );
    case 4:
      return (
        <h4 className={className} style={style}>
          {content}
        </h4>
      );
    case 5:
      return (
        <h5 className={className} style={style}>
          {content}
        </h5>
      );
    case 6:
      return (
        <h6 className={className} style={style}>
          {content}
        </h6>
      );
    default:
      return (
        <h2 className={className} style={style}>
          {content}
        </h2>
      );
  }
}

export function BulletList({ node, renderChildren }: NodeRendererProps) {
  return (
    <ul className="mb-4 list-disc space-y-1 pl-6">
      {node.content ? renderChildren(node.content) : null}
    </ul>
  );
}

export function OrderedList({ node, renderChildren }: NodeRendererProps) {
  return (
    <ol className="mb-4 list-decimal space-y-1 pl-6">
      {node.content ? renderChildren(node.content) : null}
    </ol>
  );
}

export function ListItem({ node, renderChildren }: NodeRendererProps) {
  return <li className="[&>p]:mb-0">{node.content ? renderChildren(node.content) : null}</li>;
}

export function Blockquote({ node, renderChildren }: NodeRendererProps) {
  return (
    <blockquote className="border-border text-muted-foreground mb-4 border-l-4 pl-4 italic">
      {node.content ? renderChildren(node.content) : null}
    </blockquote>
  );
}

export function CodeBlock({ node, renderChildren }: NodeRendererProps) {
  const language = (node.attrs?.language as string) ?? "";

  return (
    <pre className="bg-muted mb-4 overflow-x-auto rounded-lg p-4">
      <code className="font-mono text-sm" data-language={language}>
        {node.content ? renderChildren(node.content) : null}
      </code>
    </pre>
  );
}

export function HorizontalRule() {
  return <hr className="border-border my-6" />;
}

export function HardBreak() {
  return <br />;
}

export function ImageNode({ node }: { node: JSONContent }) {
  const attrs = node.attrs as ImageAttrs | undefined;

  if (!attrs?.src) return null;

  // Use next/image for optimized loading if dimensions are known
  if (attrs.width && attrs.height) {
    return (
      <figure className="my-4">
        <Image
          src={attrs.src}
          alt={attrs.alt ?? ""}
          width={attrs.width}
          height={attrs.height}
          className="rounded-lg"
          unoptimized={attrs.src.includes("/uploads/")}
        />
        {attrs.title && (
          <figcaption className="text-muted-foreground mt-2 text-center text-sm">
            {attrs.title}
          </figcaption>
        )}
      </figure>
    );
  }

  // Fallback to img tag for unknown dimensions
  return (
    <figure className="my-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={attrs.src} alt={attrs.alt ?? ""} className="max-w-full rounded-lg" />
      {attrs.title && (
        <figcaption className="text-muted-foreground mt-2 text-center text-sm">
          {attrs.title}
        </figcaption>
      )}
    </figure>
  );
}

export function YoutubeNode({ node }: { node: JSONContent }) {
  const attrs = node.attrs as YoutubeAttrs | undefined;

  if (!attrs?.src) return null;

  // Extract video ID from URL
  const videoId = extractYoutubeId(attrs.src);
  if (!videoId) return null;

  const startParam = attrs.start ? `?start=${attrs.start}` : "";

  return (
    <div className="my-4 aspect-video overflow-hidden rounded-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}${startParam}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

// ============================================================================
// Custom Node Renderers
// ============================================================================

export function MentionNode({ node }: { node: JSONContent }) {
  const attrs = node.attrs as MentionAttrs | undefined;

  if (!attrs) return null;

  return (
    <Link
      href={`/users/${attrs.id}`}
      className="bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center gap-1 rounded px-1.5 py-0.5"
    >
      @{attrs.label}
    </Link>
  );
}

export function ReferenceCardNode({ node }: { node: JSONContent }) {
  const attrs = node.attrs as ReferenceCardAttrs | undefined;

  if (!attrs) return null;

  const href = getReferenceHref(attrs.type, attrs.id);

  return (
    <Link
      href={href}
      className="bg-muted/50 hover:border-primary hover:bg-muted my-2 flex items-center gap-3 rounded-lg border p-3 transition-colors"
    >
      {attrs.image && (
        <Image
          src={attrs.image}
          alt=""
          width={48}
          height={48}
          className="rounded"
          unoptimized={attrs.image.includes("/uploads/")}
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{attrs.title}</p>
        {attrs.description && (
          <p className="text-muted-foreground truncate text-sm">{attrs.description}</p>
        )}
      </div>
    </Link>
  );
}

function getReferenceHref(type: string, id: string): string {
  switch (type) {
    case "article":
      return `/help/${id}`;
    case "faq":
      return `/help/faq/${id}`;
    case "contact":
      return `/contacts/${id}`;
    case "property":
      return `/properties/${id}`;
    case "building":
      return `/buildings/${id}`;
    default:
      return `/${type}/${id}`;
  }
}
