import { useRef, useState, useEffect } from 'react';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { DndProvider, useDrag, useDrop, XYCoord } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Editor, Element, Transforms } from 'slate';
import styles from './styles.module.css';

export class DnDPlugin {
  editor: ReactEditor | null = null;
  items: any[] = [];

  init(editor: ReactEditor) {
    this.editor = editor;

    return editor;
  }

  handlers = {
    onDrop(event) {
      event.preventDefault();
    },
  };

  renderContext(children: React.ReactNode) {
    return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
  }

  renderElement(props: RenderElementProps, editor: ReactEditor) {
    const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [direction, setDirection] = useState(0);

    const [dropped, drag, preview] = useDrag({
      type: 'TEXT_BLOCK',
      item: {
        location: ReactEditor.findPath(editor, props.element),
      },
      collect(monitor) {
        return {
          box: ref.current?.getBoundingClientRect(),
          isDragging: monitor.isDragging(),
        };
      },
    });

    const [collected, drop] = useDrop({
      accept: 'TEXT_BLOCK',
      hover(item, monitor) {
        const { y } = monitor.getClientOffset() as XYCoord;
        const middleY = (dropped.box.bottom - dropped.box.top) / 2;

        const hoverClientY = y - dropped.box.top;

        if (hoverClientY < middleY) {
          setDirection(-1);
        } else {
          setDirection(1);
        }
        
        setHeight(24);
      },
      drop(item, monitor) {
        const { location } = item;
        const path = ReactEditor.findPath(editor, props.element);

        Transforms.moveNodes(editor, {
          at: location,
          to: path,

          match: (node) => Editor.isEditor(editor) && Element.isElement(node),
        });
      },
      collect(monitor: any) {
        return {
          isOver: monitor.isOver(),
          box: ref.current?.getBoundingClientRect(),
        };
      },
    });

    const { isDragging } = dropped;
    const { isOver } = collected;

    preview(drop(ref));

    if (editor.isInline(props.element)) {
      return props.children;
    }

    return (
      <div
        ref={ref}
        draggable
        className={styles.block}
        style={{
          // paddingTop: isOver && direction === -1 ? height : undefined,
          // paddingBottom: isOver && direction === 1 ? height : undefined,
          borderTop: isOver && direction === -1 ? '2px solid blue' : undefined,
          borderBottom: isOver && direction === 1 ? '2px solid blue' : undefined,
          opacity: isDragging ? 0 : 1,
        }}
      >
        <span ref={drag} contentEditable={false} className={styles.handler}>
          ⠿
        </span>
        {props.children}
      </div>
    );
  }
}
