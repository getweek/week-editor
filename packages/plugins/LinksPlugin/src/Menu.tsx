import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Editor, Element, Range, Transforms } from 'slate';
import { useSlateStatic, useFocused, useSlateSelection } from 'slate-react';
import { ELEMENT_LINK } from './types';
import styles from './styles.module.css';

const checkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    strokeWidth="1.25"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M5 12l5 5l10 -10"></path>
  </svg>
);

const crossIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    strokeWidth="1.25"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M18 6l-12 12"></path>
    <path d="M6 6l12 12"></path>
  </svg>
);

type Props = {
  elementBox: DOMRect;
  isOpen: boolean;
  link: string;
  onOpen(): void;
  onClose(): void;
};

export const Menu = ({ isOpen, elementBox, link, onClose }: Props) => {
  const [value, setValue] = useState(link);
  const [style, setStyle] = useState(undefined);
  const ref = useRef(null);
  const inputRef = useRef(null);

  const editor = useSlateStatic();
  const isFocused = useFocused();
  const selection = useSlateSelection();

  useEffect(() => {
    setValue(link);
  }, [link]);

  useEffect(() => {
    const element = ref.current;

    if (isOpen) {
      inputRef.current.focus();

      setStyle({
        opacity: 1,
        transform: 'scale(1)',
        top: `${elementBox.top + window.scrollY - element.offsetHeight}px`,
        left: `${
          elementBox.left +
          window.scrollX -
          element.offsetHeight * 2 +
          elementBox.width / 2
        }px`,
      });
    }
  }, [isOpen, elementBox]);

  useEffect(() => {
    if (selection && isOpen) {
      onClose();
    }
  }, [selection]);

  const insertLink = (event) => {
    event.preventDefault();

    const { selection } = editor;

    const isCollapsed = selection && Range.isCollapsed(selection);

    const [link] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && n.type === ELEMENT_LINK,
    });

    if (link) {
      Transforms.setNodes(
        editor,
        {
          type: ELEMENT_LINK,
          url: value,
        },
        {
          match: (n) => Element.isElement(n) && n.type === ELEMENT_LINK,
        }
      );
    } else if (isCollapsed) {
      Transforms.insertNodes(editor, {
        type: ELEMENT_LINK,
        url: value,
        children: [{ text: value }],
      });
      Transforms.move(editor, {
        unit: 'offset',
      });
    } else {
      Transforms.wrapNodes(
        editor,
        {
          type: ELEMENT_LINK,
          url: value,
          children: [],
        },
        {
          split: true,
        }
      );
      Transforms.move(editor, {
        unit: 'offset',
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    insertLink(event);
    setValue('');
    onClose();
  };

  const handleClose = () => {
    setValue('');
    onClose();
  };

  return createPortal(
    <>
      <form
        ref={ref}
        style={isOpen ? style : undefined}
        className={styles.menu}
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          placeholder="Type url address"
          className={styles.input}
          type="text"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
        <button type="submit" className={styles.button}>
          {checkIcon}
        </button>
        <button type="button" className={styles.button} onClick={handleClose}>
          {crossIcon}
        </button>
      </form>
    </>,
    document.body
  );
};
