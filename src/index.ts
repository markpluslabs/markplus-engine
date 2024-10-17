import markdownit from 'markdown-it';
import insExt from 'markdown-it-ins';
import markExt from 'markdown-it-mark';

let md = markdownit({
  html: true,
});
md = md.use(insExt);
md = md.use(markExt);

export default md;
