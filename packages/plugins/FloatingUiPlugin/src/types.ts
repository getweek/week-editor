import { Editor } from 'slate';
import { ReactNode } from 'react';

export type Options = {
  content: (editor: Editor) => ReactNode;
};