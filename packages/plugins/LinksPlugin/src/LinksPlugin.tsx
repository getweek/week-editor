import React from 'react';
import { Editor } from 'slate';
import { create } from 'zustand';
import { IPlugin } from '../../../core/src/types';
import { Menu } from './Menu';
import { ELEMENT_LINK } from './types';
import { RenderElementProps } from 'slate-react';
import { Link } from './Link';

export const useLinksState = create((set) => ({
  isOpen: false,
  box: null,
  link: '',
  open: (box: DOMRect, link?: string) => set({ isOpen: true, box, link }),
  close: () => set({ isOpen: false, box: null, link: '' }),
}));

export class LinksPlugin implements IPlugin {
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

  elements = [
    {
      type: ELEMENT_LINK,
      isLeaf: false as const,
      isInline: true,
      render(props: RenderElementProps) {
        if (props.element.type === ELEMENT_LINK) {
          return <Link {...props} />;
        }

        return null;
      },
    },
  ];

  init(editor: Editor) {
    const { isInline } = editor;

    editor.isInline = (element) => {
      return element.type === ELEMENT_LINK || isInline(element);
    };

    return editor;
  }
}
