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
  const { value, start, end } = props.node;
  const [editable, setEditable] = React.useState(false);
  const [tmpValue, setTmpValue] = React.useState(props.node.value);

  const confirm = () => {
    if (start === null || end === null) return;
    props.node.value = tmpValue;
    props.onUpdate(
      { start, end, value: `'${value}'` },
      {
        start,
        end: end + (tmpValue.length - value.length),
        value: `'${props.node.value}'`
      }
    );
    setEditable(false);
  };

  return editable ? (
    <input
      autoFocus
      value={tmpValue}
      onChange={e => setTmpValue(e.currentTarget.value)}
      onKeyDown={e => e.key === 'Enter' && confirm()}
      onBlur={() => confirm()}
    />
  ) : (
    <>
      <span>'</span>
      <span
        onClick={() => setEditable(true)}
        style={{ backgroundColor: '#ff835d', borderRadius: 2 }}
      >
        {tmpValue}
      </span>
      <span>'</span>
    </>
  );
}

export function NumericLiteral(props: Props<t.NumericLiteral>) {
  const { value, start, end } = props.node;
  const [editable, setEditable] = React.useState(false);
  const [tmpValue, setTmpValue] = React.useState(value.toString());

  const confirm = () => {
    if (start === null || end === null) return;
    // TODO: debounce
    props.node.value = parseInt(tmpValue);
    props.onUpdate(
      { start, end, value: value.toString() },
      {
        start,
        end: end + (tmpValue.length - value.toString().length),
        value: props.node.value.toString()
      }
    );
    setEditable(false);
  };

  return editable ? (
    <input
      autoFocus
      value={tmpValue}
      onChange={e => setTmpValue(e.currentTarget.value)}
      onKeyDown={e => e.key === 'Enter' && confirm()}
      onBlur={() => confirm()}
    />
  ) : (
    <>
      <span
        onClick={() => setEditable(true)}
        style={{ backgroundColor: '#47ffff', borderRadius: 2 }}
      >
        {tmpValue}
      </span>
    </>
  );
}
