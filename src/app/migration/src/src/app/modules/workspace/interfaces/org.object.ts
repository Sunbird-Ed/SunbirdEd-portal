
export interface IappId {
appid: number;
channel: number;
dims: Array<any>;
ekstep_env: string;
eventManager: IEvents;

}

export interface IEvents {
    addEventListener: () => IFunction;
dispatchEvent: () => IFunction;
getEvents: () => void;
hasEventListener: (eventName: any) => void;
removeEventListener: () => IFunction;
}

export interface IFunction {
    type: any;
     callback: any;
     scope: any;
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
