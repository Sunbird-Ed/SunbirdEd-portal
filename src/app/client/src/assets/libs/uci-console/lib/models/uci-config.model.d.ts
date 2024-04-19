export interface IdiscussionConfig {
    menuOptions?: Array<IMenuOptions>;
    userName: string;
    context?: Object;
    categories: Icategory;
    path?: string;
    routerSlug?: string;
}
export interface IMenuOptions {
    route: string;
    enable: boolean;
}
export interface Icategory {
    result: Array<string>;
}
//# sourceMappingURL=uci-config.model.d.ts.map