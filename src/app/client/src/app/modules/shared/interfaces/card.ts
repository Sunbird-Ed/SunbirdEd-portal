export interface ICard {
    name: string;
    image?: string;
    downloadStatus?: string;
    imageVisibility?: boolean;
    description?: string;
    subject?: string;
    medium?: string;
    creator?: string;
    orgDetails?: { orgName: string, email: string};
    gradeLevel?: any;
    resourceType?: string;
    maxCount?: number;
    progress?: number;
    contentType?: string;
    hoverData?: object;
    ribbon?: {
        right?: { class: string, name: string }
        left?: { class: string, name: string , image: string }
    };
    rating?: number;
    metaData?: any;
    action?: {
        right?: {
            class: string,
            text?: string,
            eventName: string,
            displayType: string
        };
        left?: {
            class: string,
            text?: string,
            eventName: string,
            displayType: string
        };
        onImage?: {
            eventName: string
        };
    };
  completionPercentage?: number;
}
