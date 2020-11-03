/**
* This SDK helps in performing operations with database and to create them
*
*/
export default class DatabaseSDK {
    private pluginId;
    private url;
    private dbInstances;
    initialize(pluginId: string, url?: string): void;
    get(database: string, Id: string): any;
    insert(database: string, doc: any, Id?: string): any;
    update(database: string, docId: any, doc: any): Promise<any>;
    delete(database: string, docId: any): Promise<any>;
    find(database: string, searchObj: Object): any;
    bulk(database: string, documents: Object[]): any;
    list(database: string, options: Object): any;
    explain(database: string, options: Object): any;
    upsert(database: string, docId: string, doc: any): Promise<any>;
}
