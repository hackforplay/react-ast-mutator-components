import * as t from '@babel/types';
import * as React from 'react';
import * as AnyNodes from './AnyNodes';
import { NodeProps as P } from './types';

export function Expression<T extends t.Expression>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Binary<T extends t.Binary>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Scopable<T extends t.Scopable>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function BlockParent<T extends t.BlockParent>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Block<T extends t.Block>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Statement<T extends t.Statement>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Terminatorless<T extends t.Terminatorless>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function CompletionStatement<T extends t.CompletionStatement>(
  props: P<T>
) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Conditional<T extends t.Conditional>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Loop<T extends t.Loop>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function While<T extends t.While>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function ExpressionWrapper<T extends t.ExpressionWrapper>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function For<T extends t.For>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function ForXStatement<T extends t.ForXStatement>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Function<T extends t.Function>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function FunctionParent<T extends t.FunctionParent>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Pureish<T extends t.Pureish>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Declaration<T extends t.Declaration>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function PatternLike<T extends t.PatternLike>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function LVal<T extends t.LVal>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function TSEntityName<T extends t.TSEntityName>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Literal<T extends t.Literal>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Immutable<T extends t.Immutable>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function UserWhitespacable<T extends t.UserWhitespacable>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Method<T extends t.Method>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function ObjectMember<T extends t.ObjectMember>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Property<T extends t.Property>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function UnaryLike<T extends t.UnaryLike>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Pattern<T extends t.Pattern>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Class<T extends t.Class>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function ModuleDeclaration<T extends t.ModuleDeclaration>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function ExportDeclaration<T extends t.ExportDeclaration>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function ModuleSpecifier<T extends t.ModuleSpecifier>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Flow<T extends t.Flow>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function FlowType<T extends t.FlowType>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function FlowBaseAnnotation<T extends t.FlowBaseAnnotation>(
  props: P<T>
) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function FlowDeclaration<T extends t.FlowDeclaration>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function FlowPredicate<T extends t.FlowPredicate>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function JSX<T extends t.JSX>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function Private<T extends t.Private>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function TSTypeElement<T extends t.TSTypeElement>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
export function TSType<T extends t.TSType>(props: P<T>) {
  const Component = AnyNodes[props.node.type] as React.ComponentType<P<T>>;
  return <Component {...props} />;
}
