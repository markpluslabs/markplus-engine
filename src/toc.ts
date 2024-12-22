import markdownit from "markdown-it";
import { RuleBlock } from "markdown-it/lib/parser_block.mjs";
import Token from "markdown-it/lib/token.mjs";

interface TocItem {
  title: string;
  href: string;
  children: TocItem[];
  level: number;
}

const tocExt = (md: markdownit, options: { headings: number[] }) => {
  const toc: RuleBlock = (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const line = state.src.substring(start, max);
    if (line !== "[toc]") {
      return false;
    }
    if (silent) {
      return true;
    }
    state.line = startLine + 1;

    let token = state.push("toc_open", "ul", 1);
    token.markup = "[toc]";
    token.map = [startLine, state.line];

    token = state.push("toc_body", "", 0);
    token.markup = "";
    token.map = [startLine, state.line];
    token.children = [];

    token = state.push("toc_close", "ul", -1);
    token.markup = "";

    return true;
  };

  function buildTocTree(tokens: Token[]): TocItem[] {
    const toc: TocItem[] = [];
    const stack: TocItem[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === "heading_open") {
        const level = parseInt(token.tag.substring(1));
        if (!options.headings.includes(level)) {
          continue;
        }
        const id = token.attrs!.find((attr) => attr[0] === "id")![1];
        const title = tokens[i + 1]
          .children!.filter((t) => ["text", "code_inline"].includes(t.type))
          .map((t) => t.content)
          .join("")
          .trim();
        const item: TocItem = {
          title,
          href: `#${id}`,
          children: [],
          level,
        };
        while (stack.length && level <= stack[stack.length - 1].level) {
          stack.pop();
        }
        if (stack.length) {
          stack[stack.length - 1].children.push(item);
        } else {
          toc.push(item);
        }
        stack.push(item);
      }
    }
    return toc;
  }

  function renderToc(items: TocItem[]): string {
    let r = "\n<ul>\n";
    for (const item of items) {
      r += `<li><a href="${item.href}">${item.title}</a>`;
      if (item.children.length > 0) {
        r += renderToc(item.children);
      }
      r += "</li>\n";
    }
    r += "</ul>\n";
    return r;
  }

  md.renderer.rules.toc_body = (tokens) => {
    const tocTree = buildTocTree(tokens);
    const r = renderToc(tocTree);
    return r.substring(6, r.length - 6); // remove the outer <ul></ul>
  };

  md.block.ruler.after("heading", "toc", toc);
};

export default tocExt;
