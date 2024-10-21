import markdownit from 'markdown-it';

const taskListExt = (md: markdownit) => {
  let listItem = false;
  const renderToken = md.renderer.renderToken.bind(md.renderer);
  md.renderer.renderToken = (tokens, idx, options) => {
    const token = tokens[idx];
    if (token.type === 'list_item_open') {
      listItem = true;
    } else if (token.type === 'list_item_close') {
      listItem = false;
    }
    return renderToken(tokens, idx, options);
  };

  const renderInline = md.renderer.renderInline.bind(md.renderer);
  md.renderer.renderInline = (tokens, options, env) => {
    console.log(tokens);
    let r = renderInline(tokens, options, env);
    if (listItem) {
      if (r.startsWith('[ ] ')) {
        r = `<input type="checkbox" disabled> ${r.slice(4)}`;
      } else if (r.startsWith('[x] ')) {
        r = `<input type="checkbox" disabled checked> ${r.slice(4)}`;
      }
    }
    return r;
  };
};

export default taskListExt;
