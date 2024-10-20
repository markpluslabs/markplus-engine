import markdownit from 'markdown-it';
import { coreRuler, rendererRule } from 'markdown-it-regex';

const faExt = (md: markdownit) => {
  const faRegex = new RegExp(
    ':(fa(?:-[0-9a-z]+?)+?(?: fa(?:-[0-9a-z]+?)+?)*?):',
  );
  const options = {
    name: 'font-awesome',
    regex: faRegex,
    replace: (match: string) => `<i class="${match}"></i>`,
  };
  md.renderer.rules[options.name] = (tokens, idx) => {
    return rendererRule(tokens, idx, options);
  };
  md.core.ruler.push(options.name, (state) => {
    coreRuler(state, options);
  });
};

export default faExt;
