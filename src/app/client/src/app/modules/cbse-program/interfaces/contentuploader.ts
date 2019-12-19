import { IProgramContext } from './index';


export interface IContentUploadComponentInput {
  programContext?: IProgramContext;
  unitIdentifier?: string;
  selectedSharedContext?: any;
  contentIdentifier?: string;
  templateDetails?: any;
  entireConfig?: any;
  action?: string;
}
