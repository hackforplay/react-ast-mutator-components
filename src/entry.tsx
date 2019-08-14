import { parse } from '@babel/parser';
import * as t from '@babel/types';
import * as React from 'react';
import { render } from 'react-dom';
import { Root } from './index';

const textarea = document.getElementById('code') as HTMLTextAreaElement;
const result = document.getElementById('result');

if (!textarea || !result) {
  throw new Error('DOM Error');
}

const kana = {
  one: 'いち',
  two: 'に',
  three: 'さん',
  'one.two': 'いちのに',
  'one.two.three': 'いちのにのさん',
  'slime.hp': 'スライムのたいりょく',
  'insect.hp': 'イモムシのたいりょく',
  'player.atk': 'プレイヤーのこうげきりょく',
  'player.locate': 'プレイヤーをうごかす',
  'bat.locate': 'コウモリをうごかす',
  'player.hp': 'プレイヤーのたいりょく'
};

class Entry extends React.Component {
  state = {
    code: '',
    error: ''
  };

  componentDidMount() {
    textarea.oninput = () => {
      this.setState({ code: textarea.value, error: '' });
    };
    window.onhashchange = this.update;
    this.update();
  }

  componentDidCatch(error: Error) {
    this.setState({ error: error.message });
  }

  update = () => {
    const testPath = /^#(.*)/i.exec(location.hash);
    const hash = testPath && testPath[1];
    if (!hash) return;
    fetch(hash)
      .then(response => response.text())
      .then(code => {
        this.setState({ code });
        textarea.value = code;
      });
  };

  render() {
    const { code, error } = this.state;

    if (error) {
      return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (!code) {
      return <div>Please put code into left textarea.</div>;
    }

    console.time();
    let file: t.File;
    try {
      file = parse(code, {
        sourceType: 'module',
        allowAwaitOutsideFunction: true
      });
      console.log(file);
    } catch (error) {
      return <div style={{ color: 'gray' }}>{error.message}</div>;
    }
    console.timeEnd();

    return (
      <Root
        node={file}
        kana={kana}
        onUpdate={({ prev, next }) => {
          textarea.value =
            textarea.value.slice(0, prev.start) +
            next.value +
            textarea.value.slice(prev.end);
        }}
        style={{
          border: '1px solid black'
        }}
      />
    );
  }
}

render(<Entry />, result);
