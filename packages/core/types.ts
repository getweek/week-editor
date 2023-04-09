import { ReactNode } from 'react';
import { Editor } from 'slate';
import { RenderLeafProps } from 'slate-react';

export interface IShortcuts {
  shortcuts: Shortcut[];
}

export interface IHotkeys {
  hotkeys: Hotkey[];
}

export interface ILeaf {
  renderLeaf: (props: RenderLeafProps) => ReactNode;
}

export interface ISerializable {
  serialize?(
    node: Element | Text | Element[] | Text[],
    serialize: ISerializable['serialize']
  ): string | void;
  deserialize?(element: any, children: any): any;
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
