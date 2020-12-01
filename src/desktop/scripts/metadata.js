const token = process.env.API_TOKEN;
const fse = require("fs-extra");
const axios = require("axios");
const path = require("path");
const pluginName = 'openrap-sunbirded-plugin'
const baseDirPath = path.join(__dirname, '..', pluginName, 'data')
let rootOrgHashTagId;

const getInstance = async () => {
    const envs = await fse.readJSON(path.join(__dirname, '..', 'env.json'))
    const instance = axios.create({
        baseURL: envs.APP_BASE_URL,
        timeout: 5000,
        headers: {
            'authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return instance;
}

const getFrameWorks = async (frameworks = []) => {
    const instance = await getInstance()
    for (const { identifier } of frameworks) {
        console.log(`call to get framework ${identifier}`)
        const response = await instance.get(`/api/framework/v1/read/${identifier}`)
            .catch(err => console.log(`error while getting framework ${identifier}`, err.response.status, err.response.data))

        if (response && response.data) {
            console.log(`saving framework ${identifier} to file`)
            await fse.writeJSON(path.join(baseDirPath, 'frameworks', `${identifier}.json`), response.data);
        }
    }
}


const getChannels = async () => {
    const instance = await getInstance()
    let { data: rootOrgData } = await instance.get(`/api/channel/v1/read/${rootOrgHashTagId}`)
    await fse.writeJSON(path.join(baseDirPath, 'channels', `${rootOrgHashTagId}.json`), rootOrgData)

    const { data: custodianSettingData } = await instance.get(`/learner/data/v1/system/settings/get/custodianOrgId`)
    const custodianOrgId = custodianSettingData.result.response.value;
    let { data: custodianOrgData } = await instance.get(`/api/channel/v1/read/${custodianOrgId}`)
    await fse.writeJSON(path.join(baseDirPath, 'channels', `${custodianOrgId}.json`), custodianOrgData)
    getFrameWorks(custodianOrgData.result.channel.frameworks);
    getFrameWorks(custodianOrgData.result.channel.suggested_frameworks);
    getFrameWorks(rootOrgData.result.channel.suggested_frameworks);
    getFrameWorks(rootOrgData.result.channel.frameworks);
}


const getOrgs = async () => {
    const envs = await fse.readJSON(path.join(__dirname, '..', 'env.json'))
    const instance = await getInstance()
    let { data } = await instance.post("/api/org/v1/search", {"request":{"filters":{"isRootOrg":true,"slug": envs.CHANNEL}}})
    // inject the Channel to env.json
     
    envs.CHANNEL = data.result.response.content[0].slug;
    console.log(`Root org is ${envs.CHANNEL}`)
    rootOrgHashTagId = data.result.response.content[0].hashTagId;
    await fse.writeJSON(path.join(__dirname, '..', 'env.json'), envs);
    // save the org to file
    const orgFile = path.join(baseDirPath, 'organizations', `${envs.CHANNEL}.json`)
    await fse.writeJSON(orgFile, data)
    await getChannels();
}


const getForms = async () => {
    const forms = [
        {
            "type": "user",
            "action": "onboarding",
            "subtype": "externalIdVerification"
        },
        {
            "type": "contentcategory",
            "action": "menubar",
            "subtype": "global"
        },
        {
            "type": "framework",
            "action": "search",
            "subtype": "framework-code"
        },
        {
            "type": "content",
            "action": "search",
            "subtype": "resourcebundle"
        },
        {
            "type": "generaliseResourceBundles",
            "action": "list",
            "subtype": "global"
        },
        {
            "type": "batch",
            "action": "list",
            "subtype": "report_types"
        },
        {
            "type": "group",
            "subtype": "activities",
            "action": "list"
        },
        {
            "type": "contentfeedback",
            "subtype": "en",
            "action": "get"
        },
        {
            "type": "content",
            "action": "play",
            "subtype": "pdf"
        },
        {
            "type": "organization",
            "action": "sign-in",
            "subtype": "organization"
        },
        {
            "type": "user",
            "action": "update",
            "subtype": "framework"
        },
        {
            "type": "user",
            "action": "create",
            "subtype": "child"
        },
        {
            "type": "user",
            "action": "get",
            "subtype": "tenantPersonaInfo"
        },
        {
            "type": "user",
            "action": "submit",
            "subtype": "selfDeclaration"
        },
        {
            "type": "content",
            "subtype": "courses",
            "action": "filter"
        },
        {
            "type": "content",
            "action": "search",
            "subtype": "explore"
        }
    ]
    const instance = await getInstance();
    for (const { type, subtype, action } of forms) {
        const response = await instance.post(`/api/data/v1/form/read`, { "request": { "type": type, "action": action, "subType": subtype } })
            .catch(err => console.log(`error while getting form ${type} ${subtype} ${action}`, err.response.status, err.response.data))
        if (response && response.data) {
            await fse.writeJSON(path.join(baseDirPath, 'forms', `${type}_${subtype}_${action}.json`), response.data);
        }
    }
}

const getPages = async () => {

    const pages = [
        {
            "source": "web",
            "name": "Course"
        },
        {
            "source": "web",
            "name": "DIAL Code Consumption"
        },
        {
            "source": "web",
            "name": "User Courses"
        }
    ]
    // not required since it is online only feature now

}

const getFaqs = async () => {
    const envs = await fse.readJSON((path.join(__dirname, '..', 'env.json')));
    const faqUrl = envs.FAQ_BLOB_URL;
    const instance = await getInstance()
    const langResponse = await instance.post(`/api/data/v1/form/read`,
        {
            "request": {
                "type": "content",
                "action": "search",
                "subType": "resourcebundle"
            }
        })

    const langs = langResponse.data.result.form.data.fields[0].range;
    for (const { value } of langs) {
        const faqResponse = await axios.get(`${faqUrl}faq-${value}.json`)
            .catch(err => console.log(`error while get faq for ${value} language`, err.response.status, err.response.statusText))
        if (faqResponse && faqResponse.data) {
            await fse.writeJSON(path.join(baseDirPath, 'faqs', `${value}.json`), faqResponse.data)
        }
    }
}

const getLocations = async () => {
    const instance = await getInstance();
    const { data: stateData } = await instance.post(`/learner/data/v1/location/search`,
     { "params": {}, "request": { "filters": { "type": "state" } } })
     await fse.ensureDir(path.join(baseDirPath, 'location'))
    await fse.writeJSON(path.join(baseDirPath, 'location', `state.json`), stateData)
    const states = stateData.result.response
    for (const {id} of states) {
        const {data: districtData } = await instance.post(`/learner/data/v1/location/search`,
        {"params":{},"request":{"filters":{"type":"district","parentId":id}}}
        )
        await fse.writeJSON(path.join(baseDirPath, 'location', `district-${id}.json`), districtData)
    }
}


getOrgs();
getForms();
// getPages();
getLocations();
getFaqs();