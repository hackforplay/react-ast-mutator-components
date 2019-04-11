import * as t from '@babel/types';
import * as React from 'react';

type Props<NodeType> = {
  node: NodeType;
};

export function File(props: Props<t.File>) {
  return <Program node={props.node.program} />;
}

export function Program(props: Props<t.Program>) {
  return (
    <div>
      {props.node.body.map((node, i) => (
        <Statement key={i} node={node} />
      ))}
    </div>
  );
}

function Statement(props: Props<t.Statement>) {
  const { node } = props;
  return t.isVariableDeclaration(node) ? (
    <VariableDeclaration node={node} />
  ) : t.isFunctionDeclaration(node) ? (
    <FunctionDeclaration node={node} />
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
          <Statement key={i} node={node} />
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
        <VariableDeclarator key={i} node={node} />
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
      {init ? <Expression node={init} /> : '?'}
    </>
  );
}

export function Expression(props: Props<t.Expression>) {
  return t.isStringLiteral(props.node) ? (
    <StringLiteral node={props.node} />
  ) : t.isNumericLiteral(props.node) ? (
    <NumericLiteral node={props.node} />
  ) : null;
}

export function StringLiteral(props: Props<t.StringLiteral>) {
  const [editable, setEditable] = React.useState(false);
  const [value, setValue] = React.useState(props.node.value);

  return editable ? (
    <input
      autoFocus
      value={value}
      onChange={e => setValue(e.currentTarget.value)}
      onKeyDown={e => e.key === 'Enter' && setEditable(false)}
      onBlur={() => setEditable(false)}
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
  const [editable, setEditable] = React.useState(false);
  const [value, setValue] = React.useState(props.node.value);

  return editable ? (
    <input
      autoFocus
      value={value}
      onChange={e => setValue(parseInt(e.currentTarget.value))}
      onKeyDown={e => e.key === 'Enter' && setEditable(false)}
      onBlur={() => setEditable(false)}
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
