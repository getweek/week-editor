import React from 'react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';

type Props = {
  plugins?: any[];
  value: Descendant[];
  onChange(value: Descendant[]): void;
  readOnly?: boolean;
};

export const WeekEditor = (props: Props) => {
  const { value, onChange, readOnly } = props;
  const editor = withReact(withHistory(createEditor()));

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Editable readOnly={readOnly} />
    </Slate>
  );
};
