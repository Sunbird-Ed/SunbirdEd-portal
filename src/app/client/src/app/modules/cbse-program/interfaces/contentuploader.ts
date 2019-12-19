import { ISessionContext } from './index';


export interface IContentUploadComponentInput {
  sessionContext?: ISessionContext;
  unitIdentifier?: string;
  selectedSharedContext?: any;
  contentIdentifier?: string;
  templateDetails?: any;
  entireConfig?: any;
  action?: string;
}
