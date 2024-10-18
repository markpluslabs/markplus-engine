import markdownit from 'markdown-it';
import { RuleBlock } from 'markdown-it/lib/parser_block.mjs';

// Only generate toc for h2 in the document
const tocExt = (md: markdownit) => {
  const toc: RuleBlock = (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];
    const line = state.src.substring(start, max);
    console.log('line:', line);
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
    const headings: string[] = [];
    let inHeading = false;
    for (const token of tokens) {
      if (token.type === 'heading_open' && token.tag.toLowerCase() === 'h2') {
        inHeading = true;
      } else if (
        token.type === 'heading_close' &&
        token.tag.toLowerCase() === 'h2'
      ) {
        inHeading = false;
      } else if (inHeading && token.type === 'inline') {
        headings.push(
          token
            .children!.filter((t) => ['text', 'code_inline'].includes(t.type))
            .map((t) => t.content)
            .join(''),
        );
      }
    }
    return headings.map((h) => `<li>${h}</li>`).join('');
  };
  md.renderer.rules.toc_close = () => '</ul>';
  md.block.ruler.before('heading', 'toc', toc);
};

export default tocExt;
