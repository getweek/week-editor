import { IHandlers } from "../../../core/src/types";

export class SoftBreakPlugin implements IHandlers {
  handlers = {
    onKeyDown(event, editor) {
      if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        editor.insertText('\n');
      }
    }
  }
}