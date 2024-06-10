import { logger } from "@project-sunbird/logger";
import { HTTPService } from "../OpenRAP/services/httpService";
import { expect } from "chai";
import * as _ from "lodash";
import { of, throwError } from "rxjs";
import * as supertest from "supertest";
import * as faqTestData from "./test_data/faq.test.data";
import { InitializeEnv } from "./test_data/initialize_env";
import * as mockData from "./test_data/mock.test.data";
import { error_telemetry_v1, error_telemetry_v3, telemetry_v1, telemetry_v3 } from "./test_data/routes.spec.data";
import { ConnectToServer } from "./test_data/routes.test.server";
const chai = require("chai"), spies = require("chai-spies");
chai.use(spies);
const spy = chai.spy.sandbox();
const initialzeEnv = new InitializeEnv();
const server = new ConnectToServer();
let app;
let importId;
let telemetryImportId;

initialzeEnv.init();

before("StartServer", async () => {
    await server.startServer().then((res) => {
        app = res;
        logger.info(`Server Connected`);
    }).catch((err) => {
        logger.error(`Received Error while connecting to server err: ${err}`);
    });
});

describe("All", () => {

    it("All", (done) => {
        supertest(app)
            .get("/")
            .set("Content-Type", "text/html; charset=utf-8")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                done();
            });
    });
});

describe("Test Resourcebundle", () => {

    it("#resourcebundle for english", (done) => {
        supertest(app)
            .get(`/resourcebundles/v1/read/en`)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.resoucebundles.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.result).to.have.property("consumption");
                expect(res.body.result.result.consumption.frmelmnts.lbl).to.deep.include({ creators: "Creators" });
                done();
            });
    });

    it("#resourcebundle for telugu", (done) => {
        supertest(app)
            .get(`/resourcebundles/v1/read/te`)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.resoucebundles.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.have.property("consumption");
                expect(res.body.result.consumption.frmelmnts.lbl).to.deep.include({ creators: "సృష్టికర్తలు" });
                done();
            });
    });

    it("#resourcebundle for hindi (ERROR)", (done) => {
        supertest(app)
            .get(`/resourcebundles/v1/read/hi`)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(404)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("RESOURCE_NOT_FOUND");
                expect(res.body.id).to.equal("api.resoucebundles.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                done();
            });
    });

});

describe("Test Organisation with and without referrer", () => {

    it("#organisation", (done) => {
        supertest(app)
            .post("/api/org/v2/search")
            .send({ request: { filters: { slug: "sunbird", isTenant: true } } })
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.org.search").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.response.content[0]).to.deep.include({ slug: "sunbird" });
                expect(res.body.result.response).to.have.property("content");
                expect(res.body.result.response).to.have.property("count");
                done();
            });
    });

    it("#Set referrer for Organisation", (done) => {
        supertest(app)
            .post("/api/org/v2/search")
            .set("Referer", `${process.env.APP_BASE_URL}/browse`)
            .send({ request: { filters: { slug: "sunbird", isTenant: true } } })
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.org.search").to.be.a("string");
                expect(res.body.ver).to.oneOf(["v1", "1.0"]).to.be.a("string");
                expect(res.body.result.response.content[0]).to.deep.include({ slug: "sunbird" });
                expect(res.body.result.response).to.have.property("content");
                expect(res.body.result.response).to.have.property("count");
                done();
            });
    });

    it("#organistion (ERROR)", (done) => {
        supertest(app)
            .post("/api/org/v2/search")
            .send({})
            .expect(500)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.org.search").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                done();
            });
    });

});

describe("Test Form with and without referrer", () => {

    it("#Form", (done) => {
        supertest(app)
            .post("/api/data/v1/form/read")
            .send({ request: { type: "content", action: "search", subType: "resourcebundle", rootOrgId: "505c7c48ac6dc1edc9b08f21db5a571d" } })
            .expect(200)
            .end((err, res) => {
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.form.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.form).to.deep.include({ type: "content" });
                expect(res.body.result.form).to.deep.include({ subtype: "resourcebundle" });
                expect(res.body.result.form).to.deep.include({ action: "search" });

                done();
            });
    });

    it("#Set referrer for Form", (done) => {
        supertest(app)
            .post("/api/data/v1/form/read")
            .set("Referer", `${process.env.APP_BASE_URL}/browse`)
            .send({ request: { type: "content", action: "search", subType: "resourcebundle", rootOrgId: "505c7c48ac6dc1edc9b08f21db5a571d" } })
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.form.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.form).to.deep.include({ type: "content" });
                expect(res.body.result.form).to.deep.include({ action: "search" });
                expect(res.body.result.form).to.deep.include({ subtype: "resourcebundle" });
                done();
            });
    });

    it("#Form (ERROR)", (done) => {
        supertest(app)
            .post("/api/data/v1/form/read")
            .send({ request: { type: "content", action: "search", subType: "resource", rootOrgId: "505c7c48ac6dc1edc9b08f21db5a571d" } })
            .expect(404)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("RESOURCE_NOT_FOUND");
                expect(res.body.id).to.equal("api.form.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                done();
            });
    });

});

describe("Test Channel with and without referrer", () => {

    it("#Channel", (done) => {
        supertest(app)
            .get("/api/channel/v1/read/505c7c48ac6dc1edc9b08f21db5a571d")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.channel.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.channel.identifier).to.equal("505c7c48ac6dc1edc9b08f21db5a571d");
                expect(res.body.result.channel.status).to.equal("Live");
                done();

            });
    });

    it("#Set Referrer for Channel", (done) => {
        supertest(app)
            .get("/api/channel/v1/read/505c7c48ac6dc1edc9b08f21db5a571d")
            .set("Referer", `${process.env.APP_BASE_URL}/browse`)
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.id).to.equal("api.channel.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.channel.identifier).to.equal("505c7c48ac6dc1edc9b08f21db5a571d");
                expect(res.body.result.channel.status).to.equal("Live");
                done();
            });
    });

    it("#Channel (ERROR)", (done) => {
        supertest(app)
            .get("/api/channel/v1/read/nochannel")
            .expect(404)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("RESOURCE_NOT_FOUND");
                expect(res.body.id).to.equal("api.channel.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                done();

            });
    });
});

describe("Test Framework with and without referrer", () => {

    it("#Framework", (done) => {
        supertest(app)
            .get("/api/framework/v1/read/TEST")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.framework.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.framework.identifier).to.equal("TEST");
                done();
            });
    });

    it("#Set Referrer for Framework", (done) => {
        supertest(app)
            .get("/api/framework/v1/read/TEST")
            .set("Referer", `${process.env.APP_BASE_URL}/browse`)
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.framework.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.framework.identifier).to.equal("TEST");
                done();
            });
    });

    it("#Framework (ERROR)", (done) => {
        supertest(app)
            .get("/api/framework/v1/read/noframework")
            .expect(404)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("RESOURCE_NOT_FOUND");
                expect(res.body.id).to.equal("api.framework.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                done();
            });
    });

});

describe("Test Tenant with and without referrer", () => {

    it("#tenant", (done) => {
        supertest(app)
            .get("/v1/tenant/info/")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.tenant.info").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.appLogo).to.equal("/appLogo.png");
                expect(res.body.result).to.have.property("logo");
                done();

            });
    });

    it("#Set Referrer for tenant", (done) => {
        supertest(app)
            .get("/v1/tenant/info/")
            .set("Referer", `${process.env.APP_BASE_URL}/browse`)
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.tenant.info").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(_.upperCase(res.body.result.titleName)).to.equal(process.env.APP_NAME);
                done();

            });
    });

});

describe("Test Telemetry", () => {

    it("#add v1 Telemetry Events", (done) => {
        supertest(app)
            .post("/content/data/v1/telemetry")
            .send(telemetry_v1)
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");

                expect(res.body.id).to.equal("api.telemetry").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                done();

            });
    });

    it("#add v3 Telemetry Events", (done) => {
        supertest(app)
            .post("/action/data/v3/telemetry")
            .send(telemetry_v3)
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.telemetry").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                done();

            });
    });

    it("#add v1 Telemetry Events (ERROR)", (done) => {
        supertest(app)
            .post("/content/data/v1/telemetry")
            .send(error_telemetry_v1)
            .expect(400)
            .end((err, res) => {

                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.id).to.equal("api.telemetry").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                done();

            });
    });
    it("#add v3 Telemetry Events (ERROR)", (done) => {
        supertest(app)
            .post("/action/data/v3/telemetry")
            .send(error_telemetry_v3)
            .expect(400)
            .end((err, res) => {

                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.id).to.equal("api.telemetry").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                done();

            });
    });
});

describe("User API", () => {
    it("#User create success", (done) => {
        supertest(app)
            .post("/api/desktop/user/v1/sso/create")
            .send({ request: { framework: { board: "english", medium: ["english"], gradeLevel: ["class 5"] } } })
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.desktop.user.create").to.be.a("string");
                expect(res.body.result.id).not.to.be.empty;
                done();
            });
    });

    it("#User create 409 conflict", (done) => {
        supertest(app)
            .post("/api/desktop/user/v1/sso/create")
            .send({ request: { framework: { board: "english", medium: ["english"], gradeLevel: ["class 5"] } } })
            .expect(409)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.status).to.equal("failed");
                expect(res.body.params.errmsg).to.equal("User already exist with name guest");
                expect(res.body.id).to.equal("api.desktop.user.create").to.be.a("string");
                done();
            });
    });

    it("#User create 500 internal server error", (done) => {
        supertest(app)
            .post("/api/desktop/user/v1/sso/create")
            .send()
            .expect(500)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.status).to.equal("failed");
                expect(res.body.id).to.equal("api.desktop.user.create").to.be.a("string");
                done();
            });
    });

    it("#User read success", (done) => {
        supertest(app)
            .get("/api/desktop/user/v5/read")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.desktop.user.read").to.be.a("string");
                expect(res.body.result.name).to.equal("guest");
                expect(res.body.result).not.to.be.empty;
                done();
            });
    });
    it("#User update success", (done) => {
        supertest(app)
            .post("/api/desktop/user/v3/update")
            .send({ request: {
            _id: "9783dc11-206c-4a3e-917a-cf4853ce23a2",
            framework: { board: "english", medium: ["english"], gradeLevel: ["class 5"] } } })
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.desktop.user.update").to.be.a("string");
                expect(res.body.result.id).not.to.be.empty;
                done();
            });
    });
    it("#User update 500 internal server error", (done) => {
        supertest(app)
            .post("/api/desktop/user/v3/update")
            .send()
            .expect(500)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.status).to.equal("failed");
                expect(res.body.id).to.equal("api.desktop.user.update").to.be.a("string");
                done();
            });
    });

    it("#User update bad request", (done) => {
        supertest(app)
            .post("/api/desktop/user/v3/update")
            .send({ request: {
            framework: { board: "english", medium: ["english"], gradeLevel: ["class 5"] } } })
            .expect(400)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.err).to.equal("ERR_BAD_REQUEST");
                expect(res.body.id).to.equal("api.desktop.user.update").to.be.a("string");
                done();
            });
    });

    it("#User update  404 (ERROR)", (done) => {
        supertest(app)
           .post("/api/desktop/user/v3/update")
           .expect(404)
           .end((err, res) => {
               expect(res.body.params.status).to.equal("failed");
               expect(res.body.id).to.equal("api.desktop.user.update");
               expect(res.body.responseCode).to.equal("INTERNAL_SERVER_ERROR");
               done();
           });
    });

});

describe("Location API", () => {

    afterEach(async () => {
        spy.restore();
    });

    it("#Search Location for states ONLINE", (done) => {
        const HTTPServiceSpy = spy.on(HTTPService, "post", (data) => of({data: mockData.location_state}));
        supertest(app)
            .post("/api/data/v1/location/search")
            .send({ request: { filters: { type: "state" } } })
            .expect(200)
            .end((err, res) => {
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.location.search").to.be.a("string");
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.result.response[0]).to.have.deep.include({code: "1", name: "test_state_11", id: "4a6d77a1-6653-4e30-9be8-93371b6b53b78", type: "state"});
                done();
            });
    });
    it("#Search Location for states ONLINE", (done) => {
        const HTTPServiceSpy = spy.on(HTTPService, "post", (data) => of({data: mockData.location_state}));
        supertest(app)
            .post("/api/data/v1/location/search")
            .send({ request: { filters: { type: "state" } } })
            .expect(200)
            .end((err, res) => {
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.location.search").to.be.a("string");
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.result.response[0]).to.have.deep.include({code: "1", name: "test_state_11", id: "4a6d77a1-6653-4e30-9be8-93371b6b53b78", type: "state"});
                done();
            });
    });

    it("#Search Location for states ONLINE EMPTY LIST", (done) => {
        const HTTPServiceSpy = spy.on(HTTPService, "post", (data) => of({data: mockData.location_state_empty}));
        supertest(app)
            .post("/api/data/v1/location/search")
            .send({ request: { filters: { type: "state" } } })
            .expect(200)
            .end((err, res) => {
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.location.search").to.be.a("string");
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.result.response).to.be.an('array').and.to.be.empty;
                done();
            });
    });

    it("#Search Location for districts ONLINE", (done) => {
        const HTTPServiceSpy = spy.on(HTTPService, "post", (data) => of({data: mockData.location_district}));
        supertest(app)
            .post("/api/data/v1/location/search")
            .send({ request: { filters: { type: "district", parentId: "b6381e02-5a79-45ec-8e1a-a2e74fc29da3" } } })
            .expect(200)
            .end((err, res) => {
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.location.search").to.be.a("string");
                expect(res.body.result.response[0]).to.have.deep.include({code: "2907", name: "test_district_1", id: "cde02789-5803-424b-a3f5-10db347280e9", type: "district", parentId: "4a6d77a1-6653-4e30-9be8-93371b6b53b78"});
                done();
            });
    });

    it("#Search Location for districts ONLINE EMPTY", (done) => {
        const HTTPServiceSpy = spy.on(HTTPService, "post", (data) => of({data: mockData.location_district_empty}));
        supertest(app)
            .post("/api/data/v1/location/search")
            .send({ request: { filters: { type: "district", parentId: "b6381e02-5a79-45ec-8e1a-a2e74fc29da3" } } })
            .expect(200)
            .end((err, res) => {
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.location.search").to.be.a("string");
                expect(res.body.result.response).to.be.an('array').and.to.be.empty;
                done();
            });
    });

    it("#Search Location for states", (done) => {
        supertest(app)
            .post("/api/data/v1/location/search")
            .send({ request: { filters: { type: "state" } } })
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.location.search").to.be.a("string");
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.result.response).to.have.deep.include({ code: "29", name: "test_state_1", id: "4a6d77a1-6653-4e30-9be8-93371b6b53b5", type: "state" });
                done();
            });
    });

    it("#Search Location for districts", (done) => {
        supertest(app)
            .post("/api/data/v1/location/search")
            .send({ request: { filters: { type: "district", parentId: "4a6d77a1-6653-4e30-9be8-93371b6b53b5" } } })
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.location.search").to.be.a("string");
                expect(res.body.result.response).to.have.deep.include({ code: "2907", name: "test_district_1", id: "cde02789-5803-424b-a3f5-10db347280e9", type: "district", parentId: "4a6d77a1-6653-4e30-9be8-93371b6b53b5" });
                done();
            });
    });

    it("#Search Location parentId is missing", (done) => {

        supertest(app)
            .post("/api/data/v1/location/search")
            .send({ request: { filters: { type: "district" } } })
            .expect(400)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.status).to.equal("failed");
                expect(res.body.id).to.equal("api.location.search").to.be.a("string");
                expect(res.body.params.errmsg).to.equal("parentId is missing");
                expect(res.body.responseCode).to.equal("CLIENT_ERROR");
                expect(res.body.params.err).to.equal("ERR_BAD_REQUEST");
                done();
            });
    });

    it("#Search Location location type is missing", (done) => {

        supertest(app)
            .post("/api/data/v1/location/search")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.status).to.equal("failed");
                expect(res.body.id).to.equal("api.location.search").to.be.a("string");
                expect(res.body.params.errmsg).to.equal("location Type is missing");
                expect(res.body.responseCode).to.equal("CLIENT_ERROR");
                expect(res.body.params.err).to.equal("ERR_BAD_REQUEST");
                done();
            });
    });

    it("#get Location (ERROR)", (done) => {
        supertest(app)
            .post("/api/data/v1/location/read")
            .expect(404)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            });
    });

    it("#save Location", (done) => {
        supertest(app)
            .post("/api/data/v1/location/save")
            .send({ request: { state: { code: "29", name: "test_state_1", id: "4a6d77a1-6653-4e30-9be8-93371b6b53b5",
            type: "state" }, city: { code: "2909", name: "test_district_2", id: "3ac37fb2-d833-45bf-a579-a2656b0cce62",
            type: "district", parentId: "4a6d77a1-6653-4e30-9be8-93371b6b53b5" }}})
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.location.save").to.be.a("string");
                expect(res.body.result).to.be.true;
                done();
            });
    });

    it("#save Location (ERROR)", (done) => {
        supertest(app)
            .post("/api/data/v1/location/save")
            .expect(500)
            .end((err, res) => {
                if (res.statusCode >= 500) { return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.params.status).to.equal("failed");
                expect(res.body.id).to.equal("api.location.save").to.be.a("string");
                expect(res.body.responseCode).to.equal("INTERNAL_SERVER_ERROR");
                done();
            });
    });

    it("#get Location", (done) => {
        supertest(app)
            .get("/api/data/v1/location/read")
            .expect(500)
            .end((err, res) => {
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.location.read").to.be.a("string");
                expect(res.body.result.state).to.deep.equal({ code: "29", name: "test_state_1", id: "4a6d77a1-6653-4e30-9be8-93371b6b53b5",
                type: "state" });
                expect(res.body.result.city).to.deep.equal({ code: "2909", name: "test_district_2", id: "3ac37fb2-d833-45bf-a579-a2656b0cce62",
                type: "district", parentId: "4a6d77a1-6653-4e30-9be8-93371b6b53b5" });
                done();
            });
    });


});

describe("FAQS API", () => {

    afterEach(async () => {
        spy.restore();
    });

    it("should read faqs from database if not connected to internet", (done) => {
        supertest(app)
            .get("/api/faqs/v1/read/en")
            .expect(200)
            .end((err, res) => {
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.faqs.read");
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.result.faqs).to.deep.equal(faqTestData.faqOfflineEn);
                done();
            });
    });
    it("should read faqs from platform if connected to internet", (done) => {
        const HTTPServiceSpy = spy.on(HTTPService, "get", (data) => of({data: faqTestData.faqOnlineEn}));
        supertest(app)
            .get("/api/faqs/v1/read/en")
            .expect(200)
            .end((err, res) => {
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.faqs.read");
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.result.faqs).to.deep.equal(faqTestData.faqOnlineEn);
                done();
            });
    });
    it("should throw error if faqs not found in platform or in db", (done) => {
        supertest(app)
            .get("/api/faqs/v1/read/ne")
            .expect(404)
            .end((err, res) => {
                expect(res.body.params.status).to.equal("failed");
                expect(res.body.id).to.equal("api.faqs.read");
                expect(res.body.responseCode).to.equal("RESOURCE_NOT_FOUND");
                done();
            });
    });
});

describe("App Update", () => {
    afterEach(async () => {
        spy.restore();
    });
    it("#app update not updated", (done) => {
        const HTTPServiceSpy = spy.on(HTTPService, "post", (data) => of({data: {result: mockData.not_updated}}));
        supertest(app)
            .get("/api/desktop/v1/update")
            .expect(200)
            .end((err, res) => {
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.desktop.update").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.updateInfo.updateAvailable).to.be.false;
                done();
            });
    });

    it("#app updated", (done) => {
        const HTTPServiceSpy = spy.on(HTTPService, "post", (data) => of({data: {result: mockData.appUpdate}}));
        supertest(app)
            .get("/api/desktop/v1/update")
            .expect(200)
            .end((err, res) => {
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.id).to.equal("api.desktop.update").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.updateInfo).to.contain(mockData.appUpdate.updateInfo);
                done();
            });
    });

    it("#app update (ERROR)", (done) => {
        process.env.APP_VERSION = "1.0.0";
        supertest(app)
            .get("/api/desktop/v1/update")
            .expect(500)
            .end((err, res) => {
                expect(res.body.params.status).to.equal("failed");
                expect(res.body.id).to.equal("api.desktop.update").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.responseCode).to.equal("INTERNAL_SERVER_ERROR");
                done();
            });
    });

    it("#app INFO updated", (done) => {
        const HTTPServiceSpy = spy.on(HTTPService, "post", (data) => of({data: {result: mockData.appUpdate}}));
        process.env.RELEASE_DATE = "16 December 2019";
        supertest(app)
            .get("/api/app/v1/info")
            .expect((res) => res.body = mockData.appUpdate)
            .expect(200)
            .end((err, res) => {
                expect(res.body.termsOfUseUrl).to.be.a("string").and.to.equal(`${process.env.APP_BASE_URL}/term-of-use.html`);
                expect(res.body.deviceId).to.be.a("string");
                expect(res.body.languages).to.equal("English, Hindi");
                expect(res.body.releaseDate).to.equal(process.env.RELEASE_DATE);
                expect(res.body.updateInfo).to.contain(mockData.appUpdate.updateInfo);
                done();
            });
    });

    it("#app INFO not updated ", (done) => {
        const HTTPServiceSpy = spy.on(HTTPService, "post", (data) => of({data: {result: mockData.not_updated}}));
        process.env.RELEASE_DATE = "16 December 2019";
        supertest(app)
            .get("/api/app/v1/info")
            .expect((res) => res.body = mockData.not_updated)
            .expect(200)
            .end((err, res) => {
                expect(res.body.deviceId).to.be.a("string");
                expect(res.body.languages).to.equal("English, Hindi");
                expect(res.body.releaseDate).to.equal(process.env.RELEASE_DATE);
                expect(res.body.updateInfo).to.contain(mockData.not_updated.updateInfo);
                done();
            });
    });

    it("#app INFO ERROR", (done) => {
        process.env.RELEASE_DATE = "16 December 2019";
        supertest(app)
            .get("/api/app/v1/info")
            .expect(res => res.body = mockData.app_update_error)
            .expect(200)
            .end((err, res) => {
                expect(res.body.result.deviceId).to.be.a("string");
                expect(res.body.result.languages).to.equal("English, Hindi");
                expect(res.body.result.releaseDate).to.equal(process.env.RELEASE_DATE);
                expect(res.body.result).not.to.haveOwnProperty("updateInfo");
                done();
            });
    });
});

describe("Test System Info", () => {
    it("#get System Info", (done) => {
        supertest(app)
            .get("/api/desktop/v1/system-info")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) {
                    return done();
                }
                expect(res.body.result.totalMemory).to.be.a("number");
                expect(res.body.result.availableMemory).to.a("number");
                done();
            });
    });
});


describe("Test Import Content/Collection", () => {

    it("#Import Collections ", (done) => {
        const filePath = [`${__dirname}/test_data/to_import_contents/TextBookTest.ecar`, `${__dirname}/test_data/to_import_contents/Maths_VI6.ecar`,`${__dirname}/test_data/to_import_contents/TEST.ecar`];
        const req = supertest(app).post("/api/content/v1/import");
        req.send(filePath);
        req.expect(200);
        req.end((err, res) => {
            importId = res.body.result.importedJobIds[0];
            expect(res.body.id).to.equal("api.content.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.result.importedJobIds).to.be.an("array");
            expect(res.body.result).to.have.property("importedJobIds");
            done();
        });
    });

    it("#Import v1 collection cancel", (done) => {
        const req = supertest(app).post(`/api/content/v1/import/cancel/${importId}`);
        req.send({});
        req.expect(200);
        req.end((err, res) => {
            expect(res.body.id).to.equal("api.content.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.params.status).to.be.a("string");
            expect(res.body.params.status).to.equal("successful");
            expect(res.body.result).to.be.an("object");
            done();
        });
    });

    it("#Import v1 collection import", (done) => {
        const filePath = `${__dirname}/test_data/to_import_contents/The_Squirrel.ecar`;
        const req = supertest(app).post("/api/content/v1/import");
        req.send([filePath]);
        req.expect(200);
        req.end((err, res) => {
            importId = res.body.result.importedJobIds[0];
            expect(res.body.id).to.equal("api.content.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.result.importedJobIds).to.be.an("array");
            expect(res.body.result).to.have.property("importedJobIds");
            done();
        });
    });

    it("#Import v1 collection pause", (done) => {
        const req = supertest(app).post(`/api/content/v1/import/pause/${importId}`);
        req.send({});
        req.expect(200);
        req.end((err, res) => {
            if (res.statusCode >= 500) {
                logger.error(err);
                return done();
            }
            if (err && res.statusCode >= 400) {
                return done();
            }
            expect(res.body.id).to.equal("api.content.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.params.status).to.be.a("string");
            expect(res.body.result).to.be.an("object");

            done();
        });
    });

    it("#Import v1 collection resume", (done) => {
        const req = supertest(app).post(`/api/content/v1/import/resume/${importId}`);
        req.send({});
        req.expect(200);
        req.end((err, res) => {
            if (res.statusCode >= 500) {
                logger.error(err);
                return done();
            }
            if (err && res.statusCode >= 400) {
                return done();
            }
            expect(res.body.id).to.equal("api.content.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.params.status).to.be.a("string");
            expect(res.body.result).to.be.an("object");
            done();
        });
    });

    it("#Import v1 content import (collection update available)", (done) => {
        const filePath = `${__dirname}/test_data/to_import_contents/Maths_VI6.ecar`;
        const req = supertest(app).post("/api/content/v1/import");
        req.send([filePath]);
        req.expect(200);
        req.end((err, res) => {
            if (res.statusCode >= 500) {
                logger.error(err);
                return done();
            }
            if (err && res.statusCode >= 400) {
                return done();
            }
            expect(res.body.id).to.equal("api.content.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.result.importedJobIds).to.be.an("array");
            expect(res.body.result).to.have.property("importedJobIds");
            done();
        });
    }).timeout(10000);

    it("#Import v1 collection pause (ERROR)", (done) => {
        const req = supertest(app).post(`/api/content/v1/import/pause/645764546776`);
        req.send({});
        req.expect(500);
        req.end((err, res) => {
            expect(res.body.id).to.equal("api.content.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.params.status).to.be.a("string");
            expect(res.body.params.status).to.equal("failed");
            expect(res.body.result).to.be.an("object");
            expect(res.body.params.errmsg).to.contain("Error while processing the request");
            done();
        });
    });

    it("#Import v1 collection resume (ERROR)", (done) => {
        const req = supertest(app).post(`/api/content/v1/import/resume/645764546776`);
        req.send({});
        req.expect(500);
        req.end((err, res) => {
            expect(res.body.id).to.equal("api.content.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.params.status).to.be.a("string");
            expect(res.body.params.status).to.equal("failed");
            expect(res.body.result).to.be.an("object");
            expect(res.body.params.errmsg).to.contain("Error while processing the request");
            done();
        });
    });

    it("#Import v1 collection cancel (ERROR)", (done) => {
        const req = supertest(app).post(`/api/content/v1/import/cancel/645764546776`);
        req.send({});
        req.expect(500);
        req.end((err, res) => {
            expect(res.body.id).to.equal("api.content.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.params.status).to.be.a("string");
            expect(res.body.params.status).to.equal("failed");
            expect(res.body.result).to.be.an("object");
            expect(res.body.params.errmsg).to.contain("Error while processing the request");
            done();
        });
    });

    it("#Import Collections ", (done) => {
        const filePath = [`${__dirname}/test_data/to_import_contents/TextBookTest.ecar`];
        const req = supertest(app).post("/api/content/v1/import");
        req.send(filePath);
        req.expect(200);
        req.end((err, res) => {
            expect(res.body.id).to.equal("api.content.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.result.importedJobIds).to.be.an("array");
            expect(res.body.result).to.have.property("importedJobIds");
            done();
        });
    }).timeout(30000);

    it("#Import Content List", (done) => {
        const interval = setInterval(() => {
            supertest(app)
                .post("/api/content/v1/download/list")
                .send({})
                .expect(200)
                .end((err, res) => {
                        expect(res.body.result.response.contents).to.be.an("array");
                        expect(res.body.result.response.contents[0]).to.have.property("status");
                        expect(res.body.result.response.contents[0]).to.have.property("downloadedSize");
                        clearInterval(interval);
                        done();
                });
        }, 2000);
    }).timeout(210000);
});

describe("Read and update content / collection", () => {

    it("#Get Content and check for update (content update available)", (done) => {
        supertest(app)
            .get("/api/content/v1/read/do_112835335135993856149")
            .set("Content-Type", "application/json/")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.content.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.content.identifier).to.equal("do_112835335135993856149").to.be.a("string");
                done();
            });
    });

    xit("#update CONTENT", (done) => {
        supertest(app)
            .post("/api/content/v1/update/do_112835335135993856149")
            .send({})
            .expect(200)
            .end((err, res) => {
                expect(res.body.id).to.equal("api.content.update").to.be.a("string");
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.be.a("string");
                done();
            });
    }).timeout(10000);



    xit("#update CONTENT inside collection", (done) => {
        supertest(app)
            .post("/api/content/v1/update/do_112835335135993856149")
            .send({ request: { parentId: "do_112835337547972608153" } })
            .expect(200)
            .end((err, res) => {
                expect(res.body.id).to.equal("api.content.update").to.be.a("string");
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.be.a("string");
                done();
            });
    }).timeout(10000);

    it("#Get CourseHierarchy and check for update", (done) => {
        supertest(app)
            .get("/api/course/v1/hierarchy/do_112835337547972608153")
            .set("Content-Type", "application/json/")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) {
                    logger.error(err);
                    return done();
                }
                if (err && res.statusCode >= 400) {
                    return done();
                }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.content.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.content.identifier).to.equal("do_112835337547972608153").to.be.a("string");
                done();
            });
    });

    xit("#update COLLECTION", (done) => {
        supertest(app)
            .post("/api/content/v1/update/do_112835337547972608153")
            .send({})
            .expect(200)
            .end((err, res) => {
                expect(res.body.id).to.equal("api.content.update").to.be.a("string");
                expect(res.body.params.status).to.equal("successful");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.be.a("string");
                done();
            });
    }).timeout(20000);

    it("#set referrer for Get Content (ERROR)", (done) => {
        supertest(app)
            .get("/api/content/v1/read/do_112835337547972608")
            .set("Content-Type", "application/json/")
            .set("Referer", `${process.env.APP_BASE_URL}/browse`)
            .expect(res => {res.body = mockData.get_content_error})
            .expect(404)
            .end((err, res) => {
                expect(res.body.id).to.equal("api.content.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.responseCode).to.equal("RESOURCE_NOT_FOUND");
                done();
            });
    });

    it("#Get Content (ERROR)", (done) => {
        supertest(app)
            .get("/api/content/v1/read/do_112835337547972608")
            .set("Content-Type", "application/json/")
            .expect(404)
            .end((err, res) => {
                expect(res.body.id).to.equal("api.content.read").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.responseCode).to.equal("RESOURCE_NOT_FOUND");
                done();
            });
    });

    it("#Set referrer for Get CourseHierarchy (ERROR)", (done) => {
    supertest(app)
        .get("/api/course/v1/hierarchy/KP_FT_156385804")
        .set("Content-Type", "application/json/")
        .set("Referer", `${process.env.APP_BASE_URL}/browse`)
        .expect(404)
        .end((err, res) => {
            if (res.statusCode >= 500) { logger.error(err); return done(); }
            if (err && res.statusCode >= 400) {  return done(); }
            expect(res.body.id).to.equal("api.course.hierarchy").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            done();
        });
    });

});

describe("Search for content", () => {
    it("#Search Content", (done) => {
        supertest(app)
            .post("/api/content/v1/search")
            .send({ request: { filters: { channel: "505c7c48ac6dc1edc9b08f21db5a571d", contentType: ["Collection", "TextBook", "LessonPlan", "Resource"] }, limit: 20, query: "maths",  softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }, mode: "soft", facets: ["board", "medium", "gradeLevel", "subject", "contentType"], offset: 0 } })
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) {  return done(); }
                expect(res.body.id).to.equal("api.content.search").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.have.property("content");
                expect(res.body.result).to.have.property("count");
                done();
            });
    });

    it("#Set referrer to Search Content", (done) => {
        supertest(app)
            .post("/api/content/v1/search")
            .send({ request: { filters: { channel: "505c7c48ac6dc1edc9b08f21db5a571d", contentType: ["Collection", "TextBook", "LessonPlan", "Resource"] }, limit: 20, query: "maths",  softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }, mode: "soft", facets: ["board", "medium", "gradeLevel", "subject", "contentType"], offset: 0 } })
            .set("Referer", `${process.env.APP_BASE_URL}/browse`)
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) {  return done(); }
                expect(res.body.id).to.equal("api.content.search").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.have.property("content");
                expect(res.body.result).to.have.property("count");
                done();
            });
    });

    it("#Set Referrer for Search Content (ERROR)", (done) => {
        supertest(app)
            .post("/api/content/v1/search")
            .set("Referer", `${process.env.APP_BASE_URL}/browse`)
            .send({})
            .expect(500)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) {  return done(); }
                expect(res.body.id).to.equal("api.content.search").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                done();
    });
    });

    it("#Search Content return empty list", (done) => {
                supertest(app)
                    .post("/api/content/v1/search")
                    .send({})
                    .expect(200)
                    .end((err, res) => {
                        if (res.statusCode >= 500) { logger.error(err); return done(); }
                        if (err && res.statusCode >= 400) {  return done(); }
                        expect(res.body.params.status).to.equal("successful");
                        expect(res.body.responseCode).to.equal("OK");
                        done();
                    });
        });

    it("#Search Content query", (done) => {
        supertest(app)
            .post("/api/content/v1/search")
            .send({ request: { filters: { channel: "505c7c48ac6dc1edc9b08f21db5a571d", contentType: ["Collection", "TextBook", "LessonPlan", "Resource"] }, limit: 20, softConstraints: { badgeAssertions: 98, board: 99, channel: 100 }, mode: "soft", facets: ["board", "medium", "gradeLevel", "subject", "contentType"], offset: 0, query: "kp" } })
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) {  return done(); }
                expect(res.body.id).to.equal("api.content.search").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.have.property("content");
                expect(res.body.result).to.have.property("count");
                done();
            });
    });
});

describe("Test Download content / collection", () => {
    it("#Download Content", (done) => {
        supertest(app)
            .post("/api/content/v1/download/KP_FT_1564394134764")
            .send({})
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) {  return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.content.download").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.have.property("downloadId");
                done();
            });
    }).timeout(100000);

    it("#Download Collection", (done) => {
        supertest(app)
            .post("/api/content/v1/download/KP_FT_1563858046256")
            .send({})
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) {  return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.content.download").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.have.property("downloadId");
                done();
            });
    }).timeout(100000);

    it("#Download Content (ERROR)", (done) => {
        supertest(app)
            .post("/api/content/v1/download/KP_FT_1564394134")
            .send({})
            .expect(500)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) {  return done(); }
                expect(res.body.responseCode).to.equal("INTERNAL_SERVER_ERROR");
                expect(res.body.id).to.equal("api.content.download").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                done();
            });
    }).timeout(100000);

    it("#Download Content List", (done) => {
        const interval = setInterval(() => {
            supertest(app)
                .post("/api/content/v1/download/list")
                .send({})
                .expect(200)
                .end((err, res) => {

                    if (res.statusCode >= 500) { logger.error(err); return done(); }
                    if (err && res.statusCode >= 400) {  return done(); }
                    expect(res.body.result.response.contents).to.be.an("array");
                    expect(res.body.result.response.contents[0]).to.have.any.keys("status", "resourceId", "contentId");
                    clearInterval(interval);
                    done();
                });
        }, 2000);
    }).timeout(310000);

    it("#Pause Download Content", (done) => {
        supertest(app)
            .post("/api/content/v1/download/pause/KP_FT_1564394134764")
            .send({})
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.content.pause.download").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.have.property("downloadId");
                done();
            });
    }).timeout(100000);

    it("#Pause Download Content (ERROR)", (done) => {
        supertest(app)
            .post("/api/content/v1/download/pause/KP_FT_1564394134")
            .send({})
            .expect(400)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("CLIENT_ERROR");
                expect(res.body.id).to.equal("api.content.pause.download").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.params.errmsg).to.equal("Download Document not found with id KP_FT_1564394134").to.be.a("string");
                expect(res.body.params.err).to.equal("DOC_NOT_FOUND").to.be.a("string");
                done();
            });
    }).timeout(100000);

    it("#Resume Download Content", (done) => {
        supertest(app)
            .post("/api/content/v1/download/resume/KP_FT_1564394134764")
            .send({})
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.content.resume.download").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.have.property("downloadId");
                done();
            });
    }).timeout(100000);

    it("#Resume Download Content (ERROR)", (done) => {
        supertest(app)
            .post("/api/content/v1/download/resume/KP_FT_1564394134")
            .send({})
            .expect(400)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("CLIENT_ERROR");
                expect(res.body.id).to.equal("api.content.resume.download").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.params.errmsg).to.equal("Download Document not found with id KP_FT_1564394134").to.be.a("string");
                expect(res.body.params.err).to.equal("DOC_NOT_FOUND").to.be.a("string");
                done();
            });
    }).timeout(100000);

    it("#Cancel Download Content", (done) => {
        supertest(app)
            .post("/api/content/v1/download/cancel/KP_FT_1564394134764")
            .send({})
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.content.cancel.download").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.have.property("downloadId");
                done();
            });
    }).timeout(100000);

    it("#Cancel Download Content (ERROR)", (done) => {
        supertest(app)
            .post("/api/content/v1/download/cancel/KP_FT_1564394134")
            .send({})
            .expect(400)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("CLIENT_ERROR");
                expect(res.body.id).to.equal("api.content.cancel.download").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.params.errmsg).to.equal("Download Document not found with id KP_FT_1564394134").to.be.a("string");
                expect(res.body.params.err).to.equal("DOC_NOT_FOUND").to.be.a("string");
                done();
            });
    }).timeout(100000);

    it("#Retry Download Content", (done) => {
        supertest(app)
            .post("/api/content/v1/download/retry/KP_FT_1564394134764")
            .send({})
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.content.retry.download").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result).to.have.property("downloadId");
                done();
            });
    }).timeout(100000);

    it("#Retry Download Content (ERROR)", (done) => {
        supertest(app)
            .post("/api/content/v1/download/retry/KP_FT_1564394134")
            .send({})
            .expect(400)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.responseCode).to.equal("CLIENT_ERROR");
                expect(res.body.id).to.equal("api.content.retry.download").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.params.errmsg).to.equal("Download Document not found with id KP_FT_1564394134").to.be.a("string");
                expect(res.body.params.err).to.equal("DOC_NOT_FOUND").to.be.a("string");
                done();
            });
    }).timeout(100000);
});
describe("Export content / collection", () => {
    const fs = require("fs");
    const dir = `${__dirname}/test_data/export_contents`;
    if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    }
    const filePath = `${__dirname}/test_data/export_contents`;
    xit("#Export Content", (done) => {
        supertest(app)
            .get("/api/content/v1/export/do_112832394979106816112")
            .set("Accept", "application/json")
            .query({destFolder: filePath})
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) {  return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.content.export").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.response).to.have.property("ecarFilePath");
                expect(res.body.result.response.ecarFilePath).to.contain(filePath);
                done();
            });
    }).timeout(1000);

    xit("#Export Collection", (done) => {
        supertest(app)
            .get("/api/content/v1/export/do_11275905761520025614")
            .query({destFolder: filePath})
            .set("Accept", "application/json")
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) {  return done(); }
                expect(res.body.responseCode).to.equal("OK");
                expect(res.body.id).to.equal("api.content.export").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.response).to.have.property("ecarFilePath");
                expect(res.body.result.response.ecarFilePath).to.contain(filePath);
                done();
            });
    }).timeout(1000);
});

describe("Delete content / collection", () => {

    it("#Import Collections ", (done) => {
        const filePath = [`${__dirname}/test_data/to_import_contents/TextBookTest.ecar`];
        const req = supertest(app).post("/api/content/v1/import");
        req.send(filePath);
        req.expect(200);
        req.end((err, res) => {
            expect(res.body.id).to.equal("api.content.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.result.importedJobIds).to.be.an("array");
            expect(res.body.result).to.have.property("importedJobIds");
            done();
        });
    }).timeout(2000);

    it("#Import Content List", (done) => {
        const interval = setInterval(() => {
            supertest(app)
                .post("/api/content/v1/download/list")
                .send({})
                .expect(200)
                .end((err, res) => {
                        expect(res.body.result.response.contents).to.be.an("array");
                        expect(res.body.result.response.contents[0]).to.have.property("status");
                        expect(res.body.result.response.contents[0]).to.have.property("downloadedSize");
                        clearInterval(interval);
                        done();
                });
        }, 2000);
    }).timeout(210000);

    xit(`#Delete collection`, (done) => {
        supertest(app)
        .post("/api/content/v1/delete")
        .send({request: {contents: ["do_11275905761520025614"]}})
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200)
        .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) {  return done(); }
                expect(res.body.id).to.equal("api.content.delete");
                expect(res.body.result.deleted).to.contain("do_11275905761520025614").to.be.an("array");
                expect(res.body.result.failed).to.be.an("array");
                done();
            });
    });

    xit(`#Delete content`, (done) => {
        supertest(app)
        .post("/api/content/v1/delete")
        .send({request: {contents: ["do_112832394979106816112"]}})
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200)
        .end((err, res) => {
                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) {  return done(); }
                expect(res.body.id).to.equal("api.content.delete");
                expect(res.body.result.deleted).to.contain("do_112832394979106816112").to.be.an("array");
                expect(res.body.result.failed).to.be.an("array");
                done();
            });
    });

    it(`#Delete content (ERROR)`, (done) => {
        supertest(app)
        .post("/api/content/v1/delete")
        .send()
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200)
        .end((err, res) => {
            expect(res.body.id).to.equal("api.content.delete");
            expect(res.body.params.errmsg).to.equal("MISSING_CONTENTS");
            expect(res.body.result).not.to.have.property("deleted");
            expect(res.body.result).not.to.have.property("failed");
            done();
        });
    });
});

describe('Telemetry Info', () => {

    it("#add get telemetry info", (done) => {
        supertest(app)
            .get("/api/telemetry/v1/info")
            .expect(200)
            .end((err, res) => {

                if (res.statusCode >= 500) { logger.error(err); return done(); }
                if (err && res.statusCode >= 400) { return done(); }
                expect(res.body.id).to.equal("api.telemetry.info").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.response).to.haveOwnProperty("totalSize").and.to.be.a("number");
                expect(res.body.result.response).to.haveOwnProperty("lastExportedOn");
                done();

            });
    });

    it("#export telemetry", (done) => {
        supertest(app)
            .post("/api/telemetry/v1/export")
            .send({})
            .expect(500)
            .end((err, res) => {
                expect(res.body.id).to.equal("api.telemetry.export").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.params.errmsg).to.equal("Destination path is missing");
                done();
            });
    });

    it("#Import telemetry file  ", (done) => {
        const filePath = [`${__dirname}/test_data/to_import_telemetry/telemetryimport1.zip`];
        const req = supertest(app)
        .post("/api/telemetry/v1/import");
        req.send(filePath);
        req.expect(200);
        req.end((err, res) => {
            telemetryImportId = res.body.result.importedJobIds[0];
            expect(res.body.id).to.equal("api.telemetry.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.result.importedJobIds).to.be.an("array");
            expect(res.body.result).to.have.property("importedJobIds");
            done();
        });
    });

    it("#import  telemetry retry and error case ", (done) => {
        const req = supertest(app)
        .post(`/api/telemetry/v1/import/retry/${telemetryImportId}`);
        req.send({});
        req.expect(500);
        req.end((err, res) => {
            expect(res.body.id).to.equal("api.telemetry.import.retry").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.params.status).to.be.a("string");
            expect(res.body.params.status).to.equal("failed");
            expect(res.body.result).to.be.an("object");
            done();
        });
    });

    it("#Import invalid telemetry file  ", (done) => {
        const filePath = [`${__dirname}/test_data/to_import_telemetry/telemetryimportManifestMissing.zip`];
        const req = supertest(app)
        .post("/api/telemetry/v1/import");
        req.send(filePath);
        req.expect(200);
        req.end((err, res) => {
            telemetryImportId = res.body.result.importedJobIds[0];
            expect(res.body.id).to.equal("api.telemetry.import").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.result.importedJobIds).to.be.an("array");
            expect(res.body.result).to.have.property("importedJobIds");
            done();
        });
    });

    it("#import  telemetry list", (done) => {
        const interval = setInterval(() => {
        supertest(app)
            .post("/api/telemetry/v1/list")
            .send({})
            .expect(200)
            .end((err, res) => {
                expect(res.body.id).to.equal("api.telemetry.list").to.be.a("string");
                expect(res.body.ver).to.equal("1.0").to.be.a("string");
                expect(res.body.result.response.items).to.be.an("array");
                expect(res.body.result.response.items[0]).to.have.property("id");
                done();
            });

        }, 2000);
    }).timeout(210000);

    it("#import  telemetry retry and success case ", (done) => {
        const req = supertest(app)
        .post(`/api/telemetry/v1/import/retry/${telemetryImportId}`);
        req.send({});
        req.expect(200);
        req.end((err, res) => {
            expect(res.body.id).to.equal("api.telemetry.import.retry").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.params.status).to.be.a("string");
            expect(res.body.params.status).to.equal("successful");
            expect(res.body.result).to.be.an("object");
            done();
        });
    });

    it("#telemetry set config success ", (done) => {
        const req = supertest(app)
            .post("/api/telemetry/v1/config");
        req.send({ request: { enable: true } });
        req.expect(200);
        req.end((err, res) => {
            expect(res.body.id).to.equal("api.telemetry.set.config").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.params.status).to.be.a("string");
            expect(res.body.params.status).to.equal("successful");
            expect(res.body.result).to.be.an("object");
            done();
        });
    });

    it("#telemetry set config error ", (done) => {
        const req = supertest(app)
            .post("/api/telemetry/v1/config");
        req.send({});
        req.expect(400);
        req.end((err, res) => {
            expect(res.body.id).to.equal("api.telemetry.set.config").to.be.a("string");
            expect(res.body.ver).to.equal("1.0").to.be.a("string");
            expect(res.body.params.status).to.be.a("string");
            expect(res.body.params.status).to.equal("failed");
            expect(res.body.result).to.be.an("object");
            done();
        });
    });
});

after("Disconnect Server", (done) => {
    server.close();
    done();
});
