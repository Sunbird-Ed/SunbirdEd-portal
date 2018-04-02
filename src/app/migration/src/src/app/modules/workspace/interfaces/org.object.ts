export interface IappId {
appid: Number;
}

export interface IPortal {
portal: IappId;
}

export interface IOrganizatioName {
sunbird: IPortal;
}

export interface IOrganization {
org: IOrganizatioName;
}
