import { BaseElement, Text } from 'slate';
import { ListType } from './types';

interface BULLETED_LIST extends BaseElement {
  type: ListType.BULLETED_LIST;
}

interface NUMBERED_LIST extends BaseElement {
  type: ListType.NUMBERED_LIST;
}

interface LIST_ITEM extends BaseElement {
  type: ListType.LIST_ITEM;
}

export type CustomElement = BULLETED_LIST | NUMBERED_LIST | LIST_ITEM;

declare module 'slate' {
  interface CustomTypes {
    Element: CustomElement;
  }
}
