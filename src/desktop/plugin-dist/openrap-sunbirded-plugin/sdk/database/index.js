var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 */
const api_1 = require("@project-sunbird/ext-framework-server/api");
const logger_1 = require("@project-sunbird/logger");
const _ = require("lodash");
/**
* This SDK helps in performing operations with database and to create them
*
*/
class DatabaseSDK {
    initialize(pluginId, url) {
        this.pluginId = pluginId;
        this.url = url;
    }
    get(database, Id) {
        logger_1.logger.debug(`Getting the document: ${Id} in Database: ${_.upperCase(database)}`);
        let db = api_1.frameworkAPI.getPouchDBInstance(this.pluginId, database);
        return db.get(Id);
    }
    insert(database, doc, Id) {
        logger_1.logger.info(`Inserting document:${Id} in database: ${_.upperCase(database)}`);
        let db = api_1.frameworkAPI.getPouchDBInstance(this.pluginId, database);
        if (Id) {
            doc._id = Id;
            return db.put(doc);
        }
        return db.post(doc);
    }
    update(database, docId, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.debug(`Updating document with docId: ${docId} in database: ${_.upperCase(database)}`);
            let db = api_1.frameworkAPI.getPouchDBInstance(this.pluginId, database);
            let docResponse = yield db.get(docId);
            let result = yield db.put(Object.assign({}, docResponse, doc));
            return result;
        });
    }
    delete(database, docId) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = api_1.frameworkAPI.getPouchDBInstance(this.pluginId, database);
            let doc = yield db.get(docId);
            let result = yield db.remove(doc._id, doc._rev);
            return result;
        });
    }
    find(database, searchObj) {
        logger_1.logger.debug(`Finding document in database: ${_.upperCase(database)}`);
        let db = api_1.frameworkAPI.getPouchDBInstance(this.pluginId, database);
        return db.find(searchObj);
    }
    bulk(database, documents) {
        logger_1.logger.debug(`adding bulk documents to database: ${_.upperCase(database)}`);
        let db = api_1.frameworkAPI.getPouchDBInstance(this.pluginId, database);
        return db.bulkDocs(documents);
    }
    list(database, options) {
        let db = api_1.frameworkAPI.getPouchDBInstance(this.pluginId, database);
        return db.allDocs(options);
    }
    explain(database, options) {
        let db = api_1.frameworkAPI.getPouchDBInstance(this.pluginId, database);
        return db.explain(options);
    }
    upsert(database, docId, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.debug(`Upserting document with docId:${docId} in database: "${_.upperCase(database)}" `);
            let db = api_1.frameworkAPI.getPouchDBInstance(this.pluginId, database);
            let docNotFound = false;
            let docResponse = yield db.get(docId).catch(err => {
                logger_1.logger.error(`Received error while getting doc from DB: ${_.upperCase(database)} and Error:${err}`);
                if (err.status === 404) {
                    docNotFound = true;
                }
                else {
                    // if error is not doc not found then throwing error 
                    throw Error(err);
                }
            });
            let result;
            if (docNotFound) {
                logger_1.logger.info(` Doc: ${docId}  NOT found in DB:${_.upperCase(database)}`);
                doc._id = docId;
                result = yield db.put(doc);
            }
            else {
                result = yield db.put(Object.assign({}, docResponse, doc));
            }
            return result;
        });
    }
}
exports.default = DatabaseSDK;
