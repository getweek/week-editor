import {
  BasicMarksPlugin,
  isMarkActive,
  MarkType,
  toggleBold,
  toggleItalic,
  toggleUnderline,
} from '@week/basic-marks-plugin';
import cn from 'classnames';
import { DnDPlugin } from '@week/dnd-plugin';
import { FloatingUiPlugin, useMenuState } from '@week/floating-ui-plugin';
import { LinksPlugin, useLinksState } from '@week/links-plugin';
import { SoftBreakPlugin } from '@week/soft-break-plugin';
import { HeadingsPlugin, HeadingType } from '@week/headings-plugin';
import { ListsPlugin, ListType } from '@week/lists-plugin';
import { CommandsPlugin } from '@week/commands-plugin';
import { useMemo, useState } from 'react';
import { Editor, Descendant, Range, Transforms } from 'slate';
import { WeekEditor } from './WeekEditor';
import { useFocused } from 'slate-react';

import styles from './styles.module.css';

const boldIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    stroke-width="1.25"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z"></path>
    <path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"></path>
  </svg>
);

const italicIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    stroke-width="1.25"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M11 5l6 0"></path>
    <path d="M7 19l6 0"></path>
    <path d="M14 5l-4 14"></path>
  </svg>
);

const underlineIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    stroke-width="1.25"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M7 5v5a5 5 0 0 0 10 0v-5"></path>
    <path d="M5 19h14"></path>
  </svg>
);

const linkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    stroke-width="1.25"
    stroke="currentColor"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M9 15l6 -6"></path>
    <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"></path>
    <path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"></path>
  </svg>
);

const initialValue = [
  {
    id: 1,
    type: 'paragraph',
    children: [{ text: 'A line of text\nin a paragraph 1.' }],
  },
  {
    id: 2,
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph 2.' }],
  },
  {
    id: 3,
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph 3.' }],
  },
  {
    id: 4,
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph 4.' }],
  },
];

const floatingUiOptions = {
  content: (editor: Editor) => {
    const openLink = useLinksState((state) => state.open);
    const close = useMenuState((state) => state.close);
    const isFocused = useFocused();

    return (
      <div className={styles.menu}>
        <span
          className={cn(styles.button, {
            [styles.buttonActive]: isMarkActive(editor, MarkType.BOLD),
          })}
          onClick={() => toggleBold(null, editor)}
        >
          {boldIcon}
        </span>
        <span
          className={cn(styles.button, {
            [styles.buttonActive]: isMarkActive(editor, MarkType.ITALIC),
          })}
          onClick={() => toggleItalic(null, editor)}
        >
          {italicIcon}
        </span>
        <span
          className={cn(styles.button, {
            [styles.buttonActive]: isMarkActive(editor, MarkType.UNDERLINE),
          })}
          onClick={() => toggleUnderline(null, editor)}
        >
          {underlineIcon}
        </span>
        <span
          className={cn(styles.button, {
            [styles.buttonActive]: false,
          })}
          onClick={() => {
            close();

            const { selection } = editor;

            if (
              !selection ||
              !isFocused ||
              Range.isCollapsed(selection) ||
              Editor.string(editor, selection) === ''
            ) {
              return;
            }

            const domSelection = window.getSelection();
            const domRange = domSelection?.getRangeAt(0);
            const box = domRange?.getBoundingClientRect();

            openLink(box);
          }}
        >
          {linkIcon}
        </span>
      </div>
    );
  },
};

const commands = [
  {
    title: 'Heading 1',
    action: (editor: Editor) => Transforms.setNodes(editor, { type: HeadingType.H1 }),
  },
  {
    title: 'Heading 2',
    action: (editor: Editor) => Transforms.setNodes(editor, { type: HeadingType.H2 }),
  },
  {
    title: 'Heading 3',
    action: (editor: Editor) => Transforms.setNodes(editor, { type: HeadingType.H3 }),
  },
  
];

export default {
  title: 'WeekEditor',
  component: WeekEditor,
};
export const Primary = {
  render: () => {
    const [value, setValue] = useState<Descendant[]>(initialValue);

    const plugins = useMemo(
      () => [
        new BasicMarksPlugin(),
        new SoftBreakPlugin(),
        new FloatingUiPlugin(floatingUiOptions),
        new LinksPlugin(),
        new HeadingsPlugin(),
        new ListsPlugin(),
        new CommandsPlugin({
          commands,
        }),
        new DnDPlugin({
          ignore: [ListType.BULLETED_LIST, ListType.NUMBERED_LIST],
        }),
      ],
      []
    );

    return <WeekEditor plugins={plugins} value={value} onChange={setValue} />;
  },
};
