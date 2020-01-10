import { ISessionContext } from './index';


export interface IContentUploadComponentInput {
  config?: any;
  sessionContext?: ISessionContext;
  unitIdentifier?: string;
  selectedSharedContext?: any;
  contentId?: string;
  templateDetails?: any;
  programContext?: any;
  action?: string;
}
