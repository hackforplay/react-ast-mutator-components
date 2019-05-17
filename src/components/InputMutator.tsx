import * as t from '@babel/types';
import * as React from 'react';

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

const escapeBooleanLiteral = (str: string) => {
  const invalid = str !== 'true' && str !== 'false';
  return { escaped: str, invalid };
};

type InputMutatorProps = {
  type:
    | t.NumericLiteral['type']
    | t.StringLiteral['type']
    | t.BooleanLiteral['type'];
  defaultValue: string;
  onUpdate: (value: string) => void;
  style?: React.CSSProperties;
};

export function InputMutator(props: InputMutatorProps) {
  const [value, setValue] = React.useState(props.defaultValue);
  const [invalid, setInvalid] = React.useState(false);

  const confirm = () => {
    if (invalid) return;
    props.onUpdate(value);
  };

  const style = {
    ...(props.style || {}),
    ...(invalid ? { backgroundColor: 'red' } : {})
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
            : props.type === 'BooleanLiteral'
            ? escapeBooleanLiteral(value)
            : escapeStringLiteral(value);
        setInvalid(invalid);
        setValue(escaped);
      }}
      onKeyDown={e => e.key === 'Enter' && confirm()}
      onBlur={() => confirm()}
      style={style}
    />
  );
}
