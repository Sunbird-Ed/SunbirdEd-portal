export interface IGroup {
    groupName: string;
    groupDescription?: string;
}

export interface IGroupMember {
    title: string;
    identifier: string;
    indexOfMember: number;
    isMenu: boolean;
    initial: string;
    isAdmin: boolean;
}

