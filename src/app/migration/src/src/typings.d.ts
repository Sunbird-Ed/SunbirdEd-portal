/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module '*.json' {
  const sample: any;
  export default sample;
}

declare const Markdown;
declare var EkTelemetry: any;
