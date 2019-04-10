import { parse } from '@babel/parser';
import * as React from 'react';
import { render } from 'react-dom';
import * as components from './index';

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
    React.createElement(components.File, {
      node: file
    }),
    result
  );
};

code.oninput = update;

code.value = `// これはコメント
const mozi = 'ここは文字列';
const suuzi = 123;
`;

update();
