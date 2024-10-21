import hljs from 'highlight.js';
import markdownit from 'markdown-it';

const highlightExt = (md: markdownit) => {
  const fence = md.renderer.rules.fence!.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    const code = token.content.trim();
    if (token.info.length > 0) {
      return `<pre data-sl="${token.map![0] + 1}"><code class="hljs">${hljs.highlightAuto(code, [token.info]).value}</code></pre>`;
    }
    return fence(tokens, idx, options, env, slf);
  };
};

export default highlightExt;
