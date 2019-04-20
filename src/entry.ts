import { parse } from '@babel/parser';
import * as React from 'react';
import { render } from 'react-dom';
import { Root } from './index';

const code = document.getElementById('code') as HTMLTextAreaElement;
const result = document.getElementById('result');

if (!code || !result) {
  throw new Error('DOM Error');
}

const update = () => {
  console.time();
  const file = parse(code.value);
  console.timeEnd();
  console.log(file);
  render(
    React.createElement(Root, {
      node: file,
      onUpdate(prev, next) {
        code.value =
          code.value.slice(0, prev.start) +
          next.value +
          code.value.slice(prev.end);
      }
    }),
    result
  );
};

code.oninput = update;

const testPath = /\/test(\/.*)/i.exec(location.pathname);

if (testPath) {
  fetch(testPath[1])
    .then(response => response.text())
    .then(text => ((code.value = text), update()));
}
