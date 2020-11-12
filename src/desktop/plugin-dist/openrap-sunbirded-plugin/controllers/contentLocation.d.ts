export default class ContentLocation {
    private fileSDK;
    private settingSDK;
    private manifestID;
    constructor(manifestId: any);
    set(contentPath: string): Promise<any>;
    get(): Promise<any>;
    setContentStaticRoute(contentPath: string): void;
}
