/**
 * Batch interface
*/
export interface Ibatch {
    /**
    * Batch name
    */
    name?: string;
    /**
    * Batch description
    */
    description?: string;
    /**
    * Batch image
    */
    appIcon?: string;
    /**
    * Batch resourceType
    */
    resourceType?: string;
    /**
    * Batch contentType
    */
    contentType?: string;
    /**
    * Batch identifier
    */
    identifier?: string;
    // action: IAction;

    /**
    * Batch patticipation
    */
    participant?: any;
    /**
    * Batch id
    */
    id?: string;
    /**
    * Batch label
    */
    label?: any;
    /**
    * Batch createdBy
    */
    createdBy?: string;
    /**
    * Batch startDate
    */
    startDate?: Date;
    /**
    * Batch endDate
    */
    endDate?: Date;
    /**
    * Batch createdBy user
    */
    userName?: Array<string>;
    /**
    * Stattus of Batch
    */
    status?: number;
    /**
    * natureofbatch
    */
    enrollmentType?: string;
    /**
    * mentors
    */
    mentors?: string [];
    /**
    * courseCreator
    */
    courseCreator?: string;
    /**
    * createdFor
    */
    createdFor?: string[];

    /**
    * userIds
    */
    userIds?: string[];

    /**
    * batchId
    */
    batchId?: string;
}
