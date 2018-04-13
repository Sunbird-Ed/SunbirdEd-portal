export interface CustomWindow extends Window {
    context: IContextData;
    config: any;
}

export interface IContextData {
    user: {
        id: string,
        name: string,
        orgIds?: string[]
      };
      sid?: string;
      contentId?: string;
      pdata: {
        id: string,
        ver: string
      };
      etags: { app: Array<any>[], partner: Array<any>[], dims: string[] };
      channel: string;
      framework?: string;
      env?: string;

}
