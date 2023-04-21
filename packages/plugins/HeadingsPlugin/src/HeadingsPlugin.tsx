import { RenderElementProps } from 'slate-react';
import { Editor, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { IPlugin } from '../../../core/types';
import { ReactNode } from '../../../core/node_modules/@types/react';
import { HeadingType } from './types';

export class HeadingsPlugin implements IPlugin {
  elements = [
    {
      isLeaf: false as const,
      render(props: RenderElementProps) {
        const { element, attributes, children } = props;

        switch (element.type) {
          case HeadingType.H1:
            return <h1 {...attributes}>{children}</h1>;
          case HeadingType.H2:
            return <h2 {...attributes}>{children}</h2>;
          case HeadingType.H3:
            return <h3 {...attributes}>{children}</h3>;
        }
      },
      serialize(node, serialize) {
        if ('type' in node) {
          switch (node.type) {
            case HeadingType.H1:
              return `<h1>${serialize(node.children, serialize)}</h1>`;
            case HeadingType.H2:
              return `<h2>${serialize(node.children, serialize)}</h2>`;
            case HeadingType.H3:
              return `<h3>${serialize(node.children, serialize)}</h3>`;
          }
        }
      },

      deserialize(element, children) {
        const { nodeName } = element;

        switch (nodeName) {
          case 'H1':
            return jsx('element', { type: HeadingType.H1 }, children);
          case 'H2':
            return jsx('element', { type: HeadingType.H2 }, children);
          case 'H3':
            return jsx('element', { type: HeadingType.H3 }, children);
        }
      },
    },
  ];

  shortcuts = [
    {
      trigger: ' ',
      before: /^###/,
      change: turnInto(HeadingType.H3),
    },
    {
      trigger: ' ',
      before: /^##/,
      change: turnInto(HeadingType.H2),
    },
    {
      trigger: ' ',
      before: /^#/,
      change: turnInto(HeadingType.H1),
    },
  ];
}

const turnInto = (type: HeadingType) => (editor: Editor, match) => {
  const { selection } = editor;

  if (selection) {
    Transforms.delete(editor, {
      at: selection.focus,
      distance: match.before[0].length,
      reverse: true,
      unit: 'character',
    });
  
    Transforms.setNodes(editor, {
      type,
    });
  }
};
