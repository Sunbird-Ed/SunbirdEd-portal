const token = process.env.offline_desktop_assets_token;
const fse = require("fs-extra");
const axios = require("axios");
const path = require("path");
const pluginName = 'openrap-sunbirded-plugin'
const baseDirPath = path.join(__dirname, '..', pluginName, 'data')
const _ = require("lodash");
const { app } = require("electron");
const allSettled = require('promise.allsettled');
let rootOrgHashTagId;
let envObj;

const getInstance = async () => {
    const envs = envObj || await fse.readJSON(path.join(__dirname, '..', 'env.json'));
    envObj = envs;
    const instance = axios.create({
        baseURL: envs.APP_BASE_URL,
        timeout: 10000,
        headers: {
            'authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return instance;
}

const getFrameWorks = async (frameworks = []) => {
    const instance = await getInstance()
    const frameworkAPIRquests = []
    for (const { identifier } of frameworks) {
        frameworkAPIRquests.push(instance.get(`/api/framework/v1/read/${identifier}`))
    }
    const responses = await Promise.allSettled(frameworkAPIRquests);
    const fileCreationPaths = [];
    const fileWriteData = [];
    for (const result of responses) {
        if (result.status === 'fulfilled') {
            const identifier = result.value.data.result.framework.identifier;
            const freameworkFile = path.join(baseDirPath, 'frameworks', `${identifier}.json`)
            fileCreationPaths.push(freameworkFile)
            fileWriteData.push({ file: freameworkFile, data: result.value.data })
        } else {
            console.info(_.get(result, 'reason.config.url'), 'URL failed with status : ', _.get(result, 'reason.response.status'));
        }
    }
    await Promise.allSettled(fileCreationPaths.map(file => fse.createFile(file)));
    await Promise.allSettled(fileWriteData.map(dataMap => fse.writeJSON(dataMap.file, dataMap.data)));
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
    let { data } = await instance.post("/api/org/v2/search", { "request": { "filters": { "isTenant": true, "slug": envs.CHANNEL } } })
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
            "subtype": "player",
            "action": "play"
        },
        {
            "type": "desktopConfig",
            "subtype": "login",
            "action": "get"
        },
        {
            "type": "profileConfig",
            "action": "get",
            "subtype": "default"
        },
        {
            "type": "config",
            "action": "get",
            "subtype": "userType",
            "component": "portal"
          }
    ]
    const instance = await getInstance();
    const formApirequests = []
    for (const { type, subtype, action } of forms) {
        formApirequests.push()
    }
    let formResponses = [];
    const results = await Promise.allSettled(forms.map(({ type, subtype, action, component }) => {
        const req = { "request": { "type": type, "action": action, "subType": subtype } };
        if (component) {
            req.request.component = component;
        }
        return instance.post(`/api/data/v1/form/read`, req)
    }));
    const groupedResults = _.groupBy(results, 'status');
    if(groupedResults.fulfilled) {
        formResponses = [...formResponses, ...groupedResults.fulfilled]
    }

    const getFilePath = (value) => {
        const requestBody = JSON.parse(value.config.data);
        const request = requestBody.request;
        console.log(request)
        const type = request.type;
        const subtype = request.subType || request.subtype;
        const action = request.action;
        return (path.join(baseDirPath, 'forms', `${type}_${subtype}_${action}.json`));
    }
    await Promise.allSettled(formResponses.map(({value}) => {
        return fse.createFile(getFilePath(value))
    }));

    await Promise.allSettled(formResponses.map(({value}) => {
        return  fse.writeJSON(getFilePath(value), value.data);
    }))
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

    const langs = _.get(langResponse, 'data.result.form.data.fields[0].range') || [];
    if (langs) {
        const faqResponses = await Promise.allSettled(langs.map(({ value }) => {
            return axios.get(`${faqUrl}faq-${value}.json`)
        }))
        for (const response of faqResponses) {
            if (response.status === 'rejected') {
                console.info(_.get(response, 'reason.config.url'), 'URL failed with status : ', _.get(response, 'reason.response.status'));
            }
        }
        await Promise.allSettled(faqResponses.map(response => {
            if (response.status === 'fulfilled') {
                const url = response.value.config.url;
                const fileName = url.substr(url.length - 7);
                return fse.createFile(path.join(baseDirPath, 'faqs', fileName));
            }
        }))

        await Promise.allSettled(faqResponses.map(response => {
            if (response.status === 'fulfilled') {
                const url = response.value.config.url;
                const fileName = url.substr(url.length - 7);
                return fse.writeJSON(path.join(baseDirPath, 'faqs', fileName), response.value.data)
            }
        }))
    }
}

const getGeneralizedLabels = async () => {
    const instance = await getInstance()
    const langResponse = await instance.post(`/api/data/v1/form/read`, {
        request: {
            type: "generaliseresourcebundles",
            action: "list",
            subType: "global",
            component: "portal"
        },
    });
    const langObj = _.get(langResponse, 'data.result.form.data.fields[0].default.trackable');
    if (langObj) {
        let generalizedLabelResponses = [];

        for (const iterator in langObj) {
            const gl = await instance.get(`getGeneralisedResourcesBundles/${iterator}/${langObj[iterator]}`);
            generalizedLabelResponses.push({key: iterator, value:_.get(gl, 'data.result')});
        }

        const getFilePath = (key) => {
            return path.join(baseDirPath, 'resourceBundles', `generalized_${key}.json`);
        }
        await Promise.allSettled(generalizedLabelResponses.map(({key}) => {
            return fse.createFile(getFilePath(key));
        }));

        await Promise.allSettled(generalizedLabelResponses.map(({key, value}) => {
            return fse.writeJSON(getFilePath(key), value);
        }));
    }

};

const getLocations = async () => {
    const instance = await getInstance();
    const { data: stateData } = await instance.post(`/api/data/v1/location/search`,
        { "params": {}, "request": { "filters": { "type": "state" } } })
    await fse.ensureDir(path.join(baseDirPath, 'location'))
    await fse.writeJSON(path.join(baseDirPath, 'location', `state.json`), stateData)
    const states = stateData.result.response
    const districtResponses = await Promise.allSettled(states.map(({ id }) => instance.post(`/api/data/v1/location/search`,
        { "params": {}, "request": { "filters": { "type": "district", "parentId": id } } })));

    const districtFileWriteResponses = await Promise.allSettled(districtResponses.map(districtResponse => {
        if (districtResponse.status === 'fulfilled') {
            const requestBody = JSON.parse(districtResponse.value.config.data);
            const id = requestBody.request.filters.parentId;
            return fse.writeJSON(path.join(baseDirPath, 'location', `district-${id}.json`), districtResponse.value.data)
        }
    }))

    districtFileWriteResponses.forEach(districtResponse => {
        if (districtResponse.status === 'rejected') {
            console.info(districtResponse.reason);
        }
    })
}


const getMetaData = async () => {
    return Promise.all([getOrgs(), getForms(), getLocations(), getFaqs(), getGeneralizedLabels()])
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
    packageJSON.build.protocols.schemes.push(appConfig.APP_ID.replace(/\./g, ""));
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
    await fse.writeFile(path.join(__dirname, '..', "main.js"), mainJS);

    await fse.copy(
        path.join(__dirname, `..`, `..`, `desktop-assets`, process.env.offline_target_env, "appLogo.png"),
        path.join(__dirname, '..', "logo.png")
    );

    await fse.copy(
        path.join(__dirname, `..`, `..`, `desktop-assets`, process.env.offline_target_env, "logo.svg"),
        path.join(__dirname, "..", "public", "portal", "assets", "images", "logo.svg")
    );

    //copy help videos and pdfs
    await fse.mkdir(path.join(__dirname, "..", "public", "portal", "assets", "videos"));
    await fse.copy(
        path.join(__dirname, `..`, `..`, `desktop-assets`, "help", "videos"),
        path.join(__dirname, "..", "public", "portal", "assets", "videos")
    );
}
const init = async () => {
    await fse.copyFile(path.join(__dirname, `..`, `..`, `desktop-assets/${process.env.offline_target_env}/appConfig.json`), `env.json`)
    await getMetaData();
    await copyAssetsAndUpdateFiles();

}

init()