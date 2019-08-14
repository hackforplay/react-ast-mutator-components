import * as t from '@babel/types';
import * as React from 'react';
import { useSelector } from '../hooks';
import { ja as lang } from '../lang';
import { actions } from '../store';
import { useProxy } from '../useProxy';
import {
  Declaration,
  Expression,
  LVal,
  Method,
  ObjectMember,
  PatternLike,
  Property,
  Statement
} from './Aliases';
import { Comments } from './Comments';
import { InputMutator } from './InputMutator';
import { NotImplemented } from './NotImplemented';
import { NodeProps as P } from './types';

export function ArrayExpression(props: P<t.ArrayExpression>) {
  const { elements } = props.node;
  const border = '1px solid #aaaaaa';
  return (
    <span style={{ border }}>
      <span>{`[`}</span>
      <Join delimiterStyle={{ borderRight: border }}>
        {elements.map((element, i) =>
          !element ? (
            <span key={i} style={{ color: '#aaaaaa' }}>
              undefined
            </span>
          ) : t.isSpreadElement(element) ? (
            <SpreadElement key={i} {...props} node={element} />
          ) : (
            <Expression key={i} {...props} node={element} />
          )
        )}
      </Join>
      <span>{`]`}</span>
    </span>
  );
}

export function AssignmentExpression(props: P<t.AssignmentExpression>) {
  const { operator, left, right } = props.node;
  const hurigana = (lang as any)[operator];

  if (typeof hurigana !== 'string') {
    return <NotImplemented node={props.node} />;
  }

  return (
    <>
      <LVal {...props} node={left} />
      <span>
        <Ruby kana={hurigana} noKana={props.noKana}>
          {` ${operator} `}
        </Ruby>
      </span>
      <Expression {...props} node={right} />
    </>
  );
}

export function BinaryExpression(props: P<t.BinaryExpression>) {
  const { operator, left, right } = props.node;
  return (
    <span>
      <Expression {...props} node={left} />
      <span>{` ${operator} `}</span>
      <Expression {...props} node={right} />
    </span>
  );
}

export function InterpreterDirective(props: P<t.InterpreterDirective>) {
  return <NotImplemented node={props.node} />;
}

export function Directive(props: P<t.Directive>) {
  return <NotImplemented node={props.node} />;
}

export function DirectiveLiteral(props: P<t.DirectiveLiteral>) {
  return <NotImplemented node={props.node} />;
}

export function BlockStatement(props: P<t.BlockStatement>) {
  const { body } = props.node;
  return (
    <Block>
      <>
        {body.map((node, i) => (
          <Statement key={i} {...props} node={node} />
        ))}
      </>
    </Block>
  );
}

interface IBlockProps {
  children?: React.ReactNode;
  inline?: boolean;
}

function Block(props: IBlockProps) {
  const children = [
    <span key="{">{`{`}</span>,
    <div key="children" style={{ paddingLeft: 16 }}>
      {props.children}
    </div>,
    <span key="}">{`}`}</span>
  ];

  return props.inline ? (
    <>{children}</>
  ) : (
    <div style={{ border: '1px solid #aaaaaa' }}>{children}</div>
  );
}

export function BreakStatement(props: P<t.BreakStatement>) {
  return (
    <div>
      <span>break;</span>
    </div>
  );
}

export function CallExpression(props: P<t.CallExpression>) {
  return <CallImpl {...props} />;
}

function CallImpl(props: P<t.CallExpression | t.NewExpression>) {
  const { callee, arguments: args } = props.node;
  return (
    <>
      <Expression {...props} node={callee} />
      <span>{`(`}</span>
      <Join>
        {args.map((argument, i) =>
          t.isExpression(argument) ? (
            <Expression key={i} {...props} node={argument} />
          ) : t.isSpreadElement(argument) ? (
            <SpreadElement key={i} {...props} node={argument} />
          ) : (
            <NotImplemented key={i} node={argument} />
          )
        )}
      </Join>
      <span>{`)`}</span>
    </>
  );
}

export function CatchClause(props: P<t.CatchClause>) {
  const { param, body } = props.node;
  return (
    <>
      <span>catch </span>
      <span>{`(`}</span>
      {param ? <Identifier {...props} node={param} /> : null}
      <span>{`)`}</span>
      <BlockStatement {...props} node={body} />
    </>
  );
}

export function ConditionalExpression(props: P<t.ConditionalExpression>) {
  const { test, consequent, alternate } = props.node;
  return (
    <span>
      <Expression {...props} node={test} />
      <span>
        <Ruby kana={lang['?']} noKana={props.noKana}>
          {' ?'}
        </Ruby>
      </span>
      <Expression {...props} node={consequent} />
      <span>
        <Ruby kana={lang[':']} noKana={props.noKana}>
          {' :'}
        </Ruby>
      </span>
      <Expression {...props} node={alternate} />
    </span>
  );
}

export function ContinueStatement(props: P<t.ContinueStatement>) {
  return (
    <div>
      <Ruby kana={lang.continue} noKana={props.noKana}>
        continue
      </Ruby>
    </div>
  );
}

export function DebuggerStatement(props: P<t.DebuggerStatement>) {
  const { leadingComments, trailingComments } = props.node;
  return (
    <div>
      <Comments comments={leadingComments} />
      <Ruby kana={lang.debugger}>debugger</Ruby>
      <Comments comments={trailingComments} />
    </div>
  );
}

export function DoWhileStatement(props: P<t.DoWhileStatement>) {
  const { test, body } = props.node;
  return (
    <div>
      <span>do</span>
      <Statement {...props} node={body} />
      <span>
        <Ruby kana={lang['do while']} noKana={props.noKana}>
          <span>while </span>
          <span>{`(`}</span>
          <Expression {...props} noKana node={test} />
          <span>{`)`}</span>
        </Ruby>
      </span>
    </div>
  );
}

export function EmptyStatement(props: P<t.EmptyStatement>) {
  return null;
}

export function ExpressionStatement(props: P<t.ExpressionStatement>) {
  const { expression } = props.node;
  return (
    <div
      style={{
        paddingTop: '1em',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline'
      }}
    >
      <Expression {...props} node={expression} />
    </div>
  );
}

export function File(props: P<t.File>) {
  const { program } = props.node;
  return <Program {...props} node={program} />;
}

export function ForInStatement(props: P<t.ForInStatement>) {
  const { left, right, body } = props.node;
  return (
    <div>
      <span>for </span>
      <span>{`(`}</span>
      {t.isVariableDeclaration(left) ? (
        <VariableDeclaration {...props} node={left} />
      ) : (
        <LVal {...props} node={left} />
      )}
      <span> in </span>
      <Expression {...props} node={right} />
      <span>{`)`}</span>
      <Statement {...props} node={body} />
    </div>
  );
}

export function ForStatement(props: P<t.ForStatement>) {
  const { init, test, update, body } = props.node;
  const [collapsed, setCollapsed] = React.useState(true);

  const header = (
    <div>
      <span>for </span>
      <span>{`(`}</span>
      {t.isVariableDeclaration(init) ? (
        <VariableDeclaration {...props} node={init} />
      ) : t.isExpression(init) ? (
        <Expression {...props} node={init} />
      ) : null}
      <span>; </span>
      {test ? <Expression {...props} node={test} /> : null}
      <span>; </span>
      {update ? <Expression {...props} node={update} /> : null}
      <span>{`)`}</span>
      <CollapseButton collapsed={collapsed} setter={setCollapsed} />
    </div>
  );

  return collapsed ? (
    header
  ) : (
    <div>
      {header}
      <Statement {...props} node={body} />
    </div>
  );
}

export function FunctionDeclaration(props: P<t.FunctionDeclaration>) {
  return (
    <div>
      <FunctionImpl {...props} />
    </div>
  );
}

export function FunctionExpression(props: P<t.FunctionExpression>) {
  return (
    <span>
      <FunctionImpl {...props} />
    </span>
  );
}

function FunctionImpl(props: P<t.FunctionExpression | t.FunctionDeclaration>) {
  const { async, body, generator, id } = props.node;
  const [collapsed, setCollapsed] = React.useState(true);

  const keyword = 'function' + (generator ? '* ' : ' ');

  return (
    <>
      <CollapseButton collapsed={collapsed} setter={setCollapsed} />
      {async ? <span>async </span> : null}
      {collapsed ? (
        <span>
          <Ruby kana={lang['function(){}']} noKana={props.noKana}>
            {`${keyword}${id ? id.name : ''} ( ) { }`}
          </Ruby>
        </span>
      ) : (
        <span>
          <span>{keyword}</span>
          {id ? <Identifier {...props} node={id} /> : null}
          <span> </span>
          <ParamsImpl {...props} />
          <BlockStatement {...props} node={body} />
        </span>
      )}
    </>
  );
}

export function Identifier(props: P<t.Identifier>) {
  const { name, decorators, typeAnnotation } = props.node;
  if (typeAnnotation) {
    return <NotImplemented node={typeAnnotation} />;
  }
  if (decorators) {
    return <NotImplemented node={decorators[0]} />;
  }
  const kana = props.noKana ? '' : props.kana[name] || '';
  return (
    <span>
      {name === 'undefined' ? (
        <Ruby kana={lang.undefined} noKana={props.noKana}>
          undefined
        </Ruby>
      ) : (
        <Ruby kana={kana} noKana={!kana}>
          {name}
        </Ruby>
      )}
    </span>
  );
}

export function IfStatement(props: P<t.IfStatement>) {
  const { alternate, consequent, test } = props.node;
  return (
    <div>
      <span>if </span>
      <span>{`(`}</span>
      <Expression {...props} node={test} />
      <span>{`)`}</span>
      {t.isExpressionStatement(consequent) ? (
        <Block>
          <Statement {...props} node={consequent} />
        </Block>
      ) : (
        <Statement {...props} node={consequent} />
      )}
      {alternate ? (
        <>
          <span>else </span>
          {t.isExpressionStatement(alternate) ? (
            <Block>
              <Statement {...props} node={alternate} />
            </Block>
          ) : (
            <Statement {...props} node={alternate} />
          )}
        </>
      ) : null}
    </div>
  );
}

export function LabeledStatement(props: P<t.LabeledStatement>) {
  const { label, body } = props.node;
  return (
    <div>
      <Identifier {...props} node={label} />
      <span>: </span>
      <Statement {...props} node={body} />
    </div>
  );
}

export function StringLiteral(props: P<t.StringLiteral>) {
  const { type, value } = props.node;
  const [activeNode, dispatch] = useSelector(state => state.activeNode);
  const setActiveNode = React.useCallback(() => {
    dispatch(actions.setActive({ node: props.node }));
  }, [props.node]);
  const clearActiveNode = React.useCallback(() => {
    dispatch(actions.clearActive());
  }, []);
  const node = useProxy(props.node);

  const onUpdate = React.useCallback(
    (newValue: string) => {
      const { value, start, end } = props.node;
      if (start === null || end === null) return;
      dispatch(
        actions.input({
          change: {
            node,
            prevValue: value,
            nextValue: newValue,
            prevString: `'${value}'`,
            nextString: `'${newValue}'`
          }
        })
      );
    },
    [props.node]
  );
  const ref = React.useRef<HTMLSpanElement>(null);
  const width = ref.current ? ref.current.getBoundingClientRect().width : 0;

  return activeNode === props.node ? (
    <InputMutator
      type={type}
      width={Math.max(32, width)}
      defaultValue={value}
      onUpdate={onUpdate}
      onEnd={clearActiveNode}
    />
  ) : (
    <>
      <span>'</span>
      <span
        ref={ref}
        onClick={setActiveNode}
        style={{
          backgroundColor: '#ff835d',
          borderRadius: 2,
          padding: '0.125em 0.5em',
          lineHeight: '1.5em',
          marginRight: '0.25em',
          marginLeft: '0.25em',
          cursor: 'pointer'
        }}
      >
        {value}
      </span>
      <span>'</span>
    </>
  );
}

export function NumericLiteral(props: P<t.NumericLiteral>) {
  const { type, value } = props.node;
  const [activeNode, dispatch] = useSelector(state => state.activeNode);
  const setActiveNode = React.useCallback(() => {
    dispatch(actions.setActive({ node: props.node }));
  }, [props.node]);
  const clearActiveNode = React.useCallback(() => {
    dispatch(actions.clearActive());
  }, []);
  const node = useProxy(props.node);

  const onUpdate = React.useCallback(
    (input: string) => {
      const { value } = props.node;
      dispatch(
        actions.input({
          change: {
            node,
            prevValue: value,
            nextValue: parseFloat(input),
            prevString: value.toString(),
            nextString: input
          }
        })
      );
    },
    [props.node]
  );
  const ref = React.useRef<HTMLSpanElement>(null);
  const width = ref.current ? ref.current.getBoundingClientRect().width : 0;

  const style: React.CSSProperties = {
    backgroundColor: 'rgb(18, 124, 201)',
    padding: '0.125em 0.5em',
    lineHeight: '1.5em',
    color: 'white',
    borderRadius: 3,
    marginRight: '0.25em',
    marginLeft: '0.25em',
    cursor: 'pointer'
  };

  return activeNode === props.node ? (
    <InputMutator
      type={type}
      width={Math.max(32, width)}
      defaultValue={value.toString()}
      onUpdate={onUpdate}
      onEnd={clearActiveNode}
    />
  ) : (
    <>
      <span ref={ref} onClick={setActiveNode} style={style}>
        {value}
      </span>
    </>
  );
}

export function NullLiteral(props: P<t.NullLiteral>) {
  return (
    <span>
      <Ruby kana={lang.null} noKana={props.noKana}>
        null
      </Ruby>
    </span>
  );
}

export function BooleanLiteral(props: P<t.BooleanLiteral>) {
  const { type, value } = props.node;
  const [activeNode, dispatch] = useSelector(state => state.activeNode);
  const setActiveNode = React.useCallback(() => {
    dispatch(actions.setActive({ node: props.node }));
  }, [props.node]);
  const clearActiveNode = React.useCallback(() => {
    dispatch(actions.clearActive());
  }, []);
  const node = useProxy(props.node);

  const onUpdate = React.useCallback(
    (input: string) => {
      const { value } = props.node;
      dispatch(
        actions.input({
          change: {
            node,
            prevValue: value,
            nextValue: input === 'true',
            prevString: value.toString(),
            nextString: input
          }
        })
      );
    },
    [props.node]
  );
  const ref = React.useRef<HTMLSpanElement>(null);
  const width = ref.current ? ref.current.getBoundingClientRect().width : 0;

  return activeNode === props.node ? (
    <InputMutator
      type={type}
      width={Math.max(32, width)}
      defaultValue={value.toString()}
      onUpdate={onUpdate}
      onEnd={clearActiveNode}
    />
  ) : (
    <>
      <span
        ref={ref}
        onClick={setActiveNode}
        style={{
          backgroundColor: '#47ffff',
          padding: '0.125em 0.5em',
          lineHeight: '1.5em',
          borderRadius: 2,
          marginRight: '0.25em',
          marginLeft: '0.25em',
          cursor: 'pointer'
        }}
      >
        <Ruby kana={value ? lang.true : lang.false} noKana={props.noKana}>
          {value.toString()}
        </Ruby>
      </span>
    </>
  );
}

export function RegExpLiteral(props: P<t.RegExpLiteral>) {
  const { pattern, flags } = props.node;
  return (
    <span>
      <span>/</span>
      <span>{pattern}</span>
      <span>/</span>
      <span>{flags}</span>
    </span>
  );
}

export function LogicalExpression(props: P<t.LogicalExpression>) {
  const { operator, left, right } = props.node;
  return (
    <span>
      <Expression {...props} node={left} />
      <span> {operator} </span>
      <Expression {...props} node={right} />
    </span>
  );
}

export function MemberExpression(props: P<t.MemberExpression>) {
  const { object, property, computed } = props.node;
  const key = props.noKana ? '' : joinMemberNames(props.node, '.');
  const kana = props.kana[key] || '';

  return (
    <>
      <Ruby kana={kana} noKana={!kana}>
        <Expression
          {...props}
          node={object}
          noKana={props.noKana || Boolean(kana)}
        />
        {computed ? <span>{`[`}</span> : <span>.</span>}
        {t.isExpression(property) ? (
          <Expression {...props} node={property} noKana />
        ) : (
          <NotImplemented node={props.node} />
        )}
        {computed ? <span>{`]`}</span> : null}
      </Ruby>
    </>
  );
}

function joinMemberNames(node: t.MemberExpression, delimiter = '.'): string {
  const { object, property } = node;
  const left = t.isMemberExpression(object)
    ? joinMemberNames(object, delimiter)
    : t.isIdentifier(object)
    ? object.name
    : '';
  if (!left) return '';
  const right = t.isIdentifier(property)
    ? property.name
    : t.isStringLiteral(property)
    ? property.value
    : '';
  if (!right) return '';
  return left + delimiter + right;
}

export function NewExpression(props: P<t.NewExpression>) {
  return (
    <>
      <span>new </span>
      <CallImpl {...props} />
    </>
  );
}

export function Program(props: P<t.Program>) {
  return (
    <div>
      {props.node.body.map((node, i) => (
        <Statement key={i} {...props} node={node} />
      ))}
    </div>
  );
}

export function ObjectExpression(props: P<t.ObjectExpression>) {
  const { properties } = props.node;
  const [collapsed, setCollapsed] = React.useState(true);
  return (
    <>
      <CollapseButton collapsed={collapsed} setter={setCollapsed} />
      {collapsed ? (
        <span>
          <Ruby kana={lang.object} noKana={props.noKana}>
            {`{ }`}
          </Ruby>
        </span>
      ) : (
        <Block inline>
          {properties.map((property, i) =>
            t.isObjectMember(property) ? (
              <ObjectMember key={i} {...props} node={property} />
            ) : (
              <SpreadElement key={i} {...props} node={property} />
            )
          )}
        </Block>
      )}
    </>
  );
}

export function ObjectMethod(props: P<t.ObjectMethod>) {
  const {
    kind,
    key,
    body,
    computed,
    async,
    decorators,
    generator
  } = props.node;

  if (decorators) {
    return <NotImplemented node={props.node} />;
  }

  return (
    <div>
      {kind === 'method' ? null : <span>{kind} </span>}
      <span>
        {async ? <span>async </span> : null}
        {generator ? <span>* </span> : null}
        {computed ? <span>{`[`}</span> : null}
        {t.isExpression(key) ? (
          <Expression {...props} node={key} />
        ) : (
          <NotImplemented node={props.node} />
        )}
        {computed ? <span>{`]`}</span> : null}
      </span>
      <ParamsImpl {...props} />
      <BlockStatement {...props} node={body} />
    </div>
  );
}

export function ObjectProperty(props: P<t.ObjectProperty>) {
  const { key, value, computed, shorthand } = props.node;
  return (
    <span>
      {computed ? <span>{`[`}</span> : null}
      {t.isExpression(key) ? (
        <Expression {...props} node={key} />
      ) : (
        <NotImplemented node={key} />
      )}
      {computed ? <span>{`]`}</span> : null}
      <span style={shorthand ? { opacity: 0.1 } : {}}>
        <span>: </span>
        {t.isPatternLike(value) ? (
          <PatternLike {...props} node={value} />
        ) : (
          <Expression {...props} node={value} />
        )}
      </span>
    </span>
  );
}

export function RestElement(props: P<t.RestElement>) {
  const { argument, decorators } = props.node;
  if (decorators) {
    return <NotImplemented node={props.node} />;
  }
  return (
    <span>
      <span>...</span>
      <LVal {...props} node={argument} />
    </span>
  );
}

export function ReturnStatement(props: P<t.ReturnStatement>) {
  const { argument } = props.node;
  return (
    <div>
      <span>return{argument ? ' ' : ''}</span>
      {argument && <Expression {...props} node={argument} />}
      <span>;</span>
    </div>
  );
}

export function SequenceExpression(props: P<t.SequenceExpression>) {
  const { expressions } = props.node;
  return (
    <span>
      <span>{`(`}</span>
      <Join>
        {expressions.map((expression, i) => (
          <Expression key={i} {...props} node={expression} />
        ))}
      </Join>
      <span>{`)`}</span>
    </span>
  );
}

export function ParenthesizedExpression(props: P<t.ParenthesizedExpression>) {
  const { expression } = props.node;
  return (
    <>
      <span>{`(`}</span>
      <Expression {...props} node={expression} />
      <span>{`)`}</span>
    </>
  );
}

export function SwitchCase(props: P<t.SwitchCase>) {
  const { test, consequent, leadingComments, trailingComments } = props.node;
  return (
    <div>
      {test ? (
        <>
          <span>case </span>
          <Expression {...props} node={test} />
          <span>:</span>
        </>
      ) : (
        <span>default:</span>
      )}
      <div style={{ paddingLeft: 16 }}>
        {consequent.map((statement, i) => (
          <Statement key={i} {...props} node={statement} />
        ))}
      </div>
    </div>
  );
}

export function SwitchStatement(props: P<t.SwitchStatement>) {
  const { cases, discriminant, leadingComments, trailingComments } = props.node;

  return (
    <div>
      <span>switch </span>
      <span>(</span>
      <Expression {...props} node={discriminant} />
      <span>)</span>
      <div>
        <Block>
          <>
            {cases.map((case_, i) => (
              <SwitchCase key={i} {...props} node={case_} />
            ))}
          </>
        </Block>
      </div>
    </div>
  );
}

export function ThisExpression(props: P<t.ThisExpression>) {
  return <span>this</span>;
}

export function ThrowStatement(props: P<t.ThrowStatement>) {
  const { argument, leadingComments, trailingComments } = props.node;
  return (
    <div>
      <Comments comments={leadingComments} />
      <span>throw{argument ? ' ' : ''}</span>
      {argument && <Expression {...props} node={argument} />}
      <span>;</span>
      <Comments comments={trailingComments} />
    </div>
  );
}

export function TryStatement(props: P<t.TryStatement>) {
  const { block, handler, finalizer } = props.node;
  return (
    <div>
      <span>try </span>
      <BlockStatement {...props} node={block} />
      {handler ? <CatchClause {...props} node={handler} /> : null}
      {finalizer ? (
        <>
          <span>finalize</span>
          <BlockStatement {...props} node={finalizer} />
        </>
      ) : null}
    </div>
  );
}

export function UnaryExpression(props: P<t.UnaryExpression>) {
  const { operator, argument } = props.node;
  return (
    <span>
      <span>{operator + ' '}</span>
      <Expression {...props} node={argument} />
    </span>
  );
}

export function UpdateExpression(props: P<t.UpdateExpression>) {
  const { operator, argument, prefix } = props.node;
  return (
    <span>
      {prefix ? <span>{operator}</span> : null}
      <Expression {...props} node={argument} />
      {prefix ? null : <span>{operator}</span>}
    </span>
  );
}

export function VariableDeclaration(props: P<t.VariableDeclaration>) {
  const { kind, declarations } = props.node;
  const hurigana = (lang as any)[kind];
  if (typeof hurigana !== 'string') {
    return <NotImplemented node={props.node} />;
  }
  return (
    <>
      {declarations.map((declarator, i) => (
        <div key={i}>
          <Ruby kana={hurigana} noKana={props.noKana}>
            {kind + ' '}
          </Ruby>
          <VariableDeclarator {...props} node={declarator} />
        </div>
      ))}
    </>
  );
}

export function VariableDeclarator(props: P<t.VariableDeclarator>) {
  const { id, init } = props.node;
  return (
    <span>
      <LVal {...props} node={id} />
      {init ? (
        <>
          <span>
            <Ruby kana={lang.init} noKana={props.noKana}>
              {` = `}
            </Ruby>
          </span>
          <Expression {...props} node={init} />
        </>
      ) : null}
    </span>
  );
}

export function WhileStatement(props: P<t.WhileStatement>) {
  const { test, body, leadingComments, trailingComments } = props.node;
  return (
    <div>
      <Comments comments={leadingComments} />
      <Ruby kana={lang.while}>
        <span>while </span>
        <span>(</span>
        <Expression {...props} node={test} />
        <span>)</span>
      </Ruby>
      <Statement {...props} node={body} />
      <Comments comments={trailingComments} />
    </div>
  );
}

export function WithStatement(props: P<t.WithStatement>) {
  return <NotImplemented node={props.node} />;
}

export function AssignmentPattern(props: P<t.AssignmentPattern>) {
  const { left, right, decorators } = props.node;
  if (decorators) {
    return <NotImplemented node={props.node} />;
  }
  return (
    <span>
      <LVal {...props} node={left} />
      <span>
        <Ruby kana={lang.assignmentPattern} noKana={props.noKana}>
          {` = `}
        </Ruby>
      </span>
      <Expression {...props} node={right} />
    </span>
  );
}

export function ArrayPattern(props: P<t.ArrayPattern>) {
  const { elements, decorators } = props.node;
  if (decorators) {
    return <NotImplemented node={props.node} />;
  }
  return (
    <span>
      <span>{`[`}</span>
      <Join>
        {elements.map((element, i) =>
          element ? (
            <PatternLike key={i} {...props} node={element} />
          ) : (
            <small key={i}>スキップ</small>
          )
        )}
      </Join>
      <span>{`]`}</span>
    </span>
  );
}

export function ArrowFunctionExpression(props: P<t.ArrowFunctionExpression>) {
  const { body, async } = props.node;
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <>
      <CollapseButton collapsed={collapsed} setter={setCollapsed} />
      {async ? <span>async </span> : null}
      {collapsed ? (
        <span>
          <Ruby kana={lang['()=>{}']} noKana={props.noKana}>
            {`( ) => { }`}
          </Ruby>
        </span>
      ) : (
        <>
          <ParamsImpl {...props} />
          <span> => </span>
          {t.isBlockStatement(body) ? (
            <BlockStatement {...props} node={body} />
          ) : (
            <Expression {...props} node={body} />
          )}
        </>
      )}
    </>
  );
}

export function ClassBody(props: P<t.ClassBody>) {
  const { body } = props.node;
  return (
    <>
      {body.map((member, i) =>
        t.isMethod(member) ? (
          <Method key={i} {...props} node={member} />
        ) : t.isProperty(member) ? (
          <Property key={i} {...props} node={member} />
        ) : (
          <NotImplemented node={member} />
        )
      )}
    </>
  );
  return <NotImplemented node={props.node} />;
}

export function ClassDeclaration(props: P<t.ClassDeclaration>) {
  return (
    <div>
      <ClassImpl {...props} />
    </div>
  );
}

export function ClassExpression(props: P<t.ClassExpression>) {
  return (
    <span>
      <ClassImpl {...props} />
    </span>
  );
}

function ClassImpl(props: P<t.ClassDeclaration | t.ClassExpression>) {
  const { id, superClass, body, decorators } = props.node;
  const [collapsed, setCollapsed] = React.useState(true);

  if (decorators) {
    return <NotImplemented node={props.node} />;
  }

  return (
    <>
      <CollapseButton collapsed={collapsed} setter={setCollapsed} />
      {collapsed ? (
        <span>
          <Ruby kana={lang['class{}']} noKana={props.noKana}>
            {`class ${id ? id.name : ''} { }`}
          </Ruby>
        </span>
      ) : (
        <>
          <span>class </span>
          {id ? <Identifier {...props} node={id} /> : null}
          {superClass ? (
            <>
              <span>
                <Ruby kana={lang.extends}>extends </Ruby>
              </span>
              <Expression {...props} node={superClass} />
            </>
          ) : null}
          <Block>
            <ClassBody {...props} node={body} />
          </Block>
        </>
      )}
    </>
  );
}

export function ExportAllDeclaration(props: P<t.ExportAllDeclaration>) {
  const { source } = props.node;
  return (
    <div>
      <span>export * from </span>
      <StringLiteral {...props} node={source} />
    </div>
  );
}

export function ExportDefaultDeclaration(props: P<t.ExportDefaultDeclaration>) {
  const { declaration } = props.node;
  return (
    <div>
      <span>export default </span>
      {t.isDeclaration(declaration) ? (
        <Declaration {...props} node={declaration} />
      ) : t.isExpression(declaration) ? (
        <Expression {...props} node={declaration} />
      ) : null}
    </div>
  );
}

export function ExportNamedDeclaration(props: P<t.ExportNamedDeclaration>) {
  const { declaration, specifiers, source } = props.node;

  return (
    <div>
      <span>export </span>
      {declaration ? <Declaration {...props} node={declaration} /> : null}
      <span>{`{ `}</span>
      <Join>
        {specifiers.map((specifier, i) =>
          t.isExportSpecifier(specifier) ? (
            <ExportSpecifier key={i} {...props} node={specifier} />
          ) : t.isExportDefaultSpecifier(specifier) ? (
            <ExportDefaultSpecifier key={i} {...props} node={specifier} />
          ) : (
            <ExportNamespaceSpecifier key={i} {...props} node={specifier} />
          )
        )}
      </Join>
      <span>{` }`}</span>
    </div>
  );
}

export function ExportSpecifier(props: P<t.ExportSpecifier>) {
  const { local, exported } = props.node;
  const shorthand = local.name === exported.name;
  return (
    <span>
      <Identifier {...props} node={local} />
      {shorthand ? null : (
        <>
          <Ruby kana={lang.idStart + exported.name + lang.idEnd + lang.as}>
            <span> as </span>
            <Identifier {...props} noKana node={exported} />
          </Ruby>
        </>
      )}
    </span>
  );
}

export function ForOfStatement(props: P<t.ForOfStatement>) {
  const { left, right, body, await: await_ } = props.node;
  const [collapsed, setCollapsed] = React.useState(true);

  const header = (
    <div>
      <span>for </span>
      {await_ ? <span>await </span> : null}
      <span>(</span>
      {t.isVariableDeclaration(left) ? (
        <VariableDeclaration {...props} node={left} />
      ) : (
        <LVal {...props} node={left} />
      )}
      <span> of </span>
      <Expression {...props} node={right} />
      <span>)</span>
      <CollapseButton collapsed={collapsed} setter={setCollapsed} />
    </div>
  );

  return collapsed ? (
    header
  ) : (
    <div>
      {header}
      <Statement {...props} node={body} />
    </div>
  );
}

export function ImportDeclaration(props: P<t.ImportDeclaration>) {
  const { specifiers, source } = props.node;
  const [first, second] = specifiers;
  const defaultSpecifier = t.isImportDefaultSpecifier(first) ? first : null;
  const target = defaultSpecifier ? second : first;
  const namespaceSpecifier = t.isImportNamespaceSpecifier(target)
    ? target
    : null;
  const rest = specifiers.filter(
    s => s !== defaultSpecifier && s !== namespaceSpecifier
  );

  return (
    <div>
      <span>import </span>
      {defaultSpecifier ? (
        <ImportDefaultSpecifier {...props} node={defaultSpecifier} />
      ) : null}
      {namespaceSpecifier ? (
        <>
          {defaultSpecifier ? <span>, </span> : null}
          <ImportNamespaceSpecifier {...props} node={namespaceSpecifier} />
        </>
      ) : null}
      {rest.length > 0 ? (
        <>
          {defaultSpecifier ? <span>, </span> : null}
          <span>{`{ `}</span>
          <Join>
            {rest.map((specifier, i) =>
              t.isImportSpecifier(specifier) ? (
                <ImportSpecifier key={i} {...props} node={specifier} />
              ) : (
                <NotImplemented key={i} node={specifier} />
              )
            )}
          </Join>
          <span>{` }`}</span>
        </>
      ) : null}
      <span> from </span>
      <StringLiteral {...props} node={source} />
    </div>
  );
}

export function ImportDefaultSpecifier(props: P<t.ImportDefaultSpecifier>) {
  const { local } = props.node;
  return (
    <span>
      <Identifier {...props} node={local} />
    </span>
  );
}

export function ImportNamespaceSpecifier(props: P<t.ImportNamespaceSpecifier>) {
  const { local } = props.node;
  return (
    <span>
      <span>* as </span>
      <Identifier {...props} node={local} />
    </span>
  );
}

export function ImportSpecifier(props: P<t.ImportSpecifier>) {
  const { local, imported } = props.node;
  const shorthand = local.name === imported.name;
  return (
    <span>
      <Identifier {...props} node={imported} />
      {shorthand ? null : <span> as </span>}
      {shorthand ? null : <Identifier {...props} node={local} />}
    </span>
  );
}

export function MetaProperty(props: P<t.MetaProperty>) {
  return <NotImplemented node={props.node} />;
}

export function ClassMethod(props: P<t.ClassMethod>) {
  const { kind, key, params, body, computed, static: static_ } = props.node;
  return (
    <div>
      {static_ ? <span>static </span> : null}
      {kind === 'method' ? null : <span>{kind} </span>}
      {computed ? <span>{`[`}</span> : null}
      <Expression {...props} node={key} />
      {computed ? <span>{`]`}</span> : null}
      <ParamsImpl {...props} />
      <BlockStatement {...props} node={body} />
    </div>
  );
}

export function ObjectPattern(props: P<t.ObjectPattern>) {
  const { properties } = props.node;
  return (
    <>
      <span>{`{ `}</span>
      <Join>
        {properties.map((property, i) =>
          t.isObjectProperty(property) ? (
            <ObjectProperty key={i} {...props} node={property} />
          ) : (
            <RestElement key={i} {...props} node={property} />
          )
        )}
      </Join>
      <span>{` }`}</span>
    </>
  );
}

export function SpreadElement(props: P<t.SpreadElement>) {
  const { argument } = props.node;
  return (
    <span>
      <span>...</span>
      <Expression {...props} node={argument} />
    </span>
  );
}

export function Super(props: P<t.Super>) {
  return <NotImplemented node={props.node} />;
}

export function TaggedTemplateExpression(props: P<t.TaggedTemplateExpression>) {
  const { tag, quasi } = props.node;
  return (
    <span>
      <Expression {...props} node={tag} />
      <TemplateLiteral {...props} node={quasi} />
    </span>
  );
}

export function TemplateElement(props: P<t.TemplateElement>) {
  const { value } = props.node;
  const str = value.raw || value.cooked;
  if (typeof str !== 'string') {
    return <NotImplemented node={props.node} />;
  }
  return <span>{str}</span>;
}

export function TemplateLiteral(props: P<t.TemplateLiteral>) {
  const { quasis, expressions } = props.node;
  const slots = Array.from({ length: quasis.length + expressions.length });

  return (
    <span>
      <span>`</span>
      {slots.map((_, i) =>
        i % 2 === 0 ? (
          <TemplateElement key={i} {...props} node={quasis[i / 2]} />
        ) : (
          <span key={i}>
            <span>{'${'}</span>
            <Expression {...props} node={expressions[(i / 2) >> 0]} />
            <span>{'}'}</span>
          </span>
        )
      )}
      <span>`</span>
    </span>
  );
}

export function YieldExpression(props: P<t.YieldExpression>) {
  return <NotImplemented node={props.node} />;
}

export function AnyTypeAnnotation(props: P<t.AnyTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function ArrayTypeAnnotation(props: P<t.ArrayTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function BooleanTypeAnnotation(props: P<t.BooleanTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function BooleanLiteralTypeAnnotation(
  props: P<t.BooleanLiteralTypeAnnotation>
) {
  return <NotImplemented node={props.node} />;
}

export function NullLiteralTypeAnnotation(
  props: P<t.NullLiteralTypeAnnotation>
) {
  return <NotImplemented node={props.node} />;
}

export function ClassImplements(props: P<t.ClassImplements>) {
  return <NotImplemented node={props.node} />;
}

export function DeclareClass(props: P<t.DeclareClass>) {
  return <NotImplemented node={props.node} />;
}

export function DeclareFunction(props: P<t.DeclareFunction>) {
  return <NotImplemented node={props.node} />;
}

export function DeclareInterface(props: P<t.DeclareInterface>) {
  return <NotImplemented node={props.node} />;
}

export function DeclareModule(props: P<t.DeclareModule>) {
  return <NotImplemented node={props.node} />;
}

export function DeclareModuleExports(props: P<t.DeclareModuleExports>) {
  return <NotImplemented node={props.node} />;
}

export function DeclareTypeAlias(props: P<t.DeclareTypeAlias>) {
  return <NotImplemented node={props.node} />;
}

export function DeclareOpaqueType(props: P<t.DeclareOpaqueType>) {
  return <NotImplemented node={props.node} />;
}

export function DeclareVariable(props: P<t.DeclareVariable>) {
  return <NotImplemented node={props.node} />;
}

export function DeclareExportDeclaration(props: P<t.DeclareExportDeclaration>) {
  return <NotImplemented node={props.node} />;
}

export function DeclareExportAllDeclaration(
  props: P<t.DeclareExportAllDeclaration>
) {
  return <NotImplemented node={props.node} />;
}

export function DeclaredPredicate(props: P<t.DeclaredPredicate>) {
  return <NotImplemented node={props.node} />;
}

export function ExistsTypeAnnotation(props: P<t.ExistsTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function FunctionTypeAnnotation(props: P<t.FunctionTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function FunctionTypeParam(props: P<t.FunctionTypeParam>) {
  return <NotImplemented node={props.node} />;
}

export function GenericTypeAnnotation(props: P<t.GenericTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function InferredPredicate(props: P<t.InferredPredicate>) {
  return <NotImplemented node={props.node} />;
}

export function InterfaceExtends(props: P<t.InterfaceExtends>) {
  return <NotImplemented node={props.node} />;
}

export function InterfaceDeclaration(props: P<t.InterfaceDeclaration>) {
  return <NotImplemented node={props.node} />;
}

export function InterfaceTypeAnnotation(props: P<t.InterfaceTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function IntersectionTypeAnnotation(
  props: P<t.IntersectionTypeAnnotation>
) {
  return <NotImplemented node={props.node} />;
}

export function MixedTypeAnnotation(props: P<t.MixedTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function EmptyTypeAnnotation(props: P<t.EmptyTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function NullableTypeAnnotation(props: P<t.NullableTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function NumberLiteralTypeAnnotation(
  props: P<t.NumberLiteralTypeAnnotation>
) {
  return <NotImplemented node={props.node} />;
}

export function NumberTypeAnnotation(props: P<t.NumberTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function ObjectTypeAnnotation(props: P<t.ObjectTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function ObjectTypeInternalSlot(props: P<t.ObjectTypeInternalSlot>) {
  return <NotImplemented node={props.node} />;
}

export function ObjectTypeCallProperty(props: P<t.ObjectTypeCallProperty>) {
  return <NotImplemented node={props.node} />;
}

export function ObjectTypeIndexer(props: P<t.ObjectTypeIndexer>) {
  return <NotImplemented node={props.node} />;
}

export function ObjectTypeProperty(props: P<t.ObjectTypeProperty>) {
  return <NotImplemented node={props.node} />;
}

export function ObjectTypeSpreadProperty(props: P<t.ObjectTypeSpreadProperty>) {
  return <NotImplemented node={props.node} />;
}

export function OpaqueType(props: P<t.OpaqueType>) {
  return <NotImplemented node={props.node} />;
}

export function QualifiedTypeIdentifier(props: P<t.QualifiedTypeIdentifier>) {
  return <NotImplemented node={props.node} />;
}

export function StringLiteralTypeAnnotation(
  props: P<t.StringLiteralTypeAnnotation>
) {
  return <NotImplemented node={props.node} />;
}

export function StringTypeAnnotation(props: P<t.StringTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function ThisTypeAnnotation(props: P<t.ThisTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function TupleTypeAnnotation(props: P<t.TupleTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function TypeofTypeAnnotation(props: P<t.TypeofTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function TypeAlias(props: P<t.TypeAlias>) {
  return <NotImplemented node={props.node} />;
}

export function TypeAnnotation(props: P<t.TypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function TypeCastExpression(props: P<t.TypeCastExpression>) {
  return <NotImplemented node={props.node} />;
}

export function TypeParameter(props: P<t.TypeParameter>) {
  return <NotImplemented node={props.node} />;
}

export function TypeParameterDeclaration(props: P<t.TypeParameterDeclaration>) {
  return <NotImplemented node={props.node} />;
}

export function TypeParameterInstantiation(
  props: P<t.TypeParameterInstantiation>
) {
  return <NotImplemented node={props.node} />;
}

export function UnionTypeAnnotation(props: P<t.UnionTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function Variance(props: P<t.Variance>) {
  return <NotImplemented node={props.node} />;
}

export function VoidTypeAnnotation(props: P<t.VoidTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function JSXAttribute(props: P<t.JSXAttribute>) {
  return <NotImplemented node={props.node} />;
}

export function JSXClosingElement(props: P<t.JSXClosingElement>) {
  return <NotImplemented node={props.node} />;
}

export function JSXElement(props: P<t.JSXElement>) {
  return <NotImplemented node={props.node} />;
}

export function JSXEmptyExpression(props: P<t.JSXEmptyExpression>) {
  return <NotImplemented node={props.node} />;
}

export function JSXExpressionContainer(props: P<t.JSXExpressionContainer>) {
  return <NotImplemented node={props.node} />;
}

export function JSXSpreadChild(props: P<t.JSXSpreadChild>) {
  return <NotImplemented node={props.node} />;
}

export function JSXIdentifier(props: P<t.JSXIdentifier>) {
  return <NotImplemented node={props.node} />;
}

export function JSXMemberExpression(props: P<t.JSXMemberExpression>) {
  return <NotImplemented node={props.node} />;
}

export function JSXNamespacedName(props: P<t.JSXNamespacedName>) {
  return <NotImplemented node={props.node} />;
}

export function JSXOpeningElement(props: P<t.JSXOpeningElement>) {
  return <NotImplemented node={props.node} />;
}

export function JSXSpreadAttribute(props: P<t.JSXSpreadAttribute>) {
  return <NotImplemented node={props.node} />;
}

export function JSXText(props: P<t.JSXText>) {
  return <NotImplemented node={props.node} />;
}

export function JSXFragment(props: P<t.JSXFragment>) {
  return <NotImplemented node={props.node} />;
}

export function JSXOpeningFragment(props: P<t.JSXOpeningFragment>) {
  return <NotImplemented node={props.node} />;
}

export function JSXClosingFragment(props: P<t.JSXClosingFragment>) {
  return <NotImplemented node={props.node} />;
}

export function Noop(props: P<t.Noop>) {
  return <NotImplemented node={props.node} />;
}

export function Placeholder(props: P<t.Placeholder>) {
  return <NotImplemented node={props.node} />;
}

export function ArgumentPlaceholder(props: P<t.ArgumentPlaceholder>) {
  return <NotImplemented node={props.node} />;
}

export function AwaitExpression(props: P<t.AwaitExpression>) {
  const { argument } = props.node;
  return (
    <span>
      <span>await </span>
      <Expression {...props} node={argument} />
    </span>
  );
}

export function BindExpression(props: P<t.BindExpression>) {
  return <NotImplemented node={props.node} />;
}

export function ClassProperty(props: P<t.ClassProperty>) {
  return <NotImplemented node={props.node} />;
}

export function OptionalMemberExpression(props: P<t.OptionalMemberExpression>) {
  return <NotImplemented node={props.node} />;
}

export function PipelineTopicExpression(props: P<t.PipelineTopicExpression>) {
  return <NotImplemented node={props.node} />;
}

export function PipelineBareFunction(props: P<t.PipelineBareFunction>) {
  return <NotImplemented node={props.node} />;
}

export function PipelinePrimaryTopicReference(
  props: P<t.PipelinePrimaryTopicReference>
) {
  return <NotImplemented node={props.node} />;
}

export function OptionalCallExpression(props: P<t.OptionalCallExpression>) {
  return <NotImplemented node={props.node} />;
}

export function ClassPrivateProperty(props: P<t.ClassPrivateProperty>) {
  return <NotImplemented node={props.node} />;
}

export function ClassPrivateMethod(props: P<t.ClassPrivateMethod>) {
  return <NotImplemented node={props.node} />;
}

export function Import(props: P<t.Import>) {
  return <NotImplemented node={props.node} />;
}

export function Decorator(props: P<t.Decorator>) {
  return <NotImplemented node={props.node} />;
}

export function DoExpression(props: P<t.DoExpression>) {
  return <NotImplemented node={props.node} />;
}

export function ExportDefaultSpecifier(props: P<t.ExportDefaultSpecifier>) {
  return <NotImplemented node={props.node} />;
}

export function ExportNamespaceSpecifier(props: P<t.ExportNamespaceSpecifier>) {
  return <NotImplemented node={props.node} />;
}

export function PrivateName(props: P<t.PrivateName>) {
  return <NotImplemented node={props.node} />;
}

export function BigIntLiteral(props: P<t.BigIntLiteral>) {
  return <NotImplemented node={props.node} />;
}

export function TSParameterProperty(props: P<t.TSParameterProperty>) {
  return <NotImplemented node={props.node} />;
}

export function TSDeclareFunction(props: P<t.TSDeclareFunction>) {
  return <NotImplemented node={props.node} />;
}

export function TSDeclareMethod(props: P<t.TSDeclareMethod>) {
  return <NotImplemented node={props.node} />;
}

export function TSQualifiedName(props: P<t.TSQualifiedName>) {
  return <NotImplemented node={props.node} />;
}

export function TSCallSignatureDeclaration(
  props: P<t.TSCallSignatureDeclaration>
) {
  return <NotImplemented node={props.node} />;
}

export function TSConstructSignatureDeclaration(
  props: P<t.TSConstructSignatureDeclaration>
) {
  return <NotImplemented node={props.node} />;
}

export function TSPropertySignature(props: P<t.TSPropertySignature>) {
  return <NotImplemented node={props.node} />;
}

export function TSMethodSignature(props: P<t.TSMethodSignature>) {
  return <NotImplemented node={props.node} />;
}

export function TSIndexSignature(props: P<t.TSIndexSignature>) {
  return <NotImplemented node={props.node} />;
}

export function TSAnyKeyword(props: P<t.TSAnyKeyword>) {
  return <NotImplemented node={props.node} />;
}

export function TSUnknownKeyword(props: P<t.TSUnknownKeyword>) {
  return <NotImplemented node={props.node} />;
}

export function TSNumberKeyword(props: P<t.TSNumberKeyword>) {
  return <NotImplemented node={props.node} />;
}

export function TSObjectKeyword(props: P<t.TSObjectKeyword>) {
  return <NotImplemented node={props.node} />;
}

export function TSBooleanKeyword(props: P<t.TSBooleanKeyword>) {
  return <NotImplemented node={props.node} />;
}

export function TSStringKeyword(props: P<t.TSStringKeyword>) {
  return <NotImplemented node={props.node} />;
}

export function TSSymbolKeyword(props: P<t.TSSymbolKeyword>) {
  return <NotImplemented node={props.node} />;
}

export function TSVoidKeyword(props: P<t.TSVoidKeyword>) {
  return <NotImplemented node={props.node} />;
}

export function TSUndefinedKeyword(props: P<t.TSUndefinedKeyword>) {
  return <NotImplemented node={props.node} />;
}

export function TSNullKeyword(props: P<t.TSNullKeyword>) {
  return <NotImplemented node={props.node} />;
}

export function TSNeverKeyword(props: P<t.TSNeverKeyword>) {
  return <NotImplemented node={props.node} />;
}

export function TSThisType(props: P<t.TSThisType>) {
  return <NotImplemented node={props.node} />;
}

export function TSFunctionType(props: P<t.TSFunctionType>) {
  return <NotImplemented node={props.node} />;
}

export function TSConstructorType(props: P<t.TSConstructorType>) {
  return <NotImplemented node={props.node} />;
}

export function TSTypeReference(props: P<t.TSTypeReference>) {
  return <NotImplemented node={props.node} />;
}

export function TSTypePredicate(props: P<t.TSTypePredicate>) {
  return <NotImplemented node={props.node} />;
}

export function TSTypeQuery(props: P<t.TSTypeQuery>) {
  return <NotImplemented node={props.node} />;
}

export function TSTypeLiteral(props: P<t.TSTypeLiteral>) {
  return <NotImplemented node={props.node} />;
}

export function TSArrayType(props: P<t.TSArrayType>) {
  return <NotImplemented node={props.node} />;
}

export function TSTupleType(props: P<t.TSTupleType>) {
  return <NotImplemented node={props.node} />;
}

export function TSOptionalType(props: P<t.TSOptionalType>) {
  return <NotImplemented node={props.node} />;
}

export function TSRestType(props: P<t.TSRestType>) {
  return <NotImplemented node={props.node} />;
}

export function TSUnionType(props: P<t.TSUnionType>) {
  return <NotImplemented node={props.node} />;
}

export function TSIntersectionType(props: P<t.TSIntersectionType>) {
  return <NotImplemented node={props.node} />;
}

export function TSConditionalType(props: P<t.TSConditionalType>) {
  return <NotImplemented node={props.node} />;
}

export function TSInferType(props: P<t.TSInferType>) {
  return <NotImplemented node={props.node} />;
}

export function TSParenthesizedType(props: P<t.TSParenthesizedType>) {
  return <NotImplemented node={props.node} />;
}

export function TSTypeOperator(props: P<t.TSTypeOperator>) {
  return <NotImplemented node={props.node} />;
}

export function TSIndexedAccessType(props: P<t.TSIndexedAccessType>) {
  return <NotImplemented node={props.node} />;
}

export function TSMappedType(props: P<t.TSMappedType>) {
  return <NotImplemented node={props.node} />;
}

export function TSLiteralType(props: P<t.TSLiteralType>) {
  return <NotImplemented node={props.node} />;
}

export function TSExpressionWithTypeArguments(
  props: P<t.TSExpressionWithTypeArguments>
) {
  return <NotImplemented node={props.node} />;
}

export function TSInterfaceDeclaration(props: P<t.TSInterfaceDeclaration>) {
  return <NotImplemented node={props.node} />;
}

export function TSInterfaceBody(props: P<t.TSInterfaceBody>) {
  return <NotImplemented node={props.node} />;
}

export function TSTypeAliasDeclaration(props: P<t.TSTypeAliasDeclaration>) {
  return <NotImplemented node={props.node} />;
}

export function TSAsExpression(props: P<t.TSAsExpression>) {
  return <NotImplemented node={props.node} />;
}

export function TSTypeAssertion(props: P<t.TSTypeAssertion>) {
  return <NotImplemented node={props.node} />;
}

export function TSEnumDeclaration(props: P<t.TSEnumDeclaration>) {
  return <NotImplemented node={props.node} />;
}

export function TSEnumMember(props: P<t.TSEnumMember>) {
  return <NotImplemented node={props.node} />;
}

export function TSModuleDeclaration(props: P<t.TSModuleDeclaration>) {
  return <NotImplemented node={props.node} />;
}

export function TSModuleBlock(props: P<t.TSModuleBlock>) {
  return <NotImplemented node={props.node} />;
}

export function TSImportType(props: P<t.TSImportType>) {
  return <NotImplemented node={props.node} />;
}

export function TSImportEqualsDeclaration(
  props: P<t.TSImportEqualsDeclaration>
) {
  return <NotImplemented node={props.node} />;
}

export function TSExternalModuleReference(
  props: P<t.TSExternalModuleReference>
) {
  return <NotImplemented node={props.node} />;
}

export function TSNonNullExpression(props: P<t.TSNonNullExpression>) {
  return <NotImplemented node={props.node} />;
}

export function TSExportAssignment(props: P<t.TSExportAssignment>) {
  return <NotImplemented node={props.node} />;
}

export function TSNamespaceExportDeclaration(
  props: P<t.TSNamespaceExportDeclaration>
) {
  return <NotImplemented node={props.node} />;
}

export function TSTypeAnnotation(props: P<t.TSTypeAnnotation>) {
  return <NotImplemented node={props.node} />;
}

export function TSTypeParameterInstantiation(
  props: P<t.TSTypeParameterInstantiation>
) {
  return <NotImplemented node={props.node} />;
}

export function TSTypeParameterDeclaration(
  props: P<t.TSTypeParameterDeclaration>
) {
  return <NotImplemented node={props.node} />;
}

export function TSTypeParameter(props: P<t.TSTypeParameter>) {
  return <NotImplemented node={props.node} />;
}

function ParamsImpl(
  props: P<
    | t.FunctionDeclaration
    | t.FunctionExpression
    | t.ArrowFunctionExpression
    | t.ObjectMethod
    | t.ClassMethod
    | t.ClassPrivateMethod
  >
) {
  const { params } = props.node;
  return (
    <>
      <span>{`(`}</span>
      <Join>
        {params.map((param, i) => (
          <LVal key={i} {...props} node={param} />
        ))}
      </Join>
      <span>{`)`}</span>
    </>
  );
}

function CollapseButton(props: {
  collapsed: boolean;
  setter: (value: boolean) => void;
}) {
  const { collapsed, setter: onClick } = props;
  return (
    <button onClick={() => onClick(!collapsed)}>
      {collapsed ? '▶︎' : '▼'}
    </button>
  );
}

function Join(props: {
  children: React.ReactNode[];
  delimiterStyle?: React.CSSProperties;
}) {
  return (
    <>
      {props.children.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <span style={props.delimiterStyle}>, </span> : null}
          {item}
        </React.Fragment>
      ))}
    </>
  );
}

interface IRubyProps {
  kana: string;
  noKana?: boolean;
  children: React.ReactNode | React.ReactNode[];
}

function Ruby(props: IRubyProps) {
  return props.noKana ? (
    <>{props.children}</>
  ) : (
    <ruby>
      {props.children}
      <rt>{props.kana}</rt>
    </ruby>
  );
}
