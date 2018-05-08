export interface IFancytreeOptions extends Fancytree.FancytreeOptions {
  glyph?: {
    preset: string;
    map: {
      folder: string;
      folderOpen: string;
    }
  };
  showConnectors?: Boolean;
}
