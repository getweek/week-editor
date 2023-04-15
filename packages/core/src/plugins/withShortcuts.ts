import { Editor, Range, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { IPlugin } from '../../types';


export const withShortcuts = (plugins: IPlugin[]) => (editor: ReactEditor) => {
  const { insertText } = editor;

  editor.insertText = (text: string) => {
    const { selection } = editor;
    for (const plugin of plugins) {
      if (plugin.shortcuts && Range.isCollapsed(selection!)) {
        for (const shortcut of plugin.shortcuts) {
          if (text === shortcut.trigger) {
            let matchBefore;
            let matchAfter;

            if (shortcut.before) {
              const end = Range.end(selection!);

              const start =
                Editor.before(editor, end, {
                  unit: 'line',
                }) || end;

              const [node] = Node.fragment(editor, {
                anchor: start,
                focus: end,
              });

              const text = Node.string(node);
              matchBefore = new RegExp(shortcut.before.source + '$', 'g').exec(
                text
              );
            }
            if (shortcut.after) {
              const start = Range.start(selection!);

              const end =
                Editor.after(editor, start, {
                  unit: 'line',
                }) || start;

              const [node] = Node.fragment(editor, {
                anchor: start,
                focus: end,
              });

              const text = Node.string(node);
              matchAfter = new RegExp('^' + shortcut.after.source, 'g').exec(
                text
              );
            }

            if (matchBefore && !shortcut.after) {
              shortcut.change(editor, {
                before: matchBefore,
              });
              return;
            }

            if (matchAfter && !shortcut.before) {
              shortcut.change(editor, {
                after: matchAfter,
              });
              return;
            }

            if (
              matchBefore &&
              matchAfter &&
              shortcut.before &&
              shortcut.after
            ) {
              shortcut.change(editor, {
                before: matchBefore,
                after: matchAfter,
              });
              return;
            }
          }
        }
      }
    }

    insertText(text);
  };

  return editor;
};
