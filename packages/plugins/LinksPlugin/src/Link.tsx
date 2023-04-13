import { useEffect, useState, useRef } from 'react';
import { useSlateSelection, RenderElementProps } from 'slate-react';
import { useLinksState } from './LinksPlugin';
import styles from './styles.module.css';

export const Link = ({ attributes, children, element }: RenderElementProps) => {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const open = useLinksState((state) => state.open);
  const selection = useSlateSelection();

  const handleClick = (event: MouseEvent) => {
    if (event.metaKey || event.ctrlKey) {
      window.open(element.url, '_blank');
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (selection) {
      setOpen(false);
    }
  }, [selection]);

  const handleOpen = () => {
    window.open(element.url, '_blank');
    setOpen(false);
  };

  const handleEdit = () => {
    const box = ref.current.getBoundingClientRect();
    open(box, element.url);
    setOpen(false);
  };

  return (
    <span className={styles.link} ref={ref}>
      <a
        {...attributes}
        onClick={handleClick}
        href={element.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <InlineChromiumBugfix />
        {children}
        <InlineChromiumBugfix />
      </a>
      {isOpen && (
        <div contentEditable={false} className={styles.hint}>
          <button className={styles.hintButton} onClick={handleOpen}>
            open
          </button>
          <button className={styles.hintButton} onClick={handleEdit}>
            edit
          </button>
        </div>
      )}
    </span>
  );
};

const InlineChromiumBugfix = () => {
  return (
    <span style={{ fontSize: 0 }} contentEditable={false}>
      ${String.fromCodePoint(160)}
    </span>
  );
};
