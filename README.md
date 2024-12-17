# MarkPlus Engine

A markdown to html converter with a bunch of extra features.

It powers [react-markplus](https://github.com/markpluslabs/react-markplus).

<img src="https://markpluslabs.github.io/react-markplus/icon.svg" width="128" height="128" />

## Install

```
yarn add markplus-engine
```

## Usage

```ts
import markplusEngine from 'markplus-engine';

const html = await markplusEngine.render('# Hello world!');
```

## Notes

This library focus on markdown to html converstion. It's supposed to run in both Node.js and browser.

Thus, it doesn't handle CSS or client-side JavaScript.(since Node.js doesn't have CSS or client-side JavaScript).
