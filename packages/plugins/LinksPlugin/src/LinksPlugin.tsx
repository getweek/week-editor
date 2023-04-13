import { Editor } from 'slate';
import { create } from 'zustand';
import { RenderElementProps } from '../../../core/node_modules/slate-react/dist';
import { IElement, IUi } from '../../../core/types';
import { Link } from './Link';
import { Menu } from './Menu';
import { ELEMENT_LINK } from './types';

export const useLinksState = create((set) => ({
  isOpen: false,
  box: null,
  link: '',
  open: (box: DOMRect, link?: string) => set({ isOpen: true, box, link }),
  close: () => set({ isOpen: false, box: null, link: '' }),
}));

export class LinksPlugin implements IUi, IElement {
  ui({ readOnly }) {
    const isOpen = useLinksState((state) => state.isOpen);
    const open = useLinksState((state) => state.open);
    const close = useLinksState((state) => state.close);
    const box = useLinksState((state) => state.box);
    const link = useLinksState((state) => state.link);

    return readOnly ? null : (
      <Menu
        isOpen={isOpen}
        link={link}
        elementBox={box}
        onOpen={open}
        onClose={close}
      />
    );
  }

  renderElement(props: RenderElementProps) {
    if (props.element.type === ELEMENT_LINK) {
      return <Link {...props} />;
    }
  }

  init(editor: Editor) {
    const { isInline } = editor;

    editor.isInline = (element) => {
      return element.type === ELEMENT_LINK || isInline(element);
    };

    return editor;
  }
}
