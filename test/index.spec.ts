import { expect, test } from 'vitest';

import md from '../src/index';

test('Headings', () => {
  for (let i = 1; i <= 6; i++) {
    expect(md.render(`${'#'.repeat(i)} heading ${i}`).trim()).toBe(
      `<h${i}>heading ${i}</h${i}>`,
    );
  }
});

test('Stylings', () => {
  expect(md.render('**bold**').trim()).toBe('<p><strong>bold</strong></p>');
  expect(md.render('*italic*').trim()).toBe('<p><em>italic</em></p>');
  expect(md.render('~~strikethrough~~').trim()).toBe(
    '<p><s>strikethrough</s></p>',
  );
  expect(md.render('++underline++').trim()).toBe('<p><ins>underline</ins></p>');
  expect(md.render('==mark==').trim()).toBe('<p><mark>mark</mark></p>');
});

test('tables', () => {
  expect(
    md
      .render(
        `| Command | Description |
| --- | --- |
| command 1 | desc 1 |
| command 2 | desc 2 |`,
      )
      .trim(),
  ).toBe(`<table>
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

test('HTML', () => {
  expect(md.render('<strong>hello</strong>').trim()).toBe(
    '<p><strong>hello</strong></p>',
  );
});

test('sub and sup', () => {
  expect(md.render('H~2~O').trim()).toBe('<p>H<sub>2</sub>O</p>');
  expect(md.render('2^10^').trim()).toBe('<p>2<sup>10</sup></p>');
  expect(md.render('29^th^').trim()).toBe('<p>29<sup>th</sup></p>');
});

test('footnote inline', () => {
  expect(
    md
      .render(
        `Here is an inline note.^[Inlines notes are easier to write, since
you don't have to pick an identifier and move down to type the
note.]`,
      )
      .trim(),
  )
    .toBe(`<p>Here is an inline note.<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup></p>
<hr class="footnotes-sep">
<section class="footnotes">
<ol class="footnotes-list">
<li id="fn1" class="footnote-item"><p>Inlines notes are easier to write, since
you don't have to pick an identifier and move down to type the
note. <a href="#fnref1" class="footnote-backref">\u21a9\uFE0E</a></p>
</li>
</ol>
</section>`);
});

test('footnote block', () => {
  expect(
    md
      .render(
        `Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote.

This paragraph won't be part of the note, because it
isn't indented.`,
      )
      .trim(),
  )
    .toBe(`<p>Here is a footnote reference,<sup class="footnote-ref"><a href="#fn1" id="fnref1">[1]</a></sup> and another.<sup class="footnote-ref"><a href="#fn2" id="fnref2">[2]</a></sup></p>
<p>This paragraph won't be part of the note, because it
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
</section>`);
});

test('definition list', () => {
  expect(
    md
      .render(
        `Term 1
~ Definition 1

Term 2
~ Definition 2a
~ Definition 2b`,
      )
      .trim(),
  ).toBe(`<dl>
<dt>Term 1</dt>
<dd>Definition 1</dd>
<dt>Term 2</dt>
<dd>Definition 2a</dd>
<dd>Definition 2b</dd>
</dl>`);
});

test('emoji', () => {
  expect(md.render(':smile:').trim()).toBe('<p>😄</p>');
  expect(md.render(':whale:').trim()).toBe('<p>🐳</p>');
});

test('containers', () => {
  expect(
    md
      .render(
        `::: warning
*here be dragons*
:::`,
      )
      .trim(),
  ).toBe(`<div class="warning">
<p><em>here be dragons</em></p>
</div>`);
});
