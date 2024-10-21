import markdownit from 'markdown-it';

const taskListExt = (md: markdownit) => {
  let taskListItem = false;
  const renderToken = md.renderer.renderToken.bind(md.renderer);
  md.renderer.renderToken = (tokens, idx, options) => {
    const token = tokens[idx];
    if (
      token.type === 'list_item_open' &&
      (tokens[idx + 2].content.startsWith('[ ] ') ||
        tokens[idx + 2].content.startsWith('[x] '))
    ) {
      token.attrPush(['class', 'task-list-item']);
      taskListItem = true;
    }
    return renderToken(tokens, idx, options);
  };

  const renderInline = md.renderer.renderInline.bind(md.renderer);
  md.renderer.renderInline = (tokens, options, env) => {
    let r = renderInline(tokens, options, env);
    if (taskListItem) {
      if (r.startsWith('[ ] ')) {
        r = `<input type="checkbox" disabled> ${r.slice(4)}`;
      } else if (r.startsWith('[x] ')) {
        r = `<input type="checkbox" disabled checked> ${r.slice(4)}`;
      }
      taskListItem = false;
    }
    return r;
  };
};

export default taskListExt;
