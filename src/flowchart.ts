import markdownit from "markdown-it";

const flowchartExt = (md: markdownit) => {
  const fence = md.renderer.rules.fence!.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    if (token.info === "flowchart") {
      const code = token.content.trim();
      return `<pre class="flowchart">${code}</pre>`;
    }
    return fence(tokens, idx, options, env, slf);
  };
};

export default flowchartExt;
