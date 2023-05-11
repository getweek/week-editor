type CustomElement = {
  type: string;
};

declare module 'slate' {
  interface CustomTypes {
    Element: CustomElement;
  }
}
