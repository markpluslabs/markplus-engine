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
