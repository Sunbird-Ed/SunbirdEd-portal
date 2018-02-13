import * as elasticsearch from 'elasticsearch'
import {ElasticsearchConfig} from './ElasticsearchConfig'
import {DataProviderInterface} from '../../interfaces/DataProviderInterface'
import * as _ from 'lodash';
import * as bodybuilder from 'bodybuilder';
			
interface DocumentInterface {
	type: string, 
	id?: number, 
	body: object
}

class ElasticsearchStore implements DataProviderInterface {

	private pluginId: string;
	private indexName: string;
	private sessionObject: object;

	constructor(config: { pluginId: string}) {
		this.pluginId = config.pluginId;
		//keeping index name same as pluginId
		this.indexName = config.pluginId.split('.').join('_');
	}

	public connect(): object {
		return this.sessionObject;
	}

	//TODO: authentication layer can be added when getConnection
	public static getConnection(pluginId: string) {
		let newConnection = new ElasticsearchStore({ pluginId });
		newConnection.sessionObject = new elasticsearch.Client(ElasticsearchConfig.get());
		return newConnection;
	}

	//Adds a typed JSON document in a specific index, making it searchable. 
	//If a document with the same index, type, and id already exists, an error will occur.
	public create(query: DocumentInterface, callback = (...args: any[]) => {}) {
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
	public insertOne(query: DocumentInterface, callback = (...args: any[]) => {}) {
		this.insert([query], callback)
	}

	//Bulk insert
	public insert(query: DocumentInterface[], callback = (...args: any[]) => {} ) {
		let bulkQuery: any[] = [];

		_.forEach(query, (q) => {
			let metadata = {_id: q.id, _type: q.type, _index: this.indexName }
			bulkQuery.push({ action: 'index', metadata: metadata, body: q.body })
		})
		
		this.doBulkOperation(bulkQuery, callback)
	}

	private doBulkOperation(query: {action: string, metadata: { _id: string, _type: string, _index: string }, body?: object}[], callback = (...args: any[]) => {}): void {
		let bulkObject: object[] = [];

		_.forEach(query, (doc) => {
			bulkObject.push({ [doc.action]: doc.metadata })
			if (doc.body) bulkObject.push(doc.body)
		})

		this.sessionObject.bulk({ body: bulkObject }, callback)
	}

	public find(query: { DSL: object}, callback = (...args: any[]) => {}) {
		console.log(query.DSL)
		this.sessionObject.search({
		  index: this.indexName,
		  body: query.DSL
		}, callback);
	}

	public update(query: DocumentInterface[], callback = (...args: any[]) => {}) {
		let bulkQuery: any[] = [];

		_.forEach(query, (q) => {
			let metadata = {_id: q.id, _type: q.type, _index: this.indexName }
			bulkQuery.push({ action: 'update', metadata: metadata, body: { doc: q.body }})
		})
		
		this.doBulkOperation(bulkQuery, callback)
	}

	public updateOne(query: DocumentInterface, callback = (...args: any[]) => {}) {
		this.update([query], callback)
	}

	public delete(query: { type: string, id?: number }[], callback = (...args: any[]) => {}) {
		let bulkQuery: any[] = [];

		_.forEach(query, (q) => {
			let metadata = {_id: q.id, _type: q.type, _index: this.indexName }
			bulkQuery.push({ action: 'delete', metadata: metadata })
		})
		
		this.doBulkOperation(bulkQuery, callback)
	}

	public deleteOne(query: { type: string, id?: number }, callback = (...args: any[]) => {}) {
		this.delete([query], callback)
	}

	public deleteByQuery(query: { DSL: object}, callback = (...args: any[]) => {}) {
		this.sessionObject.deleteByQuery({
		  index: this.indexName,
		  body: query.DSL
		}, callback);
	}

	public utils() {
		return {
			getBodybuilder: () => {
				return bodybuilder()
			}	
		}
	}
}

export {ElasticsearchStore}