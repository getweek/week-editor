import { useState } from 'react';
import { WeekEditor } from './WeekEditor';
import { DnDPlugin } from '@week/dnd-plugin';
import { NodeIdPlugin } from '@week/node-id-plugin';
import {
  BasicMarksPlugin,
  toggleBold,
  toggleItalic,
  toggleUnderline,
} from '@week/basic-marks-plugin';
import { SoftBreakPlugin } from '@week/soft-break-plugin';
import { FloatingUiPlugin } from '@week/floating-ui-plugin';

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
      new FloatingUiPlugin({
        buttons: [
          (editor) => {
            return {
              icon: <span>b</span>,
              isActive() {
                return true;
              },
              onClick() {
                toggleBold(null, editor);
              },
            };
          },
        ],
      }),
    ];

    return <WeekEditor plugins={plugins} value={value} onChange={setValue} />;
  },
};
