/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface Window {
  config: any;
  context: any;
  redirectUrl: any;
}

declare module '*.json' {
  const sample: any;
  export default sample;
}
declare const Markdown;
declare const EkTelemetry: any;
declare const Fingerprint2: any;

interface JQuery {
  treePicker(options?: any);
  iziModal(options?: any);
  dropdown(options?: any);
}

// TreeModel helps to manipulate and traverse through the tree model.
declare const TreeModel: any;
