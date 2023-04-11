import { Editor } from 'slate';
import { ReactNode } from 'react';

export type Options = {
  buttons: Array<UiButtonFn>;
};

type UiButton = {
  icon: ReactNode;
  isActive(): void;
  onClick(): void;
}

type UiButtonFn = (editor: Editor) => UiButton;
