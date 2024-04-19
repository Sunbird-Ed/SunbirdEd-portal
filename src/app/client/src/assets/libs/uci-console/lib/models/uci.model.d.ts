export declare namespace UciData {
    interface IUser {
        uid: number;
        username: string;
        fullname?: string;
        userslug: string;
        reputation: number;
        postcount: number;
        topiccount?: number;
        picture?: string | null;
        signature?: string | null;
        banned: number;
        'banned:expire'?: number;
        status: string;
        lastonline?: number | null | undefined;
        groupTitle?: string;
        groupTitleArray?: string[];
        'icon:text'?: string;
        'icon:bgColor'?: string;
        lastonlineISO?: string;
        banned_until?: number | boolean;
        banned_until_readable?: string;
        selectedGroups?: any[];
        custom_profile_info?: any[];
    }
    interface IProfile {
        uid: number;
        username: string;
        userslug: string;
        email: string;
        'email:confirmed': number;
        joindate: number;
        lastonline: number;
        picture: string;
        fullname: string;
        location: string;
        birthday: string;
        website: string;
        aboutme: string;
        signature: string;
        uploadedpicture: string;
        profileviews: number;
        reputation: number;
        postcount: number;
        topiccount: number;
        lastposttime: number;
        banned: number;
        'banned:expire': number;
        status: string;
        flags: number;
        followerCount: number;
        followingCount: number;
        'cover:url': string;
        'cover:position': string;
        groupTitle: string;
        groupTitleArray: [];
        joindateISO: string;
        lastonlineISO: string;
        isBlocked: true;
        blocksCount: number;
        canEdit: true;
        canBan: true;
        title: string;
    }
    enum IPageName {
        HOME = "uci-admin",
        LIB_ENTRY = "lib-entry"
    }
}
//# sourceMappingURL=uci.model.d.ts.map