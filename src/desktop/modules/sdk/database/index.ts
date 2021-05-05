/**
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 */
import { logger } from '@project-sunbird/logger';
import * as _ from 'lodash';
const path = require('path');
const fs = require('fs');
const PouchDataBase = require('pouchdb');
PouchDataBase.plugin(require('pouchdb-find'));
import { Util } from '../../utils/util';
/**
* This SDK helps in performing operations with database and to create them
* 
*/
export default class DatabaseSDK {

    private pluginId: string;


    async initialize(pluginId: string) {
        this.pluginId = pluginId;
    }

    async initializeAndCreateIndex(pluginId: string) {
        this.pluginId = pluginId;
        await this.createIndex();
    }

    async createIndex() {
        try {
            const databases = JSON.parse(fs.readFileSync(path.join(__dirname, 'schema_1.0.json'),
                { encoding: 'utf8' }));
            for (const db of databases) {
                const databaseName = Util.generateId(this.pluginId, db.name);
                let dbInstance = this.getConnection(databaseName);
                if (!_.isEmpty(db['indexes'])) {
                    for (let index of db.indexes) {
                        await dbInstance.createIndex(index).catch((err) => {
                            if (err) logger.error(`While creating the index for db ${db.name} `, err)
                        });
                    }
                }
            }

        } catch (error) {
            logger.error(`while creating the indexes`, error);
        }
    }
    getConnection(database: string) {
        return new PouchDataBase(path.join(process.env.DATABASE_PATH, Util.generateId(this.pluginId, database)));
    }

    get(database: string, Id: string) {
        logger.debug(`Getting the document: ${Id} in Database: ${_.upperCase(database)}`)
        let db = this.getConnection(database);
        return db.get(Id);
    }

    insert(database: string, doc: any, Id?: string) {
        logger.info(`Inserting document:${Id} in database: ${_.upperCase(database)}`);
        let db = this.getConnection(database);
        if (Id) {
            doc._id = Id;
            return db.put(doc);
        }
        return db.post(doc);
    }

    async update(database: string, docId, doc) {
        logger.debug(`Updating document with docId: ${docId} in database: ${_.upperCase(database)}`)
        let db = this.getConnection(database);
        let docResponse = await db.get(docId);
        let result = await db.put({ ...docResponse, ...doc });
        return result;
    }

    async delete(database: string, docId) {
        let db = this.getConnection(database);
        let doc = await db.get(docId);
        let result = await db.remove(doc._id, doc._rev);
        return result;
    }

    find(database: string, searchObj: Object) {
        logger.debug(`Finding document in database: ${_.upperCase(database)}`);
        let db = this.getConnection(database);
        return db.find(searchObj);
    }

    bulk(database: string, documents: Object[]) {
        logger.debug(`adding bulk documents to database: ${_.upperCase(database)}`)
        let db = this.getConnection(database);
        return db.bulkDocs(documents);
    }

    list(database: string, options: Object) {
        let db = this.getConnection(database);
        return db.allDocs(options);
    }
    explain(database: string, options: Object) {
        let db = this.getConnection(database);
        return db.explain(options);
    }

    async upsert(database: string, docId: string, doc: any) {
        logger.debug(`Upserting document with docId:${docId} in database: "${_.upperCase(database)}" `)
        let db = this.getConnection(database);
        let docNotFound = false;
        let docResponse = await db.get(docId).catch(err => {
            logger.error(`Received error while getting doc from DB: ${_.upperCase(database)} and Error:${err}`);
            if (err.status === 404) {
                docNotFound = true;
            } else {
                // if error is not doc not found then throwing error 
                throw Error(err)
            }
        });
        let result;
        if (docNotFound) {
            logger.info(` Doc: ${docId}  NOT found in DB:${_.upperCase(database)}`)
            doc._id = docId;
            result = await db.put(doc);
        } else {
            result = await db.put({ ...docResponse, ...doc });
        }

        return result;
    }
}
