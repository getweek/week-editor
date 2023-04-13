import React, { ReactNode } from 'react';
import { Editor } from 'slate';
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';

export interface IPlugin {
  init?: (editor: Editor) => Editor;
  renderLeaf?: (props: RenderLeafProps) => ReactNode;
  renderElement?: (props: RenderElementProps) => ReactNode;
  shortcuts?: Shortcut[];
  hotkeys?: Hotkey[];
  serialize?(
    node: Element | Text | Element[] | Text[],
    serialize: IPlugin['serialize']
  ): string | void;
  deserialize?(element: any, children: any): any;
  ui?: (params: UiParams) => ReactNode;
  handlers?: Partial<
    Pick<React.TextareaHTMLAttributes<HTMLDivElement>, 'onKeyDown'>
  >;
}

type Shortcut = {
  trigger: string;
  before?: RegExp;
  after?: RegExp;
  change(
    editor: Editor,
    match: {
      before?: RegExpExecArray;
      after?: RegExpExecArray;
    }
  ): void;
};

type Hotkey = readonly [string, (event: KeyboardEvent, editor: Editor) => void];

type UiParams = {
  readOnly: boolean;
};
