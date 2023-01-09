import { ServerResponse } from '@sunbird/shared';
export interface ITenantInfo {
    err: ServerResponse;
    tenantData: ITenantData;
}

export interface ITenantData {
    appLogo: string;
    favicon: string;
    logo: string;
    poster: string;
    titleName: string;
    secondaryLogo:string
}

export interface ITenantSettings {
    helpCenterLink?: string;
    helpDeskEmail?: string;
    playstoreLink?: string;
}
