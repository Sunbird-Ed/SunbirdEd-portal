export interface IGroup {
  name: string;
  joinStrategy?: GroupJoinStrategy;
  description: string;
  members: {
      memberId: string;
      role: GroupMemberRole
  }[];
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

export enum GroupJoinStrategy {
  INVITE_ONLY = 'invite_only',
  MODERATED = 'moderated'
}
export enum GroupEntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}
export enum GroupMemberRole {
  ADMIN = 'admin',
  MEMBER = 'member'
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
