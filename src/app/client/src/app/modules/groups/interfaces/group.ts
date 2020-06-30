export interface IGroup {
    groupName: string;
    groupDescription?: string;
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
