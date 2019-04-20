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

class Entry extends React.Component {
  state = {
    code: '',
    error: ''
  };

  componentDidMount() {
    textarea.oninput = () => {
      this.setState({ code: textarea.value, error: '' });
    };

    const testPath = /\/test(\/.*)/i.exec(location.pathname);
    if (testPath) {
      fetch(testPath[1])
        .then(response => response.text())
        .then(code => {
          this.setState({ code });
          textarea.value = code;
        });
    }
  }

  componentDidCatch(error: Error) {
    this.setState({ error: error.message });
  }

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
      file = parse(code);
      console.log(file);
    } catch (error) {
      return <div style={{ color: 'gray' }}>{error.message}</div>;
    }
    console.timeEnd();

    return (
      <Root
        node={file}
        onUpdate={(prev, next) => {
          textarea.value =
            textarea.value.slice(0, prev.start) +
            next.value +
            textarea.value.slice(prev.end);
        }}
      />
    );
  }
}

render(<Entry />, result);
