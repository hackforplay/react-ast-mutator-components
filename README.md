# React AST Mutator Components

## Install

- `npm i -S @hackforplay/react-ast-mutator-components`

## React Project

```javascript
import { RootComponent } from '@hackforplay/react-ast-mutator-components';
import { React, useState } from 'react';

export function MyComponent() {
  const [code, setCode] = useState('let a = 1');

  return <RootComponent code={code} onChange={value => setCode(value)} />;
}
```

## Othe Framework

```javascript
import { render } from '@hackforplay/react-ast-mutator-components';

let code = 'let a = 1';

update();

function update() {
  render(
    {
      code,
      onChange(value) {
        code = value;
        update();
      }
    },
    document.body
  );
}
```
