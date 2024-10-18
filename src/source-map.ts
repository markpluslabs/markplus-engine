import markdownit from 'markdown-it';

const sourceMapExt = (md: markdownit) => {
  const _renderToken = md.renderer.renderToken.bind(md.renderer);
  md.renderer.renderToken = function (tokens, idx, options) {
    const token = tokens[idx];
    if (
      token.level === 0 &&
      token.map !== null &&
      token.type.endsWith('_open')
    ) {
      token.attrPush(['data-sl', String(token.map[0] + 1)]);
    }
    return _renderToken(tokens, idx, options);
  };
};

export default sourceMapExt;
