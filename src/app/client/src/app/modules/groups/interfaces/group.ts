import { GroupMembershipType, GroupMemberRole, GroupEntityStatus } from '@project-sunbird/client-services/models/group';

  export interface IGroupId {
    groupId: string;
  }
  export interface IGroup {
    name: string;
    membershipType?: GroupMembershipType;
    description?: string;
  }

  export interface IGroupUpdate {
    name?: string;
    membershipType?: GroupMembershipType;
    description?: string;
    status?: GroupEntityStatus;
  }

  export interface IGroupCard {
    group: IGroup;
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
    members: {
      userId: string;
      role: GroupMemberRole;
    }[];
  }
  export interface IUpdateGroupMembers {
    members: {
      userId: string;
      role?: GroupMemberRole;
      status?: GroupEntityStatus;
    }[];
  }



