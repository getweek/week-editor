import { Element, Editor } from 'slate';
import { nanoid } from 'nanoid';

export const makeNodeId = () => nanoid(16);

export const assignId = (node) => {
  if (Element.isElement(node)) {
    node.id = makeNodeId();
    node.children.forEach(assignId);
  }
};

export class NodeIdPlugin {
  init(editor: Editor) {
    const { apply } = editor;

    editor.apply = (operation) => {
      if (operation.type === 'insert_node') {
        assignId(operation.node);
        return apply(operation);
      }

      if (operation.type === 'split_node') {
        operation.properties.id = makeNodeId();
        return apply(operation);
      }

      return apply(operation);
    }

    return editor;
  }
}