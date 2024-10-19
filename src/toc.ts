import slugify from '@sindresorhus/slugify';
import markdownit from 'markdown-it';
import { Token } from 'markdown-it/index.js';
import { RuleBlock } from 'markdown-it/lib/parser_block.mjs';

// Only generate toc for h2 & h3 in the document
const tocExt = (md: markdownit) => {
  const toc: RuleBlock = (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const line = state.src.substring(start, max);
    if (line !== '[toc]') {
      return false;
    }
    if (silent) {
      return true;
    }
    state.line = startLine + 1;

    let token = state.push('toc_open', 'toc', 1);
    token.markup = '[toc]';
    token.map = [startLine, state.line];

    token = state.push('toc_body', '', 0);
    token.markup = '';
    token.map = [startLine, state.line];
    token.children = [];

    token = state.push('toc_close', 'toc', -1);
    token.markup = '';

    return true;
  };

  let sourceLine = 0;
  md.renderer.rules.toc_open = (tokens, index) => {
    sourceLine = tokens[index].map![0] + 1;
    return '';
  };

  interface TocItem {
    title: string;
    href: string;
    children: TocItem[];
    level: number;
  }

  function buildTocTree(tokens: Token[]): TocItem[] {
    const toc: TocItem[] = [];
    const stack: TocItem[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === 'heading_open') {
        const level = parseInt(token.tag.substring(1));
        if (level < 2 || level > 3) continue;

        const titleToken = tokens[i + 1];
        const title = titleToken
          .children!.filter((t) => ['text', 'code_inline'].includes(t.type))
          .map((t) => t.content)
          .join('')
          .trim();

        const item: TocItem = {
          title,
          href: `#${slugify(title)}`,
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

  function renderToc(items: TocItem[], firstLevel = false): string {
    let r = firstLevel ? `<ul data-sl="${sourceLine}">` : '<ul>';
    for (const item of items) {
      r += `<li><a href="${item.href}">${item.title}</a>`;
      if (item.children.length > 0) {
        r += renderToc(item.children);
      }
      r += '</li>';
    }
    r += '</ul>';
    return r;
  }

  md.renderer.rules.toc_body = (tokens) => {
    const tocTree = buildTocTree(tokens);
    return renderToc(tocTree, true);
  };

  md.renderer.rules.toc_close = () => '\n';
  md.block.ruler.before('heading', 'toc', toc);
};

export default tocExt;
