type MarkdownRendererProps = {
  content: string;
};

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderInlineMarkdown(text: string) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function renderParagraphLines(lines: string[]) {
  const content = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => renderInlineMarkdown(line))
    .join("<br />");

  return content ? `<p>${content}</p>` : "";
}

function renderMarkdown(content: string) {
  return content
    .split(/\n(?=# |## |- )/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("## ")) {
        const [heading, ...rest] = block.split("\n");
        return `<h3>${renderInlineMarkdown(heading.replace(/^##\s*/, "").trim())}</h3>${renderParagraphLines(rest)}`;
      }

      if (block.startsWith("# ")) {
        const [heading, ...rest] = block.split("\n");
        return `<h2>${renderInlineMarkdown(heading.replace(/^#\s*/, "").trim())}</h2>${renderParagraphLines(rest)}`;
      }

      if (block.startsWith("- ")) {
        const items = block
          .split("\n")
          .filter((line) => line.startsWith("- "))
          .map((line) => `<li>${renderInlineMarkdown(line.slice(2).trim())}</li>`)
          .join("");

        return `<ul>${items}</ul>`;
      }

      return renderParagraphLines(block.split("\n"));
    })
    .join("");
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return <div className="markdown-content space-y-6" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />;
}
