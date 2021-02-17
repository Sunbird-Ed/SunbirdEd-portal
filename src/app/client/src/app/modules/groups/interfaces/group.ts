import { GroupMembershipType, GroupEntityStatus, CsGroup, GroupMember } from '@project-sunbird/client-services/models/group';

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

export interface IGroupCard extends CsGroup {
  cardBgColor?: any;
  cardTitleColor?: any;
  isLoading?: boolean;
  theme?: string;
  initial?: string;
  isCreator?: boolean;
  memberRole?: string;
  isAdmin?: boolean;
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
  ACTIVATE = 'activate',
  DISABLE_FORUM = 'disableDiscussionForum'
}

export enum acceptTnc {
  ALL = 'all',
  GROUP = 'group'
}
