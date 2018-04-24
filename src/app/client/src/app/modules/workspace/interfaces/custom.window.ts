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
      tags: Array<any>;
      channel: string;
      framework?: string;
      env?: string;

}
