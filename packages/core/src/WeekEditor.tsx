import React, { useState, useCallback, useEffect } from 'react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact, RenderElementProps } from 'slate-react';

type Props = {
  plugins?: any[];
  value: Descendant[];
  onChange(value: Descendant[]): void;
  readOnly?: boolean;
};

const noOp = () => {};

export const WeekEditor = (props: Props) => {
  const { value, onChange, readOnly, plugins = [] } = props;
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  useEffect(() => {
    plugins.reduce((prev, plugin) => {
      if (plugin.init) {
        return plugin.init(prev);
      }
      return prev;
    }, editor);
  }, []);

  const SlateEditable = useCallback(() => {
    const renderElement = (props: RenderElementProps) => {
      const element = plugins.reduce((prev, plugin) => {
        if (plugin.renderElement) {
          const newElement = plugin.renderElement(
            {
              ...props,
              children: prev ? prev : props.children,
            },
            editor
          );

          return newElement || prev;
        } else {
          return prev;
        }
      }, null);

      return (
        element || (
          <BaseElement {...props.attributes}>{props.children}</BaseElement>
        )
      );
    };

    const handlers = plugins.reduce((prev, plugin) => {
      if (plugin.handlers) {
        for (const handler in plugin.handlers) {
          prev[handler] = plugin.handlers[handler];
        }
      }

      return prev;
    }, {});

    return (
      <Editable
        {...handlers}
        renderElement={renderElement}
        readOnly={readOnly}
      />
    );
  }, [readOnly]);

  const Context = useCallback(
    ({ children }) => {
      return plugins.reduce((prev, current) => {
        if (!current.renderContext) {
          return prev;
        }

        return <>{current.renderContext(children)}</>;
      }, <>{children}</>);
    },
    [plugins, editor]
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Context>
        <SlateEditable />
      </Context>
    </Slate>
  );
};

const BaseElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};
