import React, { ChangeEventHandler, ReactElement, ReactNode } from 'react';
import { Descendant, Editor, Element, Node } from 'slate';
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';

export interface IPlugin {
  init?: (editor: Editor) => ReactEditor;
  shortcuts?: Shortcut[];
  hotkeys?: Hotkey[];
  elements?: (LeafElement | BlockElement)[];
  ui?: (params: UiParams) => ReactNode;
  handlers?: IPluginHandlers;
  renderContext?(children: ReactNode): ReactNode;
  renderElement?(props: RenderElementProps, editor: Editor): ReactElement | null;
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
  change(editor: Editor, match: ChangeMatch): void;
};

export type ChangeMatch = {
  before?: RegExpExecArray;
  after?: RegExpExecArray;
};

type Hotkey = readonly [string, (event: KeyboardEvent, editor: Editor) => void];

type UiParams = {
  readOnly: boolean;
};

type WeekElement = {
  isVoid?: boolean;
  isInline?: boolean;
  serialize?: Serialize;
  deserialize?(element: any, children: any): any;
  command?: {
    icon: ReactNode;
    title: string;
    group: string;
    aliases: string[];
  };
};

export type Serialize = (
  node: Node,
  serialize: Serialize
) => string | undefined;

type LeafElement = {
  isLeaf: true;
  render(props: RenderLeafProps, editor: Editor): ReactElement | null;
} & WeekElement;

type BlockElement = {
  isLeaf: false;
  render(props: RenderElementProps, editor: Editor): ReactElement | null;
} & WeekElement;
