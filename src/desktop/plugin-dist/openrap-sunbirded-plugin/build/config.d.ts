declare const config: {
    baseUrl: string;
    resourceBundles: {
        url: string;
        files: string[];
        dest_folder: string;
    };
    organizations: {
        url: string;
        ids: string[];
        dest_folder: string;
    };
    channels: {
        url: string;
        ids: string[];
        dest_folder: string;
    };
    frameworks: {
        url: string;
        ids: string[];
        dest_folder: string;
    };
    forms: {
        url: string;
        requests_data: {
            type: string;
            action: string;
            subType: string;
            rootOrgId: string;
        }[];
        dest_folder: string;
    };
    location: {
        url: string;
        dest_folder: string;
    };
};
export default config;
