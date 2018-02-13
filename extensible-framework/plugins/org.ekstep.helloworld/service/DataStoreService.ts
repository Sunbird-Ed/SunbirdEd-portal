import {FrameworkAPI} from '../../../src/framework/frameworkAPI'

export default class DataStoreService {
    public static elasticStore;
    public static cassandraStore;

    static getCassandraStore() {
        return this.cassandraStore;
    }

    static setCassandraStore(sessionObject) {
        this.cassandraStore = sessionObject;
    }

    static getElasticsearchStore() {
        return this.elasticStore;
    }

    static setElasticsearchStore(sessionObject) {
        this.elasticStore = sessionObject
    }
}