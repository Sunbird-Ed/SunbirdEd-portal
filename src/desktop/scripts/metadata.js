const token = process.env.offline_desktop_assets_token;
const fse = require("fs-extra");
const axios = require("axios");
const path = require("path");
const pluginName = 'openrap-sunbirded-plugin'
const baseDirPath = path.join(__dirname, '..', pluginName, 'data')
const _ = require("lodash");
const { app } = require("electron");
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
            .catch(err => console.log(`error while getting framework ${identifier}`, _.get(err, 'response.status'), _.get(err, 'response.data')))

        if (response && response.data) {
            console.log(`saving framework ${identifier} to file`)
            const freameworkFile = path.join(baseDirPath, 'frameworks', `${identifier}.json`)
            await fse.createFile(freameworkFile)
            await fse.writeJSON(freameworkFile, response.data);
        }
    }
}


const getChannels = async () => {
    const instance = await getInstance()
    let { data: rootOrgData } = await instance.get(`/api/channel/v1/read/${rootOrgHashTagId}`)
    await fse.createFile(path.join(baseDirPath, 'channels', `${rootOrgHashTagId}.json`))
    await fse.writeJSON(path.join(baseDirPath, 'channels', `${rootOrgHashTagId}.json`), rootOrgData)

    const { data: custodianSettingData } = await instance.get(`/api/data/v1/system/settings/get/custodianOrgId`)
    const custodianOrgId = custodianSettingData.result.response.value;
    let { data: custodianOrgData } = await instance.get(`/api/channel/v1/read/${custodianOrgId}`)
    await fse.createFile(path.join(baseDirPath, 'channels', `${custodianOrgId}.json`))
    await fse.writeJSON(path.join(baseDirPath, 'channels', `${custodianOrgId}.json`), custodianOrgData)
    getFrameWorks(custodianOrgData.result.channel.frameworks);
    getFrameWorks(custodianOrgData.result.channel.suggested_frameworks);
    getFrameWorks(rootOrgData.result.channel.suggested_frameworks);
    getFrameWorks(rootOrgData.result.channel.frameworks);
}


const getOrgs = async () => {
    const envs = await fse.readJSON(path.join(__dirname, '..', 'env.json'))
    const instance = await getInstance()
    let { data } = await instance.post("/api/org/v1/search", { "request": { "filters": { "isRootOrg": true, "slug": envs.CHANNEL } } })
    // inject the Channel to env.json

    envs.CHANNEL = data.result.response.content[0].slug;
    console.log(`Root org is ${envs.CHANNEL}`)
    rootOrgHashTagId = data.result.response.content[0].hashTagId;
    await fse.writeJSON(path.join(__dirname, '..', 'env.json'), envs);
    // save the org to file
    const orgFile = path.join(baseDirPath, 'organizations', `${envs.CHANNEL}.json`)
    await fse.createFile(orgFile)
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
        },
        {
            "type": "content",
            "subType": "player",
            "action": "play"
        }
    ]
    const instance = await getInstance();
    for (const { type, subtype, action } of forms) {
        let response = await instance.post(`/api/data/v1/form/read`, { "request": { "type": type, "action": action, "subType": subtype } })
            .catch(err => console.log(`error while getting form ${type} ${subtype} ${action}`, err.response.status, err.response.data))
        if (!response) {
            response = await instance.post(`/api/data/v1/form/read`, { "request": { "type": type, "action": action, "subtype": subtype } })
                .catch(err => console.log(`error while getting form ${type} ${subtype} ${action}`, err.response.status, err.response.data))
        }
        if (response && response.data) {
            const formFile = path.join(baseDirPath, 'forms', `${type}_${subtype}_${action}.json`)
            await fse.createFile(formFile)
            await fse.writeJSON(formFile, response.data);
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
            const faqFile = path.join(baseDirPath, 'faqs', `${value}.json`)
            await fse.createFile(faqFile)
            await fse.writeJSON(faqFile, faqResponse.data)
        }
    }
}

const getLocations = async () => {
    const instance = await getInstance();
    const { data: stateData } = await instance.post(`/api/data/v1/location/search`,
        { "params": {}, "request": { "filters": { "type": "state" } } })
    await fse.ensureDir(path.join(baseDirPath, 'location'))
    await fse.writeJSON(path.join(baseDirPath, 'location', `state.json`), stateData)
    const states = stateData.result.response
    for (const { id } of states) {
        const { data: districtData } = await instance.post(`/api/data/v1/location/search`,
            { "params": {}, "request": { "filters": { "type": "district", "parentId": id } } }
        )
        await fse.writeJSON(path.join(baseDirPath, 'location', `district-${id}.json`), districtData)
    }
}


const getMetaData = async () => {
    return Promise.all([getOrgs(), getForms(), getLocations(), getFaqs()])
    // getPages();
}

const copyAssetsAndUpdateFiles = async () => {
    console.log(`Running env ${process.env.offline_target_env}`);
    const appConfig = await fse.readJSON(path.join(__dirname, '..', 'env.json'))
    let packageJSON = await fse.readJSON(path.join(__dirname, '..', "package.json"));
    packageJSON.name = appConfig.APP_NAME;
    packageJSON.description = appConfig.APP_NAME;
    packageJSON.build.appId = appConfig.APP_ID;
    packageJSON.homepage = appConfig.APP_BASE_URL;
    packageJSON.author.name = appConfig.AUTHOR.NAME;
    packageJSON.author.email = appConfig.AUTHOR.EMAIL;
    await fse.writeJSON(path.join(__dirname, '..', "package.json"), packageJSON);
    appConfig.APP_BASE_URL_TOKEN = process.env.offline_app_base_url_token;
    appConfig.RELEASE_DATE = Date.now();
    await fse.writeJSON(path.join(__dirname, '..', 'env.json'), appConfig);

    let mainJS = fse.readFileSync(path.join(__dirname, '..', "main.js"), 'utf8');
    let envString = Buffer.from(JSON.stringify(appConfig)).toString('base64')
    mainJS = mainJS.replace('ENV_STRING_TO_REPLACE', envString)
    await fse.remove(path.join(__dirname, '..', 'env.json'))
    let rootOrgObj = JSON.parse(fse.readFileSync(
        path.join(__dirname, '..', 'openrap-sunbirded-plugin', "data", "organizations", `${appConfig.CHANNEL}.json`), 'utf8'));

    mainJS = mainJS.replace('ROOT_ORG_ID', rootOrgObj.result.response.content[0].rootOrgId)
    mainJS = mainJS.replace('HASH_TAG_ID', rootOrgObj.result.response.content[0].hashTagId)
    fse.writeFileSync(path.join(__dirname, '..', "main.js"), mainJS);

    fse.copySync(
        path.join(__dirname, `..`, `..`, `desktop-assets`, process.env.offline_target_env, "appLogo.png"),
        path.join(__dirname, '..', "logo.png")
    );

    fse.copySync(
        path.join(__dirname, `..`, `..`, `desktop-assets`, process.env.offline_target_env, "logo.svg"),
        path.join(__dirname, "..", "public", "portal", "assets", "images", "logo.svg")
    );

    //copy help videos and pdfs
    fse.mkdirSync(path.join(__dirname, "..", "public", "portal", "assets", "videos"));
    fse.copySync(
        path.join(__dirname, `..`, `..`, `desktop-assets`, "help", "videos"),
        path.join(__dirname, "..", "public", "portal", "assets", "videos")
    );
}

const init = async () => {
    await fse.copyFile(path.join(__dirname, `..`, `..`, `desktop-assets/${process.env.offline_target_env}/appConfig.json`), `env.json`)
    await getMetaData();
    await copyAssetsAndUpdateFiles();
}

init();