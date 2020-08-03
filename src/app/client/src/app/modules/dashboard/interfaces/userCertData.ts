export interface IUserCertificate {
    userId: string;
    userName: string;
    district: string;
    courses: {
        courseId: string;
        name: string;
        batches: Array<{}>;
    };
}
