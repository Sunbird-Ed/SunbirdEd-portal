import { ServerResponse, IAction } from '@sunbird/shared';
export interface IEnrolledCourses {
    err: ServerResponse;
    enrolledCourses: ICourses[];
}

export interface ICourses {
  status: number;
   /**
    * course name
    */
    courseName: string;
    /**
    * course description
    */
    description: string;
    /**
    * course batch id
    */
    batchId?: string;
    /**
    * number of nodes
    */
    leafNodesCount: number;
    /**
    * course progress
    */
    progress?: number;
     /**
    * course image
    */
    courseLogoUrl?: string;
    /**
    * course id
    */
    courseId: string;
    /**
    * course identifier
    */
    identifier?: string;
    /**
    * course rating
    */
    me_averageRating?: number;
    /**
    * user id
    */
    userId: string;
    /**
    * object type of IAction
    */
    action?: IAction;
}
