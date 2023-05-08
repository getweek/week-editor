import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { Editor, Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import { useCommands, Options } from './CommandsPlugin';
import { Command } from '../../types';
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

  const commands = options.plugins.reduce((commands, plugin) => {
    const pluginCommands = (plugin.elements || []).reduce(
      (commands, element) => {
        return commands.concat(element.commands || []);
      },
      [] as Command[]
    );

    return commands.concat(pluginCommands);
  }, [] as Command[]);

  console.log(commands);

  useEffect(() => {
    setIndex(0);
  }, [filter]);

  const style = useMemo(
    () => ({
      left: `${box?.left}px`,
      top: `${box?.top + box?.height}px`,
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

          Transforms.delete(editor, {
            unit: 'character',
            distance: filter.length + 1,
            reverse: true,
          });

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
  }, [index, commands.length]);

  return createPortal(
    <menu className={styles.menu} style={style}>
      {commands.length ? (
        <ul>
          {commands.map((command, i) => (
            <li
              key={command.title}
              className={cn(styles.item, {
                [styles.active]: index === i,
              })}
            >
              <span className={styles.icon}>{command.icon}</span>
              {command.title}
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.zeroScreen}>No commands found</div>
      )}
    </menu>,
    document.body
  );
};
