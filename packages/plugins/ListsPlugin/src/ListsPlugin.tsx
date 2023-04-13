import { IPlugin } from '../../../core/types';
import { Editor, Transforms } from 'slate';
import { RenderElementProps } from 'slate-react';
import { ListType } from './types';

export class ListsPlugin implements IPlugin {
  renderElement(props: RenderElementProps) {
    const { element, attributes, children } = props;

    switch (element.type) {
      case ListType.BULLETED_LIST:
        return <ul {...attributes}>{children}</ul>;
      case ListType.NUMBERED_LIST:
        return <ol {...attributes}>{children}</ol>;
      case ListType.LIST_ITEM:
        return <li {...attributes}>{children}</li>;
    }
  }
  shortcuts = [
    {
      trigger: ' ',
      before: /^1\./,
      change: turnInto(ListType.NUMBERED_LIST),
    },
    {
      trigger: ' ',
      before: /^\*/,
      change: turnInto(ListType.BULLETED_LIST),
    },
  ];
}

const turnInto = (type: ListType) => (editor: Editor, match) => {
  const { selection } = editor;

  Transforms.delete(editor, {
    at: selection.focus,
    distance: match.before[0].length,
    reverse: true,
    unit: 'character',
  });

  Editor.withoutNormalizing(editor, () => {
    Transforms.setNodes(editor, {
      type: ListType.LIST_ITEM,
    });

    Transforms.wrapNodes(
      editor,
      {
        type,
        children: [],
      },
      {
        mode: 'lowest',
      }
    );
  });
};