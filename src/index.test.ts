import * as t from '@babel/types';
import test from 'ava';
import { configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as fs from 'fs';
import * as path from 'path';
import * as React from 'react';
import { fixtures } from '../test/';
import { File } from './index';

configure({ adapter: new Adapter() });

for (const fixturePath of fixtures) {
  const abs = path.resolve(__dirname, '../test/fixtures', fixturePath);
  test(abs, t => {
    const text = fs.readFileSync(abs, 'utf8');
    const node: t.File = JSON.parse(text);

    t.notThrows(() => {
      render(
        React.createElement(
          ErrorBoundary,
          {},
          React.createElement(File, {
            node,
            onUpdate() {}
          })
        )
      );
    });
  });
}

class ErrorBoundary extends React.Component {
  componentDidCatch() {}
  render() {
    return this.props.children;
  }
}
