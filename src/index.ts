import slugify from '@sindresorhus/slugify';
import markdownit from 'markdown-it';
import anchorExt from 'markdown-it-anchor';
import cjkBreaksExt from 'markdown-it-cjk-breaks';
import containerExt from 'markdown-it-container';
import deflistExt from 'markdown-it-deflist';
import { full as emojiExt } from 'markdown-it-emoji';
import footnoteExt from 'markdown-it-footnote';
import insExt from 'markdown-it-ins';
import markExt from 'markdown-it-mark';
import subExt from 'markdown-it-sub';
import supExt from 'markdown-it-sup';

import faExt from './font-awesome';
import highlightExt from './highlight';
import katexPlugin from './katex';
import sourceMapExt from './source-map';
import tocExt from './toc';

let md = markdownit({
  html: true,
});

/*
关于顺序: 貌似下面的会优先执行
 */
md = md.use(insExt);
md = md.use(markExt);
md = md.use(subExt);
md = md.use(supExt);
md = md.use(footnoteExt);
md = md.use(deflistExt);
md = md.use(containerExt, 'success');
md = md.use(containerExt, 'info');
md = md.use(containerExt, 'warning');
md = md.use(containerExt, 'error');
md = md.use(cjkBreaksExt);
md = md.use(anchorExt, {
  tabIndex: false,
  permalink: anchorExt.permalink.linkInsideHeader({
    symbol: '<span class="octicon octicon-link"></span>',
    placement: 'before',
    space: false,
    class: 'anchor',
  }),
  slugify: (s) => slugify(s),
});
md = md.use(sourceMapExt);
md = md.use(tocExt, { headings: [2, 3] }); // h2 & h3
md = md.use(faExt);
md = md.use(emojiExt);
md = md.use(highlightExt);
md = md.use(katexPlugin);

export default md;
