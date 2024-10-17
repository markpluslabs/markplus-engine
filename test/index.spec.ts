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
});
