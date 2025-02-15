import { expect, test } from "vitest";

import md from "../src";
import slugify from "../src/slugify";

test("headings", async () => {
  for (let i = 1; i <= 6; i++) {
    expect((await md.render(`${"#".repeat(i)} heading ${i}`)).trim()).toBe(
      `<h${i} id="heading-${i}" data-sl="1"><a class="anchor" href="#heading-${i}"><span class="octicon octicon-link"></span></a>heading ${i}</h${i}>`,
    );
  }
});

test("stylings", async () => {
  expect((await md.render("**bold**")).trim()).toBe(
    '<p data-sl="1"><strong>bold</strong></p>',
  );
  expect((await md.render("*italic*")).trim()).toBe(
    '<p data-sl="1"><em>italic</em></p>',
  );
  expect((await md.render("~~strikethrough~~")).trim()).toBe(
    '<p data-sl="1"><s>strikethrough</s></p>',
  );
  expect((await md.render("++underline++")).trim()).toBe(
    '<p data-sl="1"><ins>underline</ins></p>',
  );
  expect((await md.render("==mark==")).trim()).toBe(
    '<p data-sl="1"><mark>mark</mark></p>',
  );
});

test("tables", async () => {
  expect(
    (
      await md.render(
        `| Command | Description |
| --- | --- |
| command 1 | desc 1 |
| command 2 | desc 2 |`,
      )
    ).trim(),
  ).toBe(`<table data-sl="1">
<thead>
<tr>
<th>Command</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>command 1</td>
<td>desc 1</td>
</tr>
<tr>
<td>command 2</td>
<td>desc 2</td>
</tr>
</tbody>
</table>`);
});

test("HTML", async () => {
  expect((await md.render("<strong>hello</strong>")).trim()).toBe(
    '<p data-sl="1"><strong>hello</strong></p>',
  );
});

test("sub and sup", async () => {
  expect((await md.render("H~2~O")).trim()).toBe(
    '<p data-sl="1">H<sub>2</sub>O</p>',
  );
  expect((await md.render("2^10^")).trim()).toBe(
    '<p data-sl="1">2<sup>10</sup></p>',
  );
  expect((await md.render("29^th^")).trim()).toBe(
    '<p data-sl="1">29<sup>th</sup></p>',
  );
});

test("footnote inline", async () => {
  expect(
    (
      await md.render(
        `Here is an inline note.^[Inlines notes are easier to write, since
you don't have to pick an identifier and move down to type the
note.]`,
      )
    ).trim(),
  )
    .toBe(
      `<p data-sl="1">Here is an inline note.<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup></p>
<hr class="footnotes-sep">
<section class="footnotes">
<ol class="footnotes-list">
<li id="fn1" class="footnote-item"><p>Inlines notes are easier to write, since
you don't have to pick an identifier and move down to type the
note. <a href="#fnref1" class="footnote-backref">\u21a9\uFE0E</a></p>
</li>
</ol>
</section>`,
    );
});

test("footnote block", async () => {
  expect(
    (
      await md.render(
        `Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote.

This paragraph won't be part of the note, because it
isn't indented.`,
      )
    ).trim(),
  )
    .toBe(
      `<p data-sl="1">Here is a footnote reference,<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> and another.<sup class="footnote-ref"><a href="#fn2" id="fnref2">[2]</a></sup></p>
<p data-sl="10">This paragraph won't be part of the note, because it
isn't indented.</p>
<hr class="footnotes-sep">
<section class="footnotes">
<ol class="footnotes-list">
<li id="fn1" class="footnote-item"><p>Here is the footnote. <a href="#fnref1" class="footnote-backref">\u21a9\uFE0E</a></p>
</li>
<li id="fn2" class="footnote-item"><p>Here's one with multiple blocks.</p>
<p>Subsequent paragraphs are indented to show that they
belong to the previous footnote. <a href="#fnref2" class="footnote-backref">\u21a9\uFE0E</a></p>
</li>
</ol>
</section>`,
    );
});

test("definition list", async () => {
  expect(
    (
      await md.render(
        `Term 1
~ Definition 1

Term 2
~ Definition 2a
~ Definition 2b`,
      )
    ).trim(),
  ).toBe(`<dl data-sl="1">
<dt>Term 1</dt>
<dd>Definition 1</dd>
<dt>Term 2</dt>
<dd>Definition 2a</dd>
<dd>Definition 2b</dd>
</dl>`);
});

test("emoji", async () => {
  expect((await md.render(":smile:")).trim()).toBe('<p data-sl="1">😄</p>');
  expect((await md.render(":whale:")).trim()).toBe('<p data-sl="1">🐳</p>');
});

test("containers", async () => {
  expect(
    (
      await md.render(
        `::: success
You did it!
:::`,
      )
    ).trim(),
  ).toBe(`<div class="success" data-sl="1">
<p>You did it!</p>
</div>`);

  expect(
    (
      await md.render(
        `::: info
info
:::`,
      )
    ).trim(),
  ).toBe(`<div class="info" data-sl="1">
<p>info</p>
</div>`);

  expect(
    (
      await md.render(
        `::: warning
*here be dragons*
:::`,
      )
    ).trim(),
  ).toBe(`<div class="warning" data-sl="1">
<p><em>here be dragons</em></p>
</div>`);

  expect(
    (
      await md.render(
        `::: danger
danger
:::`,
      )
    ).trim(),
  ).toBe(`<div class="danger" data-sl="1">
<p>danger</p>
</div>`);

  expect(
    (
      await md.render(
        `::: unknown
unknown
:::`,
      )
    ).trim(),
  ).toBe(`<p data-sl="1">::: unknown
unknown
:::</p>`);
});

test("Chinese breaks", async () => {
  expect((await md.render("春风\n得意")).trim()).toBe(
    '<p data-sl="1">春风\n得意</p>',
  );
  expect((await md.render("Hello\nworld!")).trim()).toBe(
    '<p data-sl="1">Hello\nworld!</p>',
  );
});

test("slugify", async () => {
  expect((await md.render("# heading:smile:")).trim()).toBe(
    '<h1 id="heading" data-sl="1"><a class="anchor" href="#heading"><span class="octicon octicon-link"></span></a>heading😄</h1>',
  );
  expect((await md.render("# heading :fa-smile:")).trim()).toBe(
    '<h1 id="heading-fa-smile" data-sl="1"><a class="anchor" href="#heading-fa-smile"><span class="octicon octicon-link"></span></a>heading <i class="fa fa-smile"></i></h1>',
  );
});

test("toc", async () => {
  expect(
    (
      await md.render(
        "# heading 1\n## heading 2:heart:\n\n[toc]\n\n### heading 3\n\n### heading 3",
      )
    ).trim(),
  ).toBe(
    `<h1 id="heading-1" data-sl="1"><a class="anchor" href="#heading-1"><span class="octicon octicon-link"></span></a>heading 1</h1>
<h2 id="heading-2" data-sl="2"><a class="anchor" href="#heading-2"><span class="octicon octicon-link"></span></a>heading 2❤️</h2>
<ul data-sl="4">
<li><a href="#heading-2">heading 2</a>
<ul>
<li><a href="#heading-3">heading 3</a></li>
<li><a href="#heading-3-1">heading 3</a></li>
</ul>
</li>
</ul>
<h3 id="heading-3" data-sl="6"><a class="anchor" href="#heading-3"><span class="octicon octicon-link"></span></a>heading 3</h3>
<h3 id="heading-3-1" data-sl="8"><a class="anchor" href="#heading-3-1"><span class="octicon octicon-link"></span></a>heading 3</h3>`,
  );
});

test("lists", async () => {
  expect((await md.render("- heading 2\n  - heading 3\n  - heading 3")).trim())
    .toBe(`<ul data-sl="1">
<li>heading 2
<ul>
<li>heading 3</li>
<li>heading 3</li>
</ul>
</li>
</ul>`);
});

test("font-awesome", async () => {
  expect((await md.render(":fa-smile:")).trim()).toBe(
    '<p data-sl="1"><i class="fa fa-smile"></i></p>',
  );
  expect((await md.render(":fa-smile: :fa-flag:")).trim()).toBe(
    '<p data-sl="1"><i class="fa fa-smile"></i> <i class="fa fa-flag"></i></p>',
  );
  expect((await md.render(":fa-smile::fa-flag:")).trim()).toBe(
    '<p data-sl="1"><i class="fa fa-smile"></i><i class="fa fa-flag"></i></p>',
  );
});

test("katex", async () => {
  expect(
    (await md.render("`$H_2O$`"))
      .trim()
      .startsWith('<p data-sl="1"><span class="katex">'),
  ).toBeTruthy();
  expect(
    (await md.render("```math\nH_2O\n```"))
      .trim()
      .startsWith('<div><span class="katex-display"><span class="katex">'),
  ).toBeTruthy();
});

test("syntax highlight", async () => {
  expect((await md.render("```typescript\nconst a = 1;\n```")).trim()).toBe(
    '<pre data-sl="1"><code class="hljs"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>;</code></pre>',
  );
});

test("syntax highlight - language name trailing space", async () => {
  expect((await md.render("```typescript \nconst a = 1;\n```")).trim()).toBe(
    '<pre data-sl="1"><code class="hljs"><span class="hljs-keyword">const</span> a = <span class="hljs-number">1</span>;</code></pre>',
  );
});

test("task list", async () => {
  expect((await md.render("- [x] task 1\n- [ ] task 2")).trim())
    .toBe(`<ul data-sl="1">
<li class="task-list-item"><input class="task-list-item-checkbox" type="checkbox" disabled checked> task 1</li>
<li class="task-list-item"><input class="task-list-item-checkbox" type="checkbox" disabled> task 2</li>
</ul>`);
});

// ref: https://github.com/markdown-it/markdown-it-cjk-breaks/pull/5
test("no exception", () => {
  expect(async () => await md.render("**a**\nb")).not.toThrow();
});

test("flowcharts", async () => {
  let html = await md.render("```flowchart\nA -> B\n```");
  expect(html).toContain("</svg>");
  html = await md.render("```flowchart\nA -> \n```");
  expect(html).toContain("</pre>"); // syntax error
});

test("slugify", () => {
  const text = "Hello World! 你好世界 Привет-мир Version 2.0 一二三";
  expect(slugify(text)).toBe(
    "hello-world-你好世界-привет-мир-version-2-0-一二三",
  );
});
