import { parse } from '@babel/parser';

const code = document.getElementById('code') as HTMLTextAreaElement;
const result = document.getElementById('result');

if (!code || !result) {
  throw new Error('DOM Error');
}

const update = () => {
  const file = parse(code.value);
  result.textContent = JSON.stringify(file, null, 2);
};

code.oninput = update;

code.value = `// これはコメント
const mozi = 'ここは文字列';
const suuzi = 123;
`;

update();
