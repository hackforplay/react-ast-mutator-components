import test from 'ava';
import {
  escapeBooleanLiteral,
  escapeNumericLiteral,
  escapeStringLiteral
} from './InputMutator';

test('escapeStringLiteral', t => {
  const cases: [string, ReturnType<typeof escapeStringLiteral>][] = [
    ['hello world', { escaped: 'hello world', invalid: false }],
    ['end with bq\\', { escaped: 'end with bq\\', invalid: true }]
  ];

  for (const [input, output] of cases) {
    t.deepEqual(output, escapeStringLiteral(input));
  }
});

test('escapeNumericLiteral', t => {
  const cases: [string, ReturnType<typeof escapeNumericLiteral>][] = [
    ['１2３。4５', { escaped: '123.45', invalid: false }],
    ['ー', { escaped: '-', invalid: true }],
    ['ー１', { escaped: '-1', invalid: false }],
    ['.1', { escaped: '0.1', invalid: false }],
    ['-.1', { escaped: '-0.1', invalid: false }],
    ['-.1.', { escaped: '-0.1.', invalid: true }],
    ['-000.1', { escaped: '-0.1', invalid: false }],
    ['０0０1.1', { escaped: '1.1', invalid: false }]
  ];

  for (const [input, output] of cases) {
    t.deepEqual(output, escapeNumericLiteral(input));
  }
});

test('escapeBooleanLiteral', t => {
  const cases: [string, ReturnType<typeof escapeBooleanLiteral>][] = [
    ['true', { escaped: 'true', invalid: false }],
    ['false', { escaped: 'false', invalid: false }],
    ['hello', { escaped: 'hello', invalid: true }],
    ['TRUE', { escaped: 'true', invalid: false }],
    ['FALSE', { escaped: 'false', invalid: false }]
  ];

  for (const [input, output] of cases) {
    t.deepEqual(output, escapeBooleanLiteral(input));
  }
});
