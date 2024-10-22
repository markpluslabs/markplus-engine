import markdownit from 'markdown-it';

const mermaidExt = (md: markdownit) => {
  const fence = md.renderer.rules.fence!.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    if (token.info === 'mermaid') {
      return `<pre class="mermaid">\n${token.content.trim()}\n</pre>`;
    }
    return fence(tokens, idx, options, env, slf);
  };
};

export default mermaidExt;
