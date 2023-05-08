import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
  KeyboardEvent,
  isValidElement,
  ReactElement,
} from 'react';
import { createEditor, Element, Descendant, Editor } from 'slate';
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
import { IPlugin, IPluginHandlers } from './types';
import styles from './styles.module.css';

type Props = {
  plugins?: IPlugin[];
  value: Descendant[];
  onChange(value: Descendant[]): void;
  readOnly?: boolean;
};

const noOp = () => {};

export const WeekEditor = (props: Props) => {
  const { value, onChange, readOnly = false, plugins = [] } = props;
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
    const renderElement = (props: RenderElementProps): ReactElement => {
      let result = null;
      for (const plugin of plugins) {
        for (const element of plugin.elements || []) {
          if (!element.isLeaf) {
            const newElement = element.render(props, editor);
            result = newElement || result;
          }
        }
      }

      console.log(result);

      for (const plugin of plugins) {
        if (plugin.renderElement) {
          const newElement = plugin.renderElement(
            {
              ...props,
              children: result || <BaseElement {...props} />,
            },
            editor
          );

          result = newElement || result;
        }
      }

      return result || <BaseElement {...props} />;
    };

    const renderLeaf = (props: RenderLeafProps) => {
      let result;
      for (const plugin of plugins) {
        plugin.elements?.map((element) => {
          if (element.isLeaf) {
            const newElement = element.render(props, editor);
            if (newElement && isValidElement(newElement)) {
              result = newElement;
            }
          }
        });
      }

      return result || <span {...props.attributes}>{props.children}</span>;
    };

    const handlerNames = ['onKeyDown', 'onChange'] as const;

    const handlers = handlerNames.reduce((handlers, name) => {
      handlers[name] = (event: any) => {
        plugins.forEach((plugin) => {
          const handler = plugin.handlers?.[name];

          if (handler) {
            handler(event);
          }
        });
      };

      return handlers;
    }, {} as Record<keyof IPluginHandlers, (event: Event) => void>);

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
          plugin.handlers.onKeyDown(event);
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
    () => (
      <>
        {plugins
          .filter((p) => Boolean(p.ui))
          .map((p) => (
            <React.Fragment>{p.ui!({ readOnly })}</React.Fragment>
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
  return (
    <p {...props.attributes} className={styles.paragraph}>
      {props.children}
    </p>
  );
};
