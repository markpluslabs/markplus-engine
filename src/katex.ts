import katex from 'katex';
import markdownit from 'markdown-it';

const katexPlugin = (md: markdownit) => {
  // inline math
  const code_inline = md.renderer.rules.code_inline!.bind(md.renderer.rules);
  md.renderer.rules.code_inline = (tokens, idx, options, env, slf) => {
    let code = tokens[idx].content;
    if (code.startsWith('$') && code.endsWith('$')) {
      code = code.substring(1, code.length - 1);
      try {
        return katex.renderToString(code);
      } catch (err) {
        return `<code>${err}</code>`;
      }
    }
    return code_inline(tokens, idx, options, env, slf);
  };

  // fenced math block
  const fence = md.renderer.rules.fence!.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    const code = token.content.trim();
    if (token.info === 'math') {
      let tex = '';
      code.split(/(?:\n\s*){2,}/).forEach((line) => {
        // consecutive new lines means a new formula
        try {
          tex += katex.renderToString(line.trim(), { displayMode: true });
        } catch (err) {
          tex += `<pre>${err}</pre>`;
        }
      });
      return `<div>${tex}</div>`;
    }
    return fence(tokens, idx, options, env, slf);
  };
};

export default katexPlugin;
