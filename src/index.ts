import markdownit from 'markdown-it';
import insExt from 'markdown-it-ins';

let md = markdownit();
md = md.use(insExt);

export default md;
