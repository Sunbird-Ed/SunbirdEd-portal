export interface ActionCard {
    /**
    * number of nodes
    */
    leafNodesCount?: string;
    /**
    * course progress
    */
    progress?: string;
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
    /**
    * course id
    */
    courseId: string;
    /**
    * user id
    */
    userId: string;
}
