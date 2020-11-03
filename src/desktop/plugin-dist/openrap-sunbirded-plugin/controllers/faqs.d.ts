import { Manifest } from "@project-sunbird/ext-framework-server/models";
export declare class Faqs {
    private databaseSdk;
    private fileSDK;
    private faqsBasePath;
    constructor(manifest: Manifest);
    insert(): Promise<void>;
    read(req: any, res: any): Promise<void>;
    fetchOfflineFaqs(language: any, req: any): Promise<IFaqsData | undefined>;
    fetchOnlineFaqs(language: any, req: any): Promise<IFaqsData | undefined>;
    private addToDb;
}
export interface IFaqs {
    topic: string;
    description: string;
}
export interface IFaqsData {
    faqs: IFaqs[];
    constants: object;
}
