import { useState } from 'react';
import { WeekEditor } from './WeekEditor';
import { DnDPlugin } from '@week/dnd-plugin';
import { NodeIdPlugin } from '@week/node-id-plugin';
import {
  BasicMarksPlugin,
  toggleBold,
  toggleItalic,
  toggleUnderline,
  isMarkActive,
  MarkType,
} from '@week/basic-marks-plugin';
import { SoftBreakPlugin } from '@week/soft-break-plugin';
import { FloatingUiPlugin } from '@week/floating-ui-plugin';
import { Editor } from 'slate';

const boldIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
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
    width="20"
    height="20"
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
    width="20"
    height="20"
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
  buttons: [
    (editor: Editor) => {
      return {
        icon: <>{boldIcon}</>,
        isActive() {
          return isMarkActive(editor, MarkType.BOLD);
        },
        onClick() {
          toggleBold(null, editor);
        },
      };
    },
    (editor: Editor) => {
      return {
        icon: <>{italicIcon}</>,
        isActive() {
          return isMarkActive(editor, MarkType.ITALIC);
        },
        onClick() {
          toggleItalic(null, editor);
        },
      };
    },
    (editor: Editor) => {
      return {
        icon: <>{underlineIcon}</>,
        isActive() {
          return isMarkActive(editor, MarkType.UNDERLINE);
        },
        onClick() {
          toggleUnderline(null, editor);
        },
      };
    },
  ],
};

export default {
  title: 'WeekEditor',
  component: WeekEditor,
};
export const Primary = {
  render: () => {
    const [value, setValue] = useState(initialValue);
    const plugins = [
      new BasicMarksPlugin(),
      new DnDPlugin(),
      new SoftBreakPlugin(),
      new FloatingUiPlugin(floatingUiOptions),
    ];

    return <WeekEditor plugins={plugins} value={value} onChange={setValue} />;
  },
};
