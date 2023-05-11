import React from 'react';
import { ChangeMatch, FullEditor, IPlugin } from '../../../core/src/types';
import { Editor, Transforms, Node, Element } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { ListType } from '../types';
import { CustomElement } from '../global';
import styles from './styles.module.css';

export class ListsPlugin implements IPlugin {
  init(editor: FullEditor) {
    const { normalizeNode } = editor;

    editor.normalizeNode = (entry) => {
      const [node, path] = entry;

      if (isList(editor, node)) {
        /* Unwrap lists around non-list-items */
        for (const [child, childPath] of Node.children(editor, path)) {
          if (!isListItem(editor, child) && !isList(editor, child)) {
            Transforms.unwrapNodes(editor, {
              at: childPath,
              match: (n) => isList(editor, n),
              split: true,
            });
            return;
          }
        }
      }

      if (isListItem(editor, node)) {
        Node;
      }

      normalizeNode(entry);
    };

    return editor;
  }

  elements = [
    getListElement(ListType.BULLETED_LIST),
    getListElement(ListType.NUMBERED_LIST),
    {
      type: ListType.LIST_ITEM,
      isLeaf: false as const,
      render(props: RenderElementProps) {
        const { element, attributes, children } = props;

        switch (element.type) {
          case ListType.LIST_ITEM:
            return (
              <li className={styles.listItem} {...attributes}>
                {children}
              </li>
            );
          default: {
            return null;
          }
        }
      },
    },
  ];

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

const getListElement = (type: ListType) => ({
  type,
  isLeaf: false as const,
  hasPlaceholder: false,
  render(props: RenderElementProps) {
    const { element, attributes, children } = props;

    switch (element.type) {
      case ListType.BULLETED_LIST:
        return <ul className={styles.list} {...attributes}>{children}</ul>;
      case ListType.NUMBERED_LIST:
        return <ol className={styles.list} {...attributes}>{children}</ol>;
      default: {
        return null;
      }
    }
  },
});

const turnInto = (type: ListType) => (editor: Editor, match: ChangeMatch) => {
  const { selection } = editor;

  Transforms.delete(editor, {
    at: selection?.focus,
    distance: match.before?.[0].length,
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

const LIST_TYPES = [ListType.BULLETED_LIST, ListType.NUMBERED_LIST];

const LIST_ITEMS = [ListType.LIST_ITEM];

const isList = (editor: Editor, node: Node): boolean =>
  Element.isElement(node) && LIST_TYPES.includes(node.type);

export const isListItem = (editor: Editor, node: Node): boolean =>
  Element.isElement(node) && LIST_ITEMS.includes(node.type);
