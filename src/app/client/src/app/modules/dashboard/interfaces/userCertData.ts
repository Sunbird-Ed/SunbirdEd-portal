export interface IUserCertificate {
    userId: string;
    userName: string;
    district: string;
    courses: {
        courseId: string;
        name: string;
        contentType: string;
        pkgVersion: number;
        batches: Array<{}>;
    };
}
