import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Editor, Range } from 'slate';
import { useFocused, useSlate, useSlateSelection } from 'slate-react';
import { Options } from './types';
import { create } from 'zustand';
import styles from './styles.module.css';

export const useMenuState = create((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export const Menu = ({ options }: { options: Options }) => {
  const [style, setStyle] = useState(undefined);
  const ref = useRef(null);

  const isOpen = useMenuState((state) => state.isOpen);
  const open = useMenuState((state) => state.open);

  const selection = useSlateSelection();
  const editor = useSlate();
  const isFocused = useFocused();

  useEffect(() => {
    const element = ref.current;
    const { selection } = editor;

    if (
      !selection ||
      !isFocused ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      setStyle(undefined);
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection?.getRangeAt(0);
    const rect = domRange?.getBoundingClientRect();

    open();
    setStyle({
      opacity: 1,
      transform: 'scale(1)',
      top: `${(rect?.top || 0) + window.scrollY - element.offsetHeight}px`,
      left: `${
        (rect?.left || 0) +
        window.scrollX -
        element.offsetWidth / 2 +
        (rect?.width || 0) / 2
      }px`,
    });
  }, [selection]);

  return createPortal(
    <div
      ref={ref}
      style={isOpen ? style : undefined}
      className={styles.menu}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
    >
      {options.content(editor)}
    </div>,
    document.body
  );
};
