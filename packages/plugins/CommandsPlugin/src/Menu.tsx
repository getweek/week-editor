import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useSlateStatic } from 'slate-react';
import { useCommands, Options } from './CommandsPlugin';
import styles from './styles.module.css';

type Props = {
  box: DOMRect;
  options: Options;
  onClose(): void;
};

export const Menu = ({ box, options, onClose }: Props) => {
  const [index, setIndex] = useState(0);
  const filter = useCommands((state) => state.filter);
  const setFilter = useCommands((state) => state.setFilter);

  const editor = useSlateStatic();

  const commands = options.commands.filter((command) => {
    return command.title
      .toLocaleLowerCase()
      .includes(filter.toLocaleLowerCase());
  });

  const style = useMemo(
    () => ({
      left: `${box?.left}px`,
      top: `${box?.top + 8}px`,
      opacity: 1,
      transform: 'scale(1)',
    }),
    [box]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowUp': {
          event.preventDefault();
          setIndex((index) => (index === 0 ? commands.length - 1 : index - 1));
          break;
        }
        case 'ArrowDown': {
          event.preventDefault();
          setIndex((index) => (index === commands.length - 1 ? 0 : index + 1));
          break;
        }
        case 'Enter': {
          event.preventDefault();
          commands[index].action(editor);
          setIndex(0);
          setFilter('');
          onClose();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [index]);

  return createPortal(
    <menu className={styles.menu} style={style}>
      <ul>
        {commands.map((command, i) => (
          <li
            key={command.title}
            className={index === i ? styles.active : undefined}
          >
            {command.title}
          </li>
        ))}
      </ul>
    </menu>,
    document.body
  );
};
