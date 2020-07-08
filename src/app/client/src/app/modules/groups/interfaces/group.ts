import { GroupMembershipType, GroupEntityStatus } from '@project-sunbird/client-services/models/group';

export interface IGroup {
  name: string;
  membershipType?: GroupMembershipType;
  description?: string;
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
  isAdmin?: any;
  initial?: string;
  id: string;
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
}

