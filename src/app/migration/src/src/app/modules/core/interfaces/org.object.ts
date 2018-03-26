// export interface orgObject {
//     org : Object    
// }

// export interface organization {
//     sunbird: orgObject;
// }


export interface appId {
	appid: Number;
}

export interface Portal {
	portal: appId;
}

export interface OrganizatioName{
    sunbird: Portal;
}

export interface Organization{
    org: OrganizatioName
}


