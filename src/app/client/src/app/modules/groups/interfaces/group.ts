export interface IGroup {
    name: string;
    description?: string;
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

