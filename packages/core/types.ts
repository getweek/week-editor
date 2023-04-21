import React, { ChangeEventHandler, ReactElement, ReactNode } from 'react';
import { Editor } from 'slate';
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';

export interface IPlugin {
  init?: (editor: Editor) => ReactEditor;
  shortcuts?: Shortcut[];
  hotkeys?: Hotkey[];
  elements?: (LeafElement | BlockElement)[];
  ui?: (params: UiParams) => ReactNode;
  handlers?: IPluginHandlers;
  renderContext(children: ReactNode): ReactNode;  
}

export interface IPluginHandlers {
  onKeyDown?(event: Event): void;
  onChange?: ChangeEventHandler<HTMLDivElement>;
}

export const BaseElement = 'paragraph';

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

type WeekElement = {
  isVoid?: boolean;
  isInline?: boolean;
  serialize?(
    node: Element | Text | Element[] | Text[],
    serialize: WeekElement['serialize']
  ): string | undefined;
  deserialize?(element: any, children: any): any;
  command?: {
    icon: ReactNode;
    title: string;
    group: string;
    aliases: string[];
  };
};

type LeafElement = {
  isLeaf: true;
  render(props: RenderLeafProps, editor: Editor): ReactElement;
} & WeekElement;

type BlockElement = {
  isLeaf: false;
  render(props: RenderElementProps, editor: Editor): ReactElement;
} & WeekElement;