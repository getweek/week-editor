import { Editor, Transforms, Text } from 'slate';
import { RenderLeafProps } from 'slate-react';
import { IPlugin } from '../../../core/src/types';
import escapeHtml from 'escape-html';
import { jsx } from 'slate-hyperscript';
import { MarkType } from './types';

export class BasicMarksPlugin implements IPlugin {
  hotkeys = [
    ['cmd+b', toggleBold] as const,
    ['ctrl+b', toggleBold] as const,

    ['cmd+i', toggleItalic] as const,
    ['ctrl+i', toggleItalic] as const,

    ['cmd+u', toggleUnderline] as const,
    ['ctrl+u', toggleUnderline] as const,
  ];

  shortcuts = [
    // **text* + [*]
    {
      trigger: '*',
      before: /([*]{2})([^*]+)([*])/,
      change(editor: Editor, match) {
        const { selection } = editor;

        Transforms.delete(editor, {
          at: selection.focus,
          distance: match.before[0].length,
          unit: 'character',
          reverse: true,
        });

        editor.addMark(MarkType.BOLD, true);
        editor.insertText(match.before[2]);
        editor.removeMark(MarkType.BOLD);
      },
    },
    // * + [*] +text**
    {
      trigger: '*',
      before: /([*])/,
      after: /([^*]+)([*]{2})/,
      change(editor, match) {
        const { selection } = editor;

        Transforms.delete(editor, {
          at: selection.focus,
          distance: match.after[0].length,
          unit: 'character',
        });

        Transforms.delete(editor, {
          at: selection.focus,
          distance: 1,
          unit: 'character',
          reverse: true,
        });

        editor.addMark(MarkType.BOLD, true);
        editor.insertText(match.after[1]);
        editor.removeMark(MarkType.BOLD);
      },
    },
    // _text + [_]
    {
      trigger: '_',
      before: /_([^_]+)/,
      change(editor, match) {
        const { selection } = editor;

        Transforms.delete(editor, {
          at: selection.focus,
          distance: match.before[0].length,
          unit: 'character',
          reverse: true,
        });

        editor.addMark(MarkType.ITALIC, true);
        editor.insertText(match.before[1]);
        editor.removeMark(MarkType.ITALIC);
      },
    },
    // [_] + text_
    {
      trigger: '_',
      after: /([^_]+)_/,
      change(editor, match) {
        const { selection } = editor;

        Transforms.delete(editor, {
          at: selection.focus,
          distance: match.after[0].length,
          unit: 'character',
        });

        editor.addMark(MarkType.ITALIC, true);
        editor.insertText(match.after[1]);
        editor.removeMark(MarkType.ITALIC);
      },
    },
  ];

  elements = [
    {
      isLeaf: true as const,
      render(props: RenderLeafProps) {
        const { leaf, attributes, children } = props;

        let content = children;

        if (leaf.bold) {
          content = <strong>{content}</strong>;
        }

        if (leaf.italic) {
          content = <em>{content}</em>;
        }

        if (leaf.underline) {
          content = <u>{content}</u>;
        }

        return <span {...attributes}>{content}</span>;
      },
      serialize(node) {
        if (Text.isText(node)) {
          let text = escapeHtml(node.text);

          if (node.bold) {
            text = `<strong>${text}</strong>`;
          }
          if (node.italic) {
            text = `<em>${text}</em>`;
          }
          if (node.underline) {
            text = `<u>${text}</u>`;
          }

          return text;
        }
      },
      deserialize(element, children) {
        const { nodeName } = element;

        let attrs;
        switch (nodeName) {
          case 'EM':
          case 'I': {
            attrs = { italic: true };
            break;
          }
          case 'STRONG': {
            attrs = { bold: true };
            break;
          }
          case 'U': {
            attrs = { underline: true };
          }
        }

        if (attrs) {
          return children.map((child) => jsx('text', attrs, child));
        }
      },
    },
  ];
}

export const toggleBold = (event: any, editor: Editor) => {
  toggleMark(editor, MarkType.BOLD);
};

export const toggleItalic = (event: any, editor: Editor) => {
  toggleMark(editor, MarkType.ITALIC);
};

export const toggleUnderline = (event: any, editor: Editor) => {
  toggleMark(editor, MarkType.UNDERLINE);
};

export const toggleMark = (editor: Editor, mark: MarkType) => {
  const isActive = isMarkActive(editor, mark);

  if (isActive) {
    editor.removeMark(mark);
  } else {
    editor.addMark(mark, true);
  }
};

export const isMarkActive = (editor: Editor, mark: MarkType) => {
  const marks = Editor.marks(editor);

  return marks ? marks[mark] === true : false;
};
