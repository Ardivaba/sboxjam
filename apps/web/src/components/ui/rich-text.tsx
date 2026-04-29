import type { LexicalNode, LexicalRoot } from "@/lib/types";

function renderNode(node: LexicalNode, key: number): React.ReactNode {
  if (node.type === "text") {
    let el: React.ReactNode = node.text || "";
    const format = typeof node.format === "number" ? node.format : 0;
    if (format & 1) el = <strong key={key}>{el}</strong>;
    if (format & 2) el = <em key={key}>{el}</em>;
    if (format & 8) el = <u key={key}>{el}</u>;
    if (format & 16) el = <code key={key} className="bg-white/[0.06] px-1.5 py-0.5 rounded text-sm font-mono text-primary-light">{el}</code>;
    if (format & 4) el = <s key={key}>{el}</s>;
    return el;
  }

  if (node.type === "linebreak") {
    return <br key={key} />;
  }

  const children = node.children?.map((child, i) => renderNode(child, i));

  if (node.type === "paragraph") {
    if (!children || children.length === 0) return <br key={key} />;
    return <p key={key} className="mb-4 last:mb-0 leading-relaxed">{children}</p>;
  }

  if (node.type === "heading") {
    const tag = node.tag || "h2";
    const styles: Record<string, string> = {
      h1: "text-2xl font-bold text-white mt-8 mb-4",
      h2: "text-xl font-bold text-white mt-8 mb-3",
      h3: "text-lg font-semibold text-white mt-6 mb-2",
      h4: "text-base font-semibold text-text-bright mt-4 mb-2",
    };
    const cls = styles[tag] || styles.h2;
    if (tag === "h1") return <h1 key={key} className={cls}>{children}</h1>;
    if (tag === "h3") return <h3 key={key} className={cls}>{children}</h3>;
    if (tag === "h4") return <h4 key={key} className={cls}>{children}</h4>;
    return <h2 key={key} className={cls}>{children}</h2>;
  }

  if (node.type === "list") {
    if (node.listType === "number") {
      return <ol key={key} className="mb-4 ml-6 list-decimal space-y-1">{children}</ol>;
    }
    return <ul key={key} className="mb-4 ml-6 list-disc space-y-1">{children}</ul>;
  }

  if (node.type === "listitem") {
    return <li key={key} className="leading-relaxed">{children}</li>;
  }

  if (node.type === "link" || node.type === "autolink") {
    const url = node.fields?.url || node.url || "#";
    return (
      <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light underline underline-offset-2 transition-colors">
        {children}
      </a>
    );
  }

  if (node.type === "quote") {
    return (
      <blockquote key={key} className="mb-4 pl-4 border-l-2 border-white/[0.1] text-text-muted italic">
        {children}
      </blockquote>
    );
  }

  if (node.type === "code") {
    return (
      <pre key={key} className="mb-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-md overflow-x-auto">
        <code className="text-sm font-mono text-text-bright">{node.children?.map(c => c.text).join("") || children}</code>
      </pre>
    );
  }

  if (node.type === "upload") {
    const img = typeof node.value === "object" ? node.value : null;
    if (!img?.url) return null;
    return (
      <figure key={key} className="mb-6">
        <img src={img.url} alt={img.alt || ""} className="w-full rounded-md" loading="lazy" />
      </figure>
    );
  }

  if (node.type === "root") {
    return <>{children}</>;
  }

  return <>{children}</>;
}

export function RichText({ content }: { content: LexicalRoot | null | undefined }) {
  if (!content?.root) return null;
  return (
    <div className="text-text">
      {renderNode(content.root, 0)}
    </div>
  );
}
