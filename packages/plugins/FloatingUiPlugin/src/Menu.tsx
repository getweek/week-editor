import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Editor, Range } from 'slate';
import { createPortal } from 'react-dom';
import { Options } from './types';
import styles from './styles.module.css';
import { useSlate, useFocused, useSlateSelection } from 'slate-react';

export const Menu = ({ options }: { options: Options }) => {
  const [style, setStyle] = useState(undefined);
  const ref = useRef(null);

  const selection = useSlateSelection();
  const editor = useSlate();
  const isFocused = useFocused();

  useEffect(() => {
    console.log(style);
  }, [style]);

  useEffect(() => {
    const element = ref.current;
    const { selection } = editor;

    if (!element) {
      return;
    }

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

    setStyle({
      opacity: 1,
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
      style={style}
      className={styles.menu}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
    >
      {options.buttons?.map((buttonFn, index) => {
        const button = buttonFn(editor);

        return (
          <span
            key={index}
            className={cn(styles.button, {
              [styles.active]: button.isActive(),
            })}
            onClick={() => {
              button.onClick();
            }}
          >
            {button.icon}
          </span>
        );
      })}
    </div>,
    document.body
  );
};
