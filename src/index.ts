import markdownit from 'markdown-it';
import deflistExt from 'markdown-it-deflist';
import footnotExt from 'markdown-it-footnote';
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
md = md.use(footnotExt);
md = md.use(deflistExt);

export default md;
