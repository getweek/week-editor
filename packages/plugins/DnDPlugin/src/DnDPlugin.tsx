import { Editor } from 'slate';
import { RenderElementProps } from 'slate-react';

export class DnDPlugin {
  renderElement(props: RenderElementProps, editor: Editor) {
    return (
      <div>
        <span>drag me</span>
        {props.children}
      </div>
    );
  }
}
