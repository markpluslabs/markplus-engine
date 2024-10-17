import markdownit from 'markdown-it';
import insExt from 'markdown-it-ins';
import markExt from 'markdown-it-mark';
import subExt from 'markdown-it-sub';
import supExt from 'markdown-it-sup';

let md = markdownit({
  html: true,
});
md = md.use(insExt);
md = md.use(markExt);
md = md.use(subExt);
md = md.use(supExt);

export default md;
