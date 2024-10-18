import markdownit from 'markdown-it';
import containerExt from 'markdown-it-container';
import deflistExt from 'markdown-it-deflist';
import { full as emojiExt } from 'markdown-it-emoji';
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
md = md.use(emojiExt);
md = md.use(containerExt, 'warning');

export default md;
