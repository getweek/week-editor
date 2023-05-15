import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Editor, Node } from 'slate';
import {
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
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

  renderLeaf(props: RenderLeafProps, editor: Editor & ReactEditor) {
    const isSelected = useSelected();
    const isReadOnly = useReadOnly();

    const entity = Editor.above(editor, {
      mode: 'lowest',
    });

    const isEmpty = !entity || Node.string(entity[0]) === '';

    return (
      <>
        <span {...props.attributes}>
          <span
            className={
              isEmpty && isSelected && !isReadOnly ? styles.absolute : undefined
            }
          >
            {props.children}
          </span>
          {isEmpty && isSelected && !isReadOnly && (
            <span className={styles.placeholder} contentEditable={false}>
              Type "/" to add a block
            </span>
          )}
        </span>
      </>
    );
  }

  renderElement(props: RenderElementProps, editor: Editor) {
    const ref = useRef<HTMLDivElement>(null);

    const isOpen = useCommands((state) => state.isOpen);
    const isSelected = useSelected();
    const isReadOnly = useReadOnly();
    const open = useCommands((state) => state.open);
    const close = useCommands((state) => state.close);
    const [box, setBox] = useState<DOMRect | null>(null);

    console.log(isOpen);

    useEffect(() => {
      if (isOpen) {
        const box = ref.current?.getBoundingClientRect();

        if (box) {
          setBox(box);
          open();
        }
      }
    }, [isOpen]);

    return (
      <div ref={ref}>
        {props.children}
        {isOpen && isSelected && (
          <Menu options={this.options} box={box} onClose={close} />
        )}
      </div>
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
