import markdownit from 'markdown-it';

const chartJsExt = (md: markdownit) => {
  const fence = md.renderer.rules.fence!.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    if (token.info === 'chartjs') {
      const code = token.content.trim();
      try {
        const json = JSON.parse(code);
        return `<canvas class="chartjs">${JSON.stringify(json)}</canvas>`;
      } catch (e) {
        return `<pre>${e}</pre>`;
      }
    }
    return fence(tokens, idx, options, env, slf);
  };
};

export default chartJsExt;
