import React, { RenderElementProps } from 'slate-react';
import { Editor, Transforms, Node } from 'slate';
import { jsx } from 'slate-hyperscript';
import {
  ChangeMatch,
  CommandActionType,
  IPlugin,
  Serialize,
} from '../../../core/src/types';
import { HeadingType } from '../types';

export class HeadingsPlugin implements IPlugin {
  elements = [
    getElement(HeadingType.H1),
    getElement(HeadingType.H2),
    getElement(HeadingType.H3),
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

const getElement = (type: HeadingType) => ({
  type,
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
      default:
        return null;
    }
  },
  serialize(node: Node, serialize: Serialize) {
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

  deserialize(element: HTMLElement, children: any[]) {
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
  commands: [
    {
      title: headings[type].title,
      group: 'Headings',
      icon: headings[type].icon,
      action: CommandActionType.replace,
    },
  ],
});

const turnInto =
  (type: HeadingType) => (editor: Editor, match: ChangeMatch) => {
    const { selection } = editor;

    if (selection) {
      Transforms.delete(editor, {
        at: selection.focus,
        distance: match.before?.[0].length,
        reverse: true,
        unit: 'character',
      });

      Transforms.setNodes(editor, {
        type,
      });
    }
  };

const heading1Icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-h-1"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    strokeWidth="1.25"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M19 18v-8l-2 2"></path>
    <path d="M4 6v12"></path>
    <path d="M12 6v12"></path>
    <path d="M11 18h2"></path>
    <path d="M3 18h2"></path>
    <path d="M4 12h8"></path>
    <path d="M3 6h2"></path>
    <path d="M11 6h2"></path>
  </svg>
);

const heading2Icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-h-2"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    strokeWidth="1.25"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M17 12a2 2 0 1 1 4 0c0 .591 -.417 1.318 -.816 1.858l-3.184 4.143l4 0"></path>
    <path d="M4 6v12"></path>
    <path d="M12 6v12"></path>
    <path d="M11 18h2"></path>
    <path d="M3 18h2"></path>
    <path d="M4 12h8"></path>
    <path d="M3 6h2"></path>
    <path d="M11 6h2"></path>
  </svg>
);

const heading3Icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-h-3"
    width={16}
    height={16}
    viewBox="0 0 24 24"
    strokeWidth="1.25"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M19 14a2 2 0 1 0 -2 -2"></path>
    <path d="M17 16a2 2 0 1 0 2 -2"></path>
    <path d="M4 6v12"></path>
    <path d="M12 6v12"></path>
    <path d="M11 18h2"></path>
    <path d="M3 18h2"></path>
    <path d="M4 12h8"></path>
    <path d="M3 6h2"></path>
    <path d="M11 6h2"></path>
  </svg>
);

const headings = {
  [HeadingType.H1]: {
    title: 'Heading 1',
    icon: heading1Icon,
  },
  [HeadingType.H2]: {
    title: 'Heading 1',
    icon: heading2Icon,
  },
  [HeadingType.H3]: {
    title: 'Heading 1',
    icon: heading3Icon,
  },
};
