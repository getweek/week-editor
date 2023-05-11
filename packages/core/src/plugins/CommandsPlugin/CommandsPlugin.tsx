import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Editor, Node } from 'slate';
import {
  ReactEditor,
  RenderElementProps,
  useReadOnly,
  useSelected,
} from 'slate-react';
import { create } from 'zustand';
import { FullEditor, IPlugin } from '../../types';
import { Menu } from './Menu';
import styles from './styles.module.css';

type Store = {
  filter: string;
  setFilter(filter: string): void;
  isOpen: boolean;
  open(): void;
  close(): void;
};

export const useCommands = create<Store>((set) => ({
  filter: '',
  setFilter: (filter) => set({ filter }),
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export type Options = {
  plugins: IPlugin[];
};

export class CommandsPlugin implements IPlugin {
  constructor(private options: Options) {}

  init(editor: FullEditor) {
    const { onChange, insertText } = editor;

    editor.insertText = (text: string) => {
      if (text === '/') {
        useCommands.setState({ isOpen: true });
      }

      insertText(text);
    };

    editor.onChange = (...args) => {
      const isOpen = useCommands.getState().isOpen;

      if (isOpen) {
        const filter = /\/(.*)/g.exec(getCurrentText(editor));
        useCommands.setState({
          filter: filter?.[1] || '',
          isOpen: Boolean(filter),
        });
      }

      return onChange(...args);
    };

    return editor;
  }

  renderElement(props: RenderElementProps, editor: Editor & ReactEditor) {
    const isSelected = useSelected();
    const isReadOnly = useReadOnly();
    const ref = useRef<HTMLDivElement>(null);
    const [box, setBox] = useState<DOMRect | null>(null);
    const isOpen = useCommands((state) => state.isOpen);
    const open = useCommands((state) => state.open);
    const close = useCommands((state) => state.close);

    const entity = Editor.above(editor, {
      mode: 'lowest',
    });

    const ignoreList = useMemo(() => {
      return this.options.plugins.reduce((ignoreList, plugin) => {
        (plugin.elements || []).forEach((element) => {
          if (element.hasPlaceholder === false) {
            ignoreList.push(element.type);
          }
        });

        return ignoreList;
      }, [] as string[]);
    }, []);

    const isIgnored = ignoreList.includes(props.element.type);
    const isEmpty = !entity || Node.string(entity[0]) === '';

    useEffect(() => {
      if (isOpen) {
        const box = ref.current?.getBoundingClientRect();

        if (box) {
          setBox(box);
          open();
        }
      }
    }, [isOpen]);

    if (editor.isInline(props.element) || isIgnored) {
      return props.children;
    }

    return (
      <>
        <div
          ref={ref}
          className={
            isEmpty && isSelected && !isReadOnly
              ? styles.hasPlaceholder
              : undefined
          }
        >
          {props.children}
        </div>
        {isOpen && isSelected && box && (
          <Menu options={this.options} box={box} onClose={close} />
        )}
      </>
    );
  }
}

const getCurrentText = (editor: Editor) => {
  const entry = Editor.above(editor, {
    match: (n: Node) => Editor.isBlock(editor, n),
  });

  if (entry) {
    const text = Node.string(entry[0]);
    return text;
  } else {
    return '';
  }
};
