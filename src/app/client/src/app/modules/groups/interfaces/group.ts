import { GroupMembershipType, GroupEntityStatus, Group, GroupMember } from '@project-sunbird/client-services/models/group';

export interface IGroup extends Group {
  isAdmin?: boolean;
  active?: boolean;
  members?: IGroupMember[];
}

export interface IMember {
  members: [
    {
      userId: string;
      role: string;
    }
  ];
}

export interface IGroupUpdate {
  name: string;
  membershipType?: GroupMembershipType;
  description?: string;
  status?: GroupEntityStatus;
}

export interface IGroupCard extends IGroup {
  cardBgColor?: any;
  cardTitleColor?: any;
  isLoading?: boolean;
  theme?: string;
  initial?: string;
  isCreator?: boolean;
  memberRole?: string;
}


export interface IGroupMemberConfig {
  showMemberCount: boolean;
  showSearchBox: boolean;
  showAddMemberButton: boolean;
  showMemberMenu: boolean;
}

export interface IGroupMember extends GroupMember {
  identifier?: string;
  initial?: string;
  title?: string;
  isAdmin?: boolean;
  isMenu?: boolean;
  indexOfMember?: number;
  isCreator?: boolean;
  id?: string;
}

export enum actions {
  DELETE = 'delete',
  DEACTIVATE = 'deActivate',
  ACTIVATE = 'activate'
}
