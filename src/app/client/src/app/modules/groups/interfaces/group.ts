import { GroupMembershipType, GroupEntityStatus, GroupActivity, GroupMember } from '@project-sunbird/client-services/models/group';

export interface IGroup {
  name: string;
  description?: string;
  id: string;
  status: GroupEntityStatus;
  membershipType?: GroupMembershipType;
  createdOn?: string;
  createdBy?: string;
  updatedOn?: string;
  updatedBy?: string;
  activities?: GroupActivity[];
  members?: GroupMember[];
  isAdmin: boolean;
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

export interface IGroupCard {
  name: string;
  description?: string;
  members?: Array<{}>;
  createdBy: string;
  cardBgColor?: any;
  cardTitleColor?: any;
  isLoading?: boolean;
  theme?: string;
  isAdmin?: boolean;
  initial?: string;
  id: string;
  isCreator?: boolean;
  memberRole?: string;
}
export interface IGroupSearchRequest {
  filters: {
    userId: string;
    groupAttribute?: {
      [key: string]: any | any[];
    }[];
  };
  sort_by?: {
    [key: string]: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
}

export interface IGroupMemberConfig {
  showMemberCount: boolean;
  showSearchBox: boolean;
  showAddMemberButton: boolean;
  showMemberMenu: boolean;
}

export interface IGroupMember {
  identifier: string;
  initial: string;
  title: string;
  isAdmin: boolean;
  isMenu: boolean;
  indexOfMember: number;
  isCreator: boolean;
  userId: string;
  role: string;
  name: string;
  id?: string;
}

