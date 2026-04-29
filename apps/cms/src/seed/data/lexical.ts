// Helpers for building Lexical editor state JSON in seed data.
// Output shape matches what Payload's lexicalEditor() stores in MongoDB
// and what the public site's LexicalRenderer expects.

type LexicalNode = Record<string, unknown> & { type: string };

const FORMAT_BOLD = 1;
const FORMAT_ITALIC = 1 << 1;
const FORMAT_CODE_INLINE = 1 << 4;

function textNode(text: string, format = 0): LexicalNode {
  return {
    type: "text",
    detail: 0,
    format,
    mode: "normal",
    style: "",
    text,
    version: 1,
  };
}

export function t(text: string): LexicalNode {
  return textNode(text);
}

export function b(text: string): LexicalNode {
  return textNode(text, FORMAT_BOLD);
}

export function i(text: string): LexicalNode {
  return textNode(text, FORMAT_ITALIC);
}

export function ic(text: string): LexicalNode {
  return textNode(text, FORMAT_CODE_INLINE);
}

export function link(url: string, text: string): LexicalNode {
  return {
    type: "link",
    version: 3,
    fields: { url, newTab: !url.startsWith("/"), linkType: "custom" },
    indent: 0,
    format: "",
    direction: "ltr",
    children: [textNode(text)],
  };
}

export function p(...children: LexicalNode[]): LexicalNode {
  return {
    type: "paragraph",
    version: 1,
    indent: 0,
    format: "",
    direction: "ltr",
    textFormat: 0,
    children,
  };
}

export function ps(text: string): LexicalNode {
  return p(t(text));
}

export function h(level: 1 | 2 | 3 | 4 | 5 | 6, text: string): LexicalNode {
  return {
    type: "heading",
    version: 1,
    tag: `h${level}`,
    indent: 0,
    format: "",
    direction: "ltr",
    children: [textNode(text)],
  };
}

export function ul(...items: (string | LexicalNode[])[]): LexicalNode {
  const children = items.map((item, idx) => {
    const inline = typeof item === "string" ? [textNode(item)] : item;
    return {
      type: "listitem",
      version: 1,
      value: idx + 1,
      indent: 0,
      format: "",
      direction: "ltr",
      children: inline,
    };
  });
  return {
    type: "list",
    version: 1,
    listType: "bullet",
    tag: "ul",
    start: 1,
    indent: 0,
    format: "",
    direction: "ltr",
    children,
  };
}

export function ol(...items: (string | LexicalNode[])[]): LexicalNode {
  const children = items.map((item, idx) => {
    const inline = typeof item === "string" ? [textNode(item)] : item;
    return {
      type: "listitem",
      version: 1,
      value: idx + 1,
      indent: 0,
      format: "",
      direction: "ltr",
      children: inline,
    };
  });
  return {
    type: "list",
    version: 1,
    listType: "number",
    tag: "ol",
    start: 1,
    indent: 0,
    format: "",
    direction: "ltr",
    children,
  };
}

export function code(source: string, language = "csharp"): LexicalNode {
  const lines = source.split("\n");
  const children: LexicalNode[] = [];
  lines.forEach((line, idx) => {
    if (idx > 0) children.push({ type: "linebreak", version: 1 });
    if (line.length > 0) children.push(textNode(line));
  });
  return {
    type: "code",
    version: 1,
    language,
    indent: 0,
    format: "",
    direction: "ltr",
    children,
  };
}

export function quote(text: string): LexicalNode {
  return {
    type: "quote",
    version: 1,
    indent: 0,
    format: "",
    direction: "ltr",
    children: [textNode(text)],
  };
}

export function hr(): LexicalNode {
  return { type: "horizontalrule", version: 1 };
}

export function doc(...children: LexicalNode[]) {
  return {
    root: {
      type: "root",
      version: 1,
      indent: 0,
      format: "",
      direction: "ltr",
      children,
    },
  };
}
