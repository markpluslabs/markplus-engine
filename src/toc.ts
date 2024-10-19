import slugify from '@sindresorhus/slugify';
import markdownit from 'markdown-it';
import { RuleBlock } from 'markdown-it/lib/parser_block.mjs';

// Only generate toc for h2 in the document
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
  md.renderer.rules.toc_open = (tokens, index) =>
    `<ul data-sl="${tokens[index].map![0] + 1}">`;
  md.renderer.rules.toc_body = (tokens) => {
    let r = '';
    let prevTag: '' | 'h2' | 'h3' = '';
    let level = 0;
    for (const token of tokens) {
      if (token.type.startsWith('heading_')) {
        const tag = token.tag.toLocaleLowerCase();
        if (!(tag === 'h2' || tag === 'h3')) {
          continue;
        }
        if (token.type === 'heading_open') {
          if (tag === 'h3' && prevTag === 'h2') {
            r += '<li><ul>';
          }
          r += '<li>';
          level += 1;
        } else if (token.type === 'heading_close') {
          if (tag === 'h2' && prevTag === 'h3') {
            r += '</ul></li>';
          }
          r += '</li>';
          level -= 1;
          prevTag = tag;
        }
      } else if (level > 0 && token.type === 'inline') {
        const title = token
          .children!.filter((t) => ['text', 'code_inline'].includes(t.type))
          .map((t) => t.content)
          .join('')
          .trim();
        r += `<a href="#${slugify(title)}">${title}</a>`;
      }
    }
    if (prevTag === 'h3') {
      r += '</ul></li>';
    }
    return r;
  };
  md.renderer.rules.toc_close = () => '</ul>\n';
  md.block.ruler.before('heading', 'toc', toc);
};

export default tocExt;
