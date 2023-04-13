import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
  KeyboardEvent,
  isValidElement,
} from 'react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import {
  Editable,
  Slate,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import { withShortcuts } from './plugins/withShortcuts';
import { isHotkey } from 'is-hotkey';

type Props = {
  plugins?: any[];
  value: Descendant[];
  onChange(value: Descendant[]): void;
  readOnly?: boolean;
};

const noOp = () => {};

export const WeekEditor = (props: Props) => {
  const { value, onChange, readOnly, plugins = [] } = props;
  const [editor] = useState(() =>
    withShortcuts(plugins)(withReact(withHistory(createEditor())))
  );

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

    const renderLeaf = (props: RenderLeafProps) => {
      for (const plugin of plugins) {
        if (plugin.renderLeaf) {
          const element = plugin.renderLeaf(props);
          if (element && isValidElement(element)) {
            return element;
          }
        }
      }

      return <span {...props} />;
    };

    const handlers = plugins.reduce((prev, plugin) => {
      if (plugin.handlers) {
        for (const handler in plugin.handlers) {
          prev[handler] = plugin.handlers[handler];
        }
      }

      return prev;
    }, {});

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      for (const plugin of plugins) {
        if (plugin.hotkeys) {
          for (const hotkey of plugin.hotkeys) {
            if (isHotkey(hotkey[0], event) && hotkey[1]) {
              event.preventDefault();
              hotkey[1](event, editor);
            }
          }
        }

        if (plugin.handlers?.onKeyDown) {
          plugin.handlers.onKeyDown(event, editor);
        }
      }
    };

    return (
      <Editable
        {...handlers}
        onKeyDown={handleKeyDown}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        readOnly={readOnly}
      />
    );
  }, [readOnly]);

  const Context = useCallback(
    ({ children }: { children: ReactNode }) => {
      return plugins.reduce((prev, current) => {
        if (!current.renderContext) {
          return prev;
        }

        return <>{current.renderContext(children)}</>;
      }, <>{children}</>);
    },
    [plugins]
  );

  const Ui = useCallback(
    () =>
      (
        <>
          {plugins
            .filter((p) => Boolean(p.ui))
            .map((p) => (
              <React.Fragment>{p.ui({ readOnly })}</React.Fragment>
            ))}
        </>
      ),
    []
  );

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Ui />
      <Context>
        <SlateEditable />
      </Context>
    </Slate>
  );
};

const BaseElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};
