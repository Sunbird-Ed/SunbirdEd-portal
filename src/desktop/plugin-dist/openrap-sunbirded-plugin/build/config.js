Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    baseUrl: "https://dev.sunbirded.org/",
    resourceBundles: {
        url: "resourcebundles/v1/read/",
        files: ["en", "hi"],
        dest_folder: "resourceBundles",
    },
    organizations: {
        url: "api/org/v1/search",
        ids: ["ntp"],
        dest_folder: "organizations",
    },
    channels: {
        url: "api/channel/v1/read/",
        ids: ["505c7c48ac6dc1edc9b08f21db5a571d"],
        dest_folder: "channels",
    },
    frameworks: {
        url: "api/framework/v1/read/",
        ids: ["NCF", "pb_k-12", "as_k-12", "hr_k-12", "mh_k-12_1", "dl_k-12_1", "ts_k-12", "mn_k-12", "tn_k-12_5", "rj_k-12", "sk_k-12_1", "jk_k-12", "gj_k-12", "cg_k-12", "jh_k-12", "nl_k-12", "ga_k-12", "up_k-12", "ka_k-12", "ap_k-12_1", "ncert_k-12"],
        dest_folder: "frameworks",
    },
    forms: {
        url: "api/data/v1/form/read",
        requests_data: [
            {
                type: "content",
                action: "search",
                subType: "resourcebundle",
                rootOrgId: "505c7c48ac6dc1edc9b08f21db5a571d",
            },
            {
                type: "content",
                action: "search",
                subType: "explore",
                rootOrgId: "505c7c48ac6dc1edc9b08f21db5a571d",
            },
        ],
        dest_folder: "forms",
    },
    location: {
        url: "api/data/v1/location/search",
        dest_folder: "location",
    },
};
exports.default = config;
