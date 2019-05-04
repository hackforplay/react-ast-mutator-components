import * as t from '@babel/types';
import * as React from 'react';
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
      {elements.map((element, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <span style={{ borderRight: border }}>, </span> : null}
          {!element ? (
            <span style={{ color: '#aaaaaa' }}>undefined</span>
          ) : t.isSpreadElement(element) ? (
            <SpreadElement node={element} onUpdate={props.onUpdate} />
          ) : (
            <Expression node={element} onUpdate={props.onUpdate} />
          )}
        </React.Fragment>
      ))}
      <span>{`]`}</span>
    </span>
  );
}

export function AssignmentExpression(props: P<t.AssignmentExpression>) {
  const { operator, left, right } = props.node;
  return (
    <>
      <LVal node={left} onUpdate={props.onUpdate} />
      <span>{operator}</span>
      <Expression node={right} onUpdate={props.onUpdate} />
    </>
  );
}

export function BinaryExpression(props: P<t.BinaryExpression>) {
  const { operator, left, right } = props.node;
  return (
    <span>
      <Expression node={left} onUpdate={props.onUpdate} />
      <span>{operator}</span>
      <Expression node={right} onUpdate={props.onUpdate} />
    </span>
  );
  return <NotImplemented node={props.node} />;
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
          <Statement key={i} node={node} onUpdate={props.onUpdate} />
        ))}
      </>
    </Block>
  );
}

function Block(props: { children?: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #aaaaaa' }}>
      <span>{`{`}</span>
      <div style={{ paddingLeft: 16 }}>{props.children}</div>
      <span>{`}`}</span>
    </div>
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
  return (
    <span>
      <Call {...props} />
    </span>
  );
}

function Call(props: P<t.CallExpression | t.NewExpression>) {
  const { callee, arguments: args } = props.node;
  return (
    <>
      <Expression node={callee} onUpdate={props.onUpdate} />
      <span>{`(`}</span>
      {args.map((argument, i) =>
        t.isExpression(argument) ? (
          <Expression key={i} node={argument} onUpdate={props.onUpdate} />
        ) : t.isSpreadElement(argument) ? (
          <SpreadElement key={i} node={argument} onUpdate={props.onUpdate} />
        ) : (
          <NotImplemented key={i} node={argument} />
        )
      )}
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
      {param ? <Identifier node={param} onUpdate={props.onUpdate} /> : null}
      <span>{`)`}</span>
      <BlockStatement node={body} onUpdate={props.onUpdate} />
    </>
  );
}

export function ConditionalExpression(props: P<t.ConditionalExpression>) {
  const { test, consequent, alternate } = props.node;
  return (
    <span>
      <Expression node={test} onUpdate={props.onUpdate} />
      <span>
        <ruby>
          {' '}
          ? <rt>が真なら</rt>
        </ruby>
      </span>
      <Expression node={consequent} onUpdate={props.onUpdate} />
      <span>
        <ruby>
          {' '}
          : <rt>偽なら</rt>
        </ruby>
      </span>
      <Expression node={alternate} onUpdate={props.onUpdate} />
    </span>
  );
}

export function ContinueStatement(props: P<t.ContinueStatement>) {
  return (
    <div>
      <ruby>
        continue<rt>くり返しをやめる</rt>
      </ruby>
    </div>
  );
}

export function DebuggerStatement(props: P<t.DebuggerStatement>) {
  const { leadingComments, trailingComments } = props.node;
  return (
    <div>
      <Comments comments={leadingComments} />
      <span>debugger;</span>
      <Comments comments={trailingComments} />
    </div>
  );
}

export function DoWhileStatement(props: P<t.DoWhileStatement>) {
  const { test, body } = props.node;
  return (
    <div>
      <span>do</span>
      <Statement node={body} onUpdate={props.onUpdate} />
      <span>
        <ruby>
          <span>while </span>
          <span>{`(`}</span>
          <Expression node={test} onUpdate={props.onUpdate} />
          <span>{`)`}</span>
          <rt>真ならもう一度</rt>
        </ruby>
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
    <Block>
      <Expression node={expression} onUpdate={props.onUpdate} />
    </Block>
  );
}

export function File(props: P<t.File>) {
  const { program } = props.node;
  return <Program node={program} onUpdate={props.onUpdate} />;
}

export function ForInStatement(props: P<t.ForInStatement>) {
  const { left, right, body } = props.node;
  return (
    <div>
      <span>for </span>
      <span>{`(`}</span>
      {t.isVariableDeclaration(left) ? (
        <VariableDeclaration node={left} onUpdate={props.onUpdate} />
      ) : (
        <LVal node={left} onUpdate={props.onUpdate} />
      )}
      <span> in </span>
      <Expression node={right} onUpdate={props.onUpdate} />
      <span>{`)`}</span>
      <Statement node={body} onUpdate={props.onUpdate} />
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
        <VariableDeclaration node={init} onUpdate={props.onUpdate} />
      ) : t.isExpression(init) ? (
        <Expression node={init} onUpdate={props.onUpdate} />
      ) : null}
      <span>; </span>
      {test ? <Expression node={test} onUpdate={props.onUpdate} /> : null}
      <span>; </span>
      {update ? <Expression node={update} onUpdate={props.onUpdate} /> : null}
      <span>{`)`}</span>
      <CollapseButton collapsed={collapsed} setter={setCollapsed} />
    </div>
  );

  return collapsed ? (
    header
  ) : (
    <div>
      {header}
      <Statement node={body} onUpdate={props.onUpdate} />
    </div>
  );
}

export function FunctionDeclaration(props: P<t.FunctionDeclaration>) {
  return <FunctionImpl {...props} />;
}

export function FunctionExpression(props: P<t.FunctionExpression>) {
  return <FunctionImpl {...props} />;
}

function FunctionImpl(props: P<t.FunctionExpression | t.FunctionDeclaration>) {
  const { async, body, generator, id } = props.node;
  const [collapsed, setCollapsed] = React.useState(true);

  const header = (
    <div>
      {async ? <span>async </span> : null}
      {generator ? <span>generator </span> : null}
      <span>
        <ruby>
          function<rt>かんすう</rt>
        </ruby>
      </span>
      {id ? <Identifier node={id} onUpdate={props.onUpdate} /> : null}
      <span>()</span>
      <CollapseButton collapsed={collapsed} setter={setCollapsed} />
    </div>
  );

  return collapsed ? (
    header
  ) : (
    <div>
      {header}
      <BlockStatement node={body} onUpdate={props.onUpdate} />
    </div>
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
  return <span>{name}</span>;
}

export function IfStatement(props: P<t.IfStatement>) {
  const { alternate, consequent, test } = props.node;
  return (
    <div>
      <span>if </span>
      <span>{`(`}</span>
      <Expression node={test} onUpdate={props.onUpdate} />
      <span>{`)`}</span>
      <Statement node={consequent} onUpdate={props.onUpdate} />
      {alternate ? (
        <>
          <span>else </span>
          <Statement node={alternate} onUpdate={props.onUpdate} />
        </>
      ) : null}
    </div>
  );
}

export function LabeledStatement(props: P<t.LabeledStatement>) {
  const { label, body } = props.node;
  return (
    <div>
      <Identifier node={label} onUpdate={props.onUpdate} />
      <span>: </span>
      <Statement node={body} onUpdate={props.onUpdate} />
    </div>
  );
}

export function StringLiteral(props: P<t.StringLiteral>) {
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

export function NumericLiteral(props: P<t.NumericLiteral>) {
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

export function NullLiteral(props: P<t.NullLiteral>) {
  return (
    <span>
      <ruby>
        null<rt>ヌル</rt>
      </ruby>
    </span>
  );
}

export function BooleanLiteral(props: P<t.BooleanLiteral>) {
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
        props.node.value = newValue === 'true';
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
        <ruby>
          {value.toString()}
          <rt>{value ? '真' : '偽'}</rt>
        </ruby>
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
      <Expression node={left} onUpdate={props.onUpdate} />
      <span> {operator} </span>
      <Expression node={right} onUpdate={props.onUpdate} />
    </span>
  );
}

export function MemberExpression(props: P<t.MemberExpression>) {
  const { object, property, computed } = props.node;
  return (
    <>
      <Expression node={object} onUpdate={props.onUpdate} />
      {computed ? <span>{`[`}</span> : <span>.</span>}
      {t.isExpression(property) ? (
        <Expression node={property} onUpdate={props.onUpdate} />
      ) : (
        <NotImplemented node={props.node} />
      )}
      {computed ? <span>{`]`}</span> : null}
    </>
  );
}

export function NewExpression(props: P<t.NewExpression>) {
  return (
    <span>
      <span>new </span>
      <Call {...props} />
    </span>
  );
}

export function Program(props: P<t.Program>) {
  return (
    <div>
      {props.node.body.map((node, i) => (
        <Statement key={i} node={node} onUpdate={props.onUpdate} />
      ))}
    </div>
  );
}

export function ObjectExpression(props: P<t.ObjectExpression>) {
  const { properties } = props.node;
  return (
    <span>
      <span>{`{ `}</span>
      {properties.map((property, i) =>
        t.isObjectMember(property) ? (
          <ObjectMember key={i} node={property} onUpdate={props.onUpdate} />
        ) : (
          <SpreadElement key={i} node={property} onUpdate={props.onUpdate} />
        )
      )}
      <span>{` }`}</span>
    </span>
  );
}

export function ObjectMethod(props: P<t.ObjectMethod>) {
  return <NotImplemented node={props.node} />;
}

export function ObjectProperty(props: P<t.ObjectProperty>) {
  const { key, value, computed, shorthand } = props.node;
  return (
    <span>
      {computed ? <span>{`[`}</span> : null}
      {t.isExpression(key) ? (
        <Expression node={key} onUpdate={props.onUpdate} />
      ) : (
        <NotImplemented node={key} />
      )}
      {computed ? <span>{`]`}</span> : null}
      <span style={shorthand ? { opacity: 0.1 } : {}}>
        <span>: </span>
        {t.isPatternLike(value) ? (
          <PatternLike node={value} onUpdate={props.onUpdate} />
        ) : (
          <Expression node={value} onUpdate={props.onUpdate} />
        )}
      </span>
    </span>
  );
}

export function RestElement(props: P<t.RestElement>) {
  return <NotImplemented node={props.node} />;
}

export function ReturnStatement(props: P<t.ReturnStatement>) {
  const { argument } = props.node;
  return (
    <div>
      <span>return{argument ? ' ' : ''}</span>
      {argument && <Expression node={argument} onUpdate={props.onUpdate} />}
      <span>;</span>
    </div>
  );
}

export function SequenceExpression(props: P<t.SequenceExpression>) {
  const { expressions } = props.node;
  return (
    <span>
      <span>{`(`}</span>
      {expressions.map((expression, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <span>, </span> : null}
          <Expression node={expression} onUpdate={props.onUpdate} />
        </React.Fragment>
      ))}
      <span>{`)`}</span>
    </span>
  );
}

export function ParenthesizedExpression(props: P<t.ParenthesizedExpression>) {
  const { expression } = props.node;
  return (
    <>
      <span>{`(`}</span>
      <Expression node={expression} onUpdate={props.onUpdate} />
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
          <Expression node={test} onUpdate={props.onUpdate} />
          <span>:</span>
        </>
      ) : (
        <span>default:</span>
      )}
      <div style={{ paddingLeft: 16 }}>
        {consequent.map((statement, i) => (
          <Statement key={i} node={statement} onUpdate={props.onUpdate} />
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
      <Expression node={discriminant} onUpdate={props.onUpdate} />
      <span>)</span>
      <div>
        <Block>
          <>
            {cases.map((case_, i) => (
              <SwitchCase key={i} node={case_} onUpdate={props.onUpdate} />
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
      {argument && <Expression node={argument} onUpdate={props.onUpdate} />}
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
      <BlockStatement node={block} onUpdate={props.onUpdate} />
      {handler ? (
        <CatchClause node={handler} onUpdate={props.onUpdate} />
      ) : null}
      {finalizer ? (
        <>
          <span>finalize</span>
          <BlockStatement node={finalizer} onUpdate={props.onUpdate} />
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
      <Expression node={argument} onUpdate={props.onUpdate} />
    </span>
  );
}

export function UpdateExpression(props: P<t.UpdateExpression>) {
  const { operator, argument, prefix } = props.node;
  return (
    <span>
      {prefix ? <span>{operator}</span> : null}
      <Expression node={argument} onUpdate={props.onUpdate} />
      {prefix ? null : <span>{operator}</span>}
    </span>
  );
}

export function VariableDeclaration(props: P<t.VariableDeclaration>) {
  return (
    <span>
      <ruby>
        {props.node.kind}
        <rt>へんすう</rt>
      </ruby>
      <span />
      {props.node.declarations.map((node, i) => (
        <VariableDeclarator key={i} node={node} onUpdate={props.onUpdate} />
      ))}
    </span>
  );
}

export function VariableDeclarator(props: P<t.VariableDeclarator>) {
  const { id, init } = props.node;
  return (
    <span>
      <LVal node={id} onUpdate={props.onUpdate} />
      {init ? (
        <>
          <span>
            <ruby>
              =<rt>←</rt>
            </ruby>
          </span>
          <Expression node={init} onUpdate={props.onUpdate} />
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
      <div>
        <span>while </span>
        <span>(</span>
        <Expression node={test} onUpdate={props.onUpdate} />
        <span>)</span>
        <Statement node={body} onUpdate={props.onUpdate} />
      </div>
      <Comments comments={trailingComments} />
    </div>
  );
}

export function WithStatement(props: P<t.WithStatement>) {
  return <NotImplemented node={props.node} />;
}

export function AssignmentPattern(props: P<t.AssignmentPattern>) {
  return <NotImplemented node={props.node} />;
}

export function ArrayPattern(props: P<t.ArrayPattern>) {
  return <NotImplemented node={props.node} />;
}

export function ArrowFunctionExpression(props: P<t.ArrowFunctionExpression>) {
  return <NotImplemented node={props.node} />;
}

export function ClassBody(props: P<t.ClassBody>) {
  const { body } = props.node;
  return (
    <>
      {body.map((member, i) =>
        t.isMethod(member) ? (
          <Method key={i} node={member} onUpdate={props.onUpdate} />
        ) : t.isProperty(member) ? (
          <Property key={i} node={member} onUpdate={props.onUpdate} />
        ) : (
          <NotImplemented node={member} />
        )
      )}
    </>
  );
  return <NotImplemented node={props.node} />;
}

export function ClassDeclaration(props: P<t.ClassDeclaration>) {
  const { id, superClass, body, decorators } = props.node;
  if (superClass) {
    return <NotImplemented node={superClass} />;
  }
  if (decorators) {
    return <NotImplemented node={decorators[0]} />;
  }
  return (
    <div>
      <span>
        <ruby>
          class <rt>クラス</rt>
        </ruby>
      </span>
      {id ? <Identifier node={id} onUpdate={props.onUpdate} /> : null}
      <div>
        <Block>
          <ClassBody node={body} onUpdate={props.onUpdate} />
        </Block>
      </div>
    </div>
  );
}

export function ClassExpression(props: P<t.ClassExpression>) {
  return <NotImplemented node={props.node} />;
}

export function ExportAllDeclaration(props: P<t.ExportAllDeclaration>) {
  const { source } = props.node;
  return (
    <div>
      <span>export * from </span>
      <StringLiteral node={source} onUpdate={props.onUpdate} />
    </div>
  );
}

export function ExportDefaultDeclaration(props: P<t.ExportDefaultDeclaration>) {
  const { declaration } = props.node;
  return (
    <div>
      <span>export default </span>
      {t.isDeclaration(declaration) ? (
        <Declaration node={declaration} onUpdate={props.onUpdate} />
      ) : t.isExpression(declaration) ? (
        <Expression node={declaration} onUpdate={props.onUpdate} />
      ) : null}
    </div>
  );
}

export function ExportNamedDeclaration(props: P<t.ExportNamedDeclaration>) {
  const { declaration, specifiers, source } = props.node;

  return (
    <div>
      <span>export </span>
      {declaration ? (
        <Declaration node={declaration} onUpdate={props.onUpdate} />
      ) : null}
      <span>{`{ `}</span>
      {specifiers.map((specifier, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <span>, </span> : null}
          {t.isExportSpecifier(specifier) ? (
            <ExportSpecifier node={specifier} onUpdate={props.onUpdate} />
          ) : t.isExportDefaultSpecifier(specifier) ? (
            <ExportDefaultSpecifier
              node={specifier}
              onUpdate={props.onUpdate}
            />
          ) : (
            <ExportNamespaceSpecifier
              node={specifier}
              onUpdate={props.onUpdate}
            />
          )}
        </React.Fragment>
      ))}
      <span>{` }`}</span>
    </div>
  );
}

export function ExportSpecifier(props: P<t.ExportSpecifier>) {
  const { local, exported } = props.node;
  const shorthand = local.name === exported.name;
  return (
    <span>
      <Identifier node={local} onUpdate={props.onUpdate} />
      {shorthand ? null : (
        <ruby>
          {' '}
          as <rt>→</rt>
        </ruby>
      )}
      {shorthand ? null : (
        <Identifier node={exported} onUpdate={props.onUpdate} />
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
        <VariableDeclaration node={left} onUpdate={props.onUpdate} />
      ) : (
        <LVal node={left} onUpdate={props.onUpdate} />
      )}
      <span> of </span>
      <Expression node={right} onUpdate={props.onUpdate} />
      <span>)</span>
      <CollapseButton collapsed={collapsed} setter={setCollapsed} />
    </div>
  );

  return collapsed ? (
    header
  ) : (
    <div>
      {header}
      <Statement node={body} onUpdate={props.onUpdate} />
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
        <ImportDefaultSpecifier
          node={defaultSpecifier}
          onUpdate={props.onUpdate}
        />
      ) : null}
      {namespaceSpecifier ? (
        <>
          {defaultSpecifier ? <span>, </span> : null}
          <ImportNamespaceSpecifier
            node={namespaceSpecifier}
            onUpdate={props.onUpdate}
          />
        </>
      ) : null}
      {rest.length > 0 ? (
        <>
          {defaultSpecifier ? <span>, </span> : null}
          <span>{`{ `}</span>
          {rest.map((specifier, i) =>
            t.isImportSpecifier(specifier) ? (
              <React.Fragment key={i}>
                {i > 0 ? <span>, </span> : null}
                <ImportSpecifier node={specifier} onUpdate={props.onUpdate} />
              </React.Fragment>
            ) : (
              <NotImplemented key={i} node={specifier} />
            )
          )}
          <span>{` }`}</span>
        </>
      ) : null}
      <span> from </span>
      <StringLiteral node={source} onUpdate={props.onUpdate} />
    </div>
  );
}

export function ImportDefaultSpecifier(props: P<t.ImportDefaultSpecifier>) {
  const { local } = props.node;
  return (
    <span>
      <Identifier node={local} onUpdate={props.onUpdate} />
    </span>
  );
}

export function ImportNamespaceSpecifier(props: P<t.ImportNamespaceSpecifier>) {
  const { local } = props.node;
  return (
    <span>
      <span>* as </span>
      <Identifier node={local} onUpdate={props.onUpdate} />
    </span>
  );
}

export function ImportSpecifier(props: P<t.ImportSpecifier>) {
  const { local, imported } = props.node;
  const shorthand = local.name === imported.name;
  return (
    <span>
      <Identifier node={imported} onUpdate={props.onUpdate} />
      {shorthand ? null : <span> as </span>}
      {shorthand ? null : <Identifier node={local} onUpdate={props.onUpdate} />}
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
      <Expression node={key} onUpdate={props.onUpdate} />
      {computed ? <span>{`]`}</span> : null}
      <span>{`(`}</span>
      {params.map((param, i) =>
        t.isTSParameterProperty(param) ? (
          <NotImplemented key={i} node={param} />
        ) : (
          <PatternLike key={i} node={param} onUpdate={props.onUpdate} />
        )
      )}
      <span>{`)`}</span>
      <BlockStatement node={body} onUpdate={props.onUpdate} />
    </div>
  );
}

export function ObjectPattern(props: P<t.ObjectPattern>) {
  const { properties } = props.node;
  return (
    <>
      <span>{`{ `}</span>
      {properties.map((property, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <span>, </span> : null}
          {t.isObjectProperty(property) ? (
            <ObjectProperty key={i} node={property} onUpdate={props.onUpdate} />
          ) : (
            <RestElement key={i} node={property} onUpdate={props.onUpdate} />
          )}
        </React.Fragment>
      ))}
      <span>{` }`}</span>
    </>
  );
}

export function SpreadElement(props: P<t.SpreadElement>) {
  return <NotImplemented node={props.node} />;
}

export function Super(props: P<t.Super>) {
  return <NotImplemented node={props.node} />;
}

export function TaggedTemplateExpression(props: P<t.TaggedTemplateExpression>) {
  return <NotImplemented node={props.node} />;
}

export function TemplateElement(props: P<t.TemplateElement>) {
  return <NotImplemented node={props.node} />;
}

export function TemplateLiteral(props: P<t.TemplateLiteral>) {
  return <NotImplemented node={props.node} />;
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
  return <NotImplemented node={props.node} />;
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

function CollapseButton(props: {
  collapsed: boolean;
  setter: (value: boolean) => void;
}) {
  const { collapsed, setter: onClick } = props;
  return (
    <button onClick={() => onClick(!collapsed)}>
      {collapsed ? '◀︎' : '▼'}
    </button>
  );
}
