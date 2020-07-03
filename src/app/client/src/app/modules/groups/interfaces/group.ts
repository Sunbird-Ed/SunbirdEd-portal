import { GroupMembershipType, GroupEntityStatus } from '@project-sunbird/client-services/models/group';

export interface IGroup {
  name: string;
  membershipType?: GroupMembershipType;
  description?: string;
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
  cardBgColor?: any;
  cardTitleColor?: any;
  isLoading?: boolean;
  theme?: string;
  isAdmin: any;
  initial: string;
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

export interface IGroupMember {
  identifier: string;
  initial: string;
  title: string;
  isAdmin: boolean;
  isMenu: boolean;
  indexOfMember: number;
  isCreator: boolean;
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
}
export interface GroupMember {
  memberId: string;
  name: string;
  role: GroupMemberRole;
  status: GroupEntityStatus;
  addedBy: string;
  addedOn: string;
  removedBy: string;
  removedOn: string;
  updatedBy: string;
  updatedOn: string;
}
// export interface GroupActivity {
// }
export interface Group {
  name: string;
  description: string;
  id: string;
  status: GroupEntityStatus;
  joinStrategy: GroupJoinStrategy;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  // activities: GroupActivity[];
  members?: GroupMember[];
}
