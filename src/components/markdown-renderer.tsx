type MarkdownRendererProps = {
  content: string;
};

function renderInlineMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function renderMarkdown(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("##")) {
        const [heading, ...rest] = block.split("\n");
        const body = rest.join("<br />");
        return `<h3>${renderInlineMarkdown(heading.replace(/^##\s*/, "").trim())}</h3>${body ? `<p>${renderInlineMarkdown(body)}</p>` : ""}`;
      }

      if (block.startsWith("- ")) {
        const items = block
          .split("\n")
          .filter((line) => line.startsWith("- "))
          .map((line) => `<li>${renderInlineMarkdown(line.slice(2).trim())}</li>`)
          .join("");

        return `<ul>${items}</ul>`;
      }

      return `<p>${renderInlineMarkdown(block.replace(/\n/g, "<br />"))}</p>`;
    })
    .join("");
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return <div className="markdown-content space-y-6" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />;
}
