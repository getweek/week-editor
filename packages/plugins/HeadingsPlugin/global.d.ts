import { BaseElement, Text } from 'slate';
import { HeadingType } from './types';

interface H1 extends BaseElement {
  type: HeadingType.H1;
  children: Text;
}

interface H2 extends BaseElement {
  type: HeadingType.H2;
  children: Text;
}

interface H3 extends BaseElement {
  type: HeadingType.H3;
  children: Text;
}

export type CustomElement = H1 | H2 | H3;

declare module 'slate' {
  interface CustomTypes {
    Element: CustomElement;
  }
}
