import * as elasticsearch from 'elasticsearch'
import {ElasticsearchConfig} from './ElasticsearchConfig'
import {DataProviderInterface} from '../../interfaces/DataProviderInterface'
import * as _ from 'lodash';

interface ESMetadataInterface {
	_id: string;
	_type: string;
	_index: string;
}

export class ElasticsearchStore implements DataProviderInterface {

	private pluginId: string;
	private indexName: string;
	private sessionObject: object;

	constructor(config: { pluginId: string}) {
		this.pluginId = config.pluginId;
		//keeping index name same as pluginId
		this.indexName = config.pluginId.split('.').join('-');
	}

	public connect(): object {
		return this.sessionObject;
	}

	//TODO: authentication layer can be added when getConnection
	public static getConnection(pluginId: string) {
		let newConnection = new ElasticsearchStore({ pluginId });
		newConnection.sessionObject = elasticsearch.Client(ElasticsearchConfig.get());
		return newConnection;
	}

	//Adds a typed JSON document in a specific index, making it searchable. 
	//If a document with the same index, type, and id already exists, an error will occur.
	public create(query: { type: string, id?: number, body: object }, callback = (...args: any[]) => {}) {
		this.sessionObject.create({
			index: this.indexName,
			type: query.type,
			id: query.id,
			body: query.body
		}, callback)
	}

	//Stores a typed JSON document in an index, making it searchable. 
	//When the id param is not set, a unique id will be auto-generated. When you specify an id either a new document 
	//will be created, or an existing document will be updated.
	public insertOne(query: { type: string, id?: number, body: object }, callback = (...args: any[]) => {}) {
		this.insert([query], callback)
	}

	//Bulk insert
	public insert(query: { type: string, id?: number, body: object}[], callback = (...args: any[]) => {} ) {
		let bulkQuery: any[] = [];

		_.forEach(query, (q) => {
			let metadata = {_id: q.id, _type: q.type, _index: this.indexName }
			bulkQuery.push({ action: 'index', metadata: metadata, body: q.body })
		})
		
		this.doBulkOperation(bulkQuery, callback)
	}

	private doBulkOperation(query: {action: string, metadata: ESMetadataInterface, body?: object}[], callback = (...args: any[]) => {}): void {
		let bulkObject: object[] = [];

		_.forEach(query, (doc) => {
			bulkObject.push({ [doc.action]: doc.metadata })
			if (doc.body) bulkObject.push(doc.body)
		})

		this.sessionObject.bulk({ body: bulkObject }, callback)
	}

	public findOne() {
		
	}


	public find() {
		
	}

	

	public update() {
		
	}

	public delete() {
		
	}
}
