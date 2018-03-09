export interface ActionCard {
    /**
    * number of nodes
    */
    leafNodesCount?: number;
    /**
    * course progress
    */
    progress?: number;
    /**
    * course name
    */
    courseName?: string;
    /**
    * course description
    */
    description?: string;
    /**
    * course rating
    */
    me_averageRating?: number;
    /**
    * course image
    */
    courseLogoUrl?: string;
    appIcon?: string;
    /**
    * course id
    */
    courseId: string;
}
