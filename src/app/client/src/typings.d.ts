/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare module '*.json' {
  const sample: any;
  export default sample;
}
declare const EkTelemetry: any;
declare var $: any;