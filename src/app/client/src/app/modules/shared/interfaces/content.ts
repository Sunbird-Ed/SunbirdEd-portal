import { IAction } from './action';
/**
 * Content interface
*/
export interface IContents {
    /**
    * Content name
    */
    name?: string;
    /**
    * Content courseName
    */
    courseName?: string;
    /**
    * Content description
    */
    description?: string;
    /**
    * Content rating
    */
    me_averageRating?: number;
    /**
    * Content leafNodes
    */
    leafNodesCount?: number;
    /**
    * Content progress
    */
    progress?: number;
    /**
    * Content image
    */
    appIcon?: string;
    /**
    * Content courseImage
    */
    courseLogoUrl?: string;
    /**
    * Content resourceType
    */
    resourceType?: string;
    /**
    * Content contentType
    */
    contentType?: string;
    /**
    * Content mimeType
    */
    mimeType?: string;

    /**
    * Content identifier
    */
    identifier?: string;
    /**
    * Content courseId
    */
    courseId?: string;
    /**
    * Content badgeAssertions name
    */
    badgeAssertions?: Array<IbadgeAssertions> ;
    /**
    * Content action
    */
    action?: IAction;

    /**
    * Content action
    */
    contnetShare?: any;
}

export interface IbadgeAssertions {
    badgeClassName?: string;
}
