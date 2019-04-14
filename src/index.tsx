import traverse, { Visitor } from '@babel/traverse';
import * as t from '@babel/types';
import * as React from 'react';

type NodeSnapshot = {
  start: number;
  end: number;
  value: string;
};

type OnUpdate = (prev: NodeSnapshot, next: NodeSnapshot) => void;

type Props<NodeType> = {
  node: NodeType;
  onUpdate: OnUpdate;
};

export function File(props: Props<t.File>) {
  const onUpdate: OnUpdate = (prev, next) => {
    const increased = next.end - prev.end;
    if (increased !== 0) {
      // Keep start and end correctly
      traverse(props.node, {
        enter(path) {
          if (path.node.end === null || path.node.end < prev.end) return;
          path.node.end += increased;
          if (path.node.start === null || path.node.start < prev.end) return;
          path.node.start += increased;
        }
      });
    }
    props.onUpdate(prev, next);
  };
  return <Program node={props.node.program} onUpdate={onUpdate} />;
}

export function Program(props: Props<t.Program>) {
  return (
    <div>
      {props.node.body.map((node, i) => (
        <Statement key={i} node={node} onUpdate={props.onUpdate} />
      ))}
    </div>
  );
}

function Statement(props: Props<t.Statement>) {
  const { node } = props;
  return t.isVariableDeclaration(node) ? (
    <VariableDeclaration node={node} onUpdate={props.onUpdate} />
  ) : t.isFunctionDeclaration(node) ? (
    <FunctionDeclaration node={node} onUpdate={props.onUpdate} />
  ) : (
    <div>Unknown {node.type}</div>
  );
}

export function FunctionDeclaration(props: Props<t.FunctionDeclaration>) {
  const { id, body } = props.node;
  return (
    <div>
      <div>
        <span style={{ border: '1px solid #aaaaaa' }}>
          <span>
            <ruby>
              function<rt>かんすう</rt>
            </ruby>{' '}
          </span>
          {id ? <span>{id.name}</span> : null}
        </span>
        <span>()</span>
        <span>{`{`}</span>
      </div>
      <div style={{ paddingLeft: 8, border: '1px solid #aaaaaa' }}>
        {body.body.map((node, i) => (
          <Statement key={i} node={node} onUpdate={props.onUpdate} />
        ))}
      </div>
      <div>
        <span>{`}`}</span>
      </div>
    </div>
  );
}

export function VariableDeclaration(props: Props<t.VariableDeclaration>) {
  return (
    <div>
      <ruby>
        {props.node.kind}
        <rt>へんすう</rt>
      </ruby>
      <span />
      {props.node.declarations.map((node, i) => (
        <VariableDeclarator key={i} node={node} onUpdate={props.onUpdate} />
      ))}
      <span>;</span>
    </div>
  );
}

export function VariableDeclarator(props: Props<t.VariableDeclarator>) {
  const { id, init } = props.node;
  return (
    <>
      <span>{t.isIdentifier(id) ? id.name : '?'}</span>
      <span>
        <ruby>
          =<rt>←</rt>
        </ruby>
      </span>
      {init ? <Expression node={init} onUpdate={props.onUpdate} /> : '?'}
    </>
  );
}

export function Expression(props: Props<t.Expression>) {
  return t.isStringLiteral(props.node) ? (
    <StringLiteral node={props.node} onUpdate={props.onUpdate} />
  ) : t.isNumericLiteral(props.node) ? (
    <NumericLiteral node={props.node} onUpdate={props.onUpdate} />
  ) : null;
}

export function StringLiteral(props: Props<t.StringLiteral>) {
  const { type, value, start, end } = props.node;
  const [editable, setEditable] = React.useState(false);

  if (start === null || end === null) {
    console.log(props.node);
    throw new Error('start or end is null');
  }

  return editable ? (
    <InputMutator
      type={type}
      defaultValue={value}
      onUpdate={newValue => {
        props.node.value = newValue;
        props.onUpdate(
          { start, end, value: `'${value}'` },
          {
            start,
            end: start + newValue.length + 2,
            value: `'${newValue}'`
          }
        );
        setEditable(false);
      }}
    />
  ) : (
    <>
      <span>'</span>
      <span
        onClick={() => setEditable(true)}
        style={{ backgroundColor: '#ff835d', borderRadius: 2 }}
      >
        {value}
      </span>
      <span>'</span>
    </>
  );
}

export function NumericLiteral(props: Props<t.NumericLiteral>) {
  const { type, value, start, end } = props.node;
  const [editable, setEditable] = React.useState(false);

  if (start === null || end === null) {
    console.log(props.node);
    throw new Error('start or end is null');
  }

  return editable ? (
    <InputMutator
      type={type}
      defaultValue={value.toString()}
      onUpdate={newValue => {
        props.node.value = parseFloat(newValue);
        props.onUpdate(
          { start, end, value: value.toString() },
          {
            start,
            end: start + newValue.length,
            value: newValue
          }
        );
        setEditable(false);
      }}
    />
  ) : (
    <>
      <span
        onClick={() => setEditable(true)}
        style={{ backgroundColor: '#47ffff', borderRadius: 2 }}
      >
        {value}
      </span>
    </>
  );
}

const escapeStringLiteral = (str: string) => {
  let escaped = str.replace(/\\*['"]/g, sub => {
    return sub.length % 2 === 1 ? '\\' + sub : sub;
  });
  return { escaped, invalid: escaped.substr(-1) === '\\' };
};

const escapeNumericLiteral = (str: string) => {
  let escaped = str.replace(/[０-９ー]/g, sub =>
    String.fromCharCode(sub.charCodeAt(0) - 0xfee0)
  ); // １ to 1
  escaped = escaped.replace(/。/, '.');
  escaped = escaped.replace(/^\./, '0.');
  return { escaped, invalid: !/^-?\d*\.?\d+$/.test(escaped) };
};

type InputMutatorProps = {
  type: t.NumericLiteral['type'] | t.StringLiteral['type'];
  defaultValue: string;
  onUpdate: (value: string) => void;
};

export function InputMutator(props: InputMutatorProps) {
  const [value, setValue] = React.useState(props.defaultValue);
  const [invalid, setInvalid] = React.useState(false);

  const confirm = () => {
    if (invalid) return;
    props.onUpdate(value);
  };

  return (
    <input
      autoFocus
      value={value}
      onChange={e => {
        const { value } = e.currentTarget;
        const { escaped, invalid } =
          props.type === 'NumericLiteral'
            ? escapeNumericLiteral(value)
            : escapeStringLiteral(value);
        setInvalid(invalid);
        setValue(escaped);
      }}
      onKeyDown={e => e.key === 'Enter' && confirm()}
      onBlur={() => confirm()}
      style={invalid ? { backgroundColor: 'red' } : {}}
    />
  );
}
