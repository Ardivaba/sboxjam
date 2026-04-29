import type { LexicalNode, LexicalRoot } from "@/lib/types";

// Lexical text format bitmask — see lexical/packages/lexical/src/LexicalConstants.ts
const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 1 << 1;
const FORMAT_STRIKETHROUGH = 1 << 2;
const FORMAT_UNDERLINE = 1 << 3;
const FORMAT_CODE = 1 << 4;

function renderText(node: LexicalNode, key: string): React.ReactNode {
  const format = typeof node.format === "number" ? node.format : 0;
  let el: React.ReactNode = node.text ?? "";

  if (format & FORMAT_CODE) {
    el = <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[0.9em] font-mono text-text-bright">{el}</code>;
  }
  if (format & FORMAT_BOLD) el = <strong>{el}</strong>;
  if (format & FORMAT_ITALIC) el = <em>{el}</em>;
  if (format & FORMAT_UNDERLINE) el = <u>{el}</u>;
  if (format & FORMAT_STRIKETHROUGH) el = <s>{el}</s>;

  return <span key={key}>{el}</span>;
}

function renderChildren(children: LexicalNode[] | undefined, prefix: string): React.ReactNode[] {
  if (!children) return [];
  return children.map((c, i) => renderNode(c, `${prefix}-${i}`));
}

function renderNode(node: LexicalNode, key: string): React.ReactNode {
  switch (node.type) {
    case "text":
      return renderText(node, key);

    case "linebreak":
      return <br key={key} />;

    case "paragraph":
      return (
        <p key={key} className="my-4 leading-relaxed text-text-bright">
          {renderChildren(node.children, key)}
        </p>
      );

    case "heading": {
      const tag = (node.tag || "h2").toLowerCase();
      const sizes: Record<string, string> = {
        h1: "mt-10 mb-4 text-3xl font-bold text-white",
        h2: "mt-10 mb-3 text-2xl font-semibold text-white",
        h3: "mt-8 mb-2 text-xl font-semibold text-white",
        h4: "mt-6 mb-2 text-lg font-semibold text-white",
        h5: "mt-4 mb-2 text-base font-semibold text-white",
        h6: "mt-4 mb-2 text-sm font-semibold text-white uppercase tracking-wider",
      };
      const Tag = tag as keyof React.JSX.IntrinsicElements;
      return (
        <Tag key={key} className={sizes[tag] || sizes.h2}>
          {renderChildren(node.children, key)}
        </Tag>
      );
    }

    case "quote":
      return (
        <blockquote
          key={key}
          className="my-6 border-l-2 border-white/20 pl-4 italic text-text-muted"
        >
          {renderChildren(node.children, key)}
        </blockquote>
      );

    case "list": {
      const Tag = node.listType === "number" ? "ol" : "ul";
      const cls =
        node.listType === "number"
          ? "my-4 list-decimal pl-6 space-y-1.5 text-text-bright marker:text-text-muted"
          : "my-4 list-disc pl-6 space-y-1.5 text-text-bright marker:text-text-muted";
      return (
        <Tag key={key} className={cls}>
          {renderChildren(node.children, key)}
        </Tag>
      );
    }

    case "listitem":
      return <li key={key}>{renderChildren(node.children, key)}</li>;

    case "code": {
      const flatten = (n: LexicalNode): string => {
        if (n.type === "linebreak") return "\n";
        if (n.text !== undefined) return n.text;
        if (n.children) return n.children.map(flatten).join("");
        return "";
      };
      const code = node.children ? node.children.map(flatten).join("") : "";
      return (
        <pre
          key={key}
          className="my-5 overflow-x-auto rounded-lg border border-white/[0.06] bg-black/40 p-4 text-sm leading-relaxed"
        >
          <code className="font-mono text-text-bright">{code}</code>
        </pre>
      );
    }

    case "link":
    case "autolink": {
      const url = node.fields?.url || node.url || "#";
      const newTab = node.fields?.newTab ?? !url.startsWith("/");
      return (
        <a
          key={key}
          href={url}
          {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-warning underline-offset-4 hover:underline"
        >
          {renderChildren(node.children, key)}
        </a>
      );
    }

    case "horizontalrule":
      return <hr key={key} className="my-8 border-white/[0.06]" />;

    case "upload": {
      const v = node.value;
      const url = typeof v === "object" && v ? v.url : undefined;
      const alt =
        (typeof v === "object" && v && v.alt) || node.altText || "";
      if (!url) return null;
      return (
        <figure key={key} className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={alt}
            className="w-full rounded-lg border border-white/[0.06]"
            loading="lazy"
          />
          {alt && (
            <figcaption className="mt-2 text-center text-sm text-text-muted">{alt}</figcaption>
          )}
        </figure>
      );
    }

    default:
      return node.children ? <>{renderChildren(node.children, key)}</> : null;
  }
}

export function LexicalRenderer({ content }: { content: LexicalRoot | null | undefined }) {
  if (!content?.root?.children) return null;
  return <>{renderChildren(content.root.children, "n")}</>;
}
