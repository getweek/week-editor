import { useState, useRef, useEffect, useMemo } from 'react';
import { Editor, Node, Range } from 'slate';
import {
  ReactEditor,
  RenderElementProps,
  useSelected,
  useReadOnly,
} from 'slate-react';
import { IPlugin } from '../../../core/types';
import { Menu } from './Menu';
import { create } from 'zustand';
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
  commands: Array<{
    title: string;
    action(editor: Editor): void;
  }>;
};

export class CommandsPlugin implements IPlugin {
  constructor(private options: Options) {}

  init(editor: Editor) {
    const { onChange, insertText } = editor;

    editor.insertText = (text) => {
      if (text === '/') {
        useCommands.setState({ isOpen: true });
      }

      insertText(text);
    };

    editor.onChange = (...args) => {
      const isOpen = useCommands.getState().isOpen;

      if (isOpen) {
        const filter = /\/(.*)/g.exec(getCurrentText(editor));
        useCommands.setState({ filter: filter?.[1] || '' });
      }

      return onChange(...args);
    };

    return editor;
  }

  renderElement(props: RenderElementProps, editor: ReactEditor) {
    const isSelected = useSelected();
    const isReadOnly = useReadOnly();
    const ref = useRef(null);
    const [box, setBox] = useState(null);
    const isOpen = useCommands((state) => state.isOpen);
    const open = useCommands((state) => state.open);
    const close = useCommands((state) => state.close);

    const entity = Editor.above(editor, {
      mode: 'lowest',
    });

    const isEmpty = !entity || Node.string(entity[0]) === '';

    useEffect(() => {
      if (isOpen) {
        const box = ref.current.getBoundingClientRect();
        setBox(box);
        open();
      }
    }, [isOpen]);

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
        {isOpen && isSelected && (
          <Menu options={this.options} box={box} onClose={close} />
        )}
      </>
    );
  }
}

const getCurrentText = (editor: Editor) => {
  const entry = Editor.above(editor, {
    match: (n) => Editor.isBlock(editor, n),
  });

  if (entry) {
    const text = Node.string(entry[0]);
    return text;
  } else {
    return '';
  }
};
