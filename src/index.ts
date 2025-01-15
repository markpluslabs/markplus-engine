import markdownit from "markdown-it";
import anchorExt from "markdown-it-anchor";
import containerExt from "markdown-it-container";
import deflistExt from "markdown-it-deflist";
import { full as emojiExt } from "markdown-it-emoji";
import footnoteExt from "markdown-it-footnote";
import insExt from "markdown-it-ins";
import markExt from "markdown-it-mark";
import subExt from "markdown-it-sub";
import supExt from "markdown-it-sup";
import { generate } from "markplus-charts";

import flowchartExt from "./flowchart.js";
import faExt from "./font-awesome.js";
import highlightExt from "./highlight.js";
import katexPlugin from "./katex.js";
import sourceMapExt from "./source-map.js";
import taskListExt from "./task-list.js";
import tocExt from "./toc.js";
import slugify from "./slugify.js";

let md = markdownit({
  html: true,
});

/*
关于顺序: 貌似下面的会优先执行
 */
md = md.use(taskListExt);
md = md.use(insExt);
md = md.use(markExt);
md = md.use(subExt);
md = md.use(supExt);
md = md.use(footnoteExt);
md = md.use(deflistExt);
md = md.use(containerExt, "success");
md = md.use(containerExt, "info");
md = md.use(containerExt, "warning");
md = md.use(containerExt, "danger");
md = md.use(anchorExt, {
  tabIndex: false,
  permalink: anchorExt.permalink.linkInsideHeader({
    symbol: '<span class="octicon octicon-link"></span>',
    placement: "before",
    space: false,
    class: "anchor",
  }),
  slugify: (s) => slugify(s),
});
md = md.use(sourceMapExt);
md = md.use(tocExt, { headings: [2, 3] }); // h2 & h3
md = md.use(faExt);
md = md.use(emojiExt);
md = md.use(highlightExt);
md = md.use(katexPlugin);
md = md.use(flowchartExt);

const mde = {
  render: async (content: string) => {
    let html = md.render(content);
    const promises: Promise<string>[] = [];
    html = html.replace(
      /<pre class="flowchart">([\s\S]*?)<\/pre>/g, // Regex to match the content
      (_, code) => {
        promises.push(generate(code));
        return `<pre class="flowchart">${promises.length - 1}</pre>`;
      },
    );
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];
      let svg = "";
      try {
        svg = `<div>${await promise}</div>`;
      } catch (e) {
        svg = `<pre>${e.message}</pre>`;
      }
      html = html.replace(`<pre class="flowchart">${i}</pre>`, svg);
    }
    return html;
  },
};

export default mde;
