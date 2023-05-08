import { IPlugin } from "../../../core/src/types";

export class SoftBreakPlugin implements IPlugin {
  handlers = {
    onKeyDown(event, editor) {
      if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        editor.insertText('\n');
      }
    }
  }
}