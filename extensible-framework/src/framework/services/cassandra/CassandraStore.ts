import * as expressCassandra from 'express-cassandra'
import * as _ from 'lodash';
import {cassandraStoreValidator} from './CassandraStoreValidator'
import {CassandraConfig} from './CassandraConfig'
import {DataProviderInterface} from '../DataProviderInterface'

//import { injectable, inject } from "inversify";


//@injectable()
export class CassandraStore implements DataProviderInterface {

	private pluginId: string;
	private keyspaceName: string;
	private sessionObject: object;

	constructor(config: { pluginId: string}) {
		this.pluginId = config.pluginId;
		// keeping keyspace name same as plugin ID
		// cassandra keyspace name doesnot allow '.'
		this.keyspaceName = config.pluginId.split('.').join('');;
	}

	public connect(): object {
		return this.sessionObject;
	}

	//TODO: authentication layer can be added when getConnection
	public static getConnection(pluginId: string) {
		let newConnection = new CassandraStore({ pluginId });
		newConnection.sessionObject = expressCassandra.createClient(CassandraConfig.get({ keyspace: newConnection.keyspaceName }));
		return newConnection;
	}

	public insertOne(query: { tableName: string, data: object }, callback = (...args: any[]) => {}): void {
		this.insert({tableName: query.tableName, data: [query.data]}, callback);
	}

	//Bulk insert
	public insert(query: { tableName: string, data: object[] }, callback = (...args: any[]) => {}) {
		let queries: any[] = []

		try {
			let model: any = this.sessionObject.loadSchema(query.tableName, cassandraStoreValidator.getModelSchema(this.pluginId, query.tableName))
			_.forEach(query.data, (data) => {
				let insertQuery = new model(data)
				let saveQuery = insertQuery.save({ return_query: true })
				queries.push(saveQuery)
			})
			this.sessionObject.doBatch(queries, callback);
		} catch(e) {
			console.log(e)
			callback(new Error(`${query.tableName}: table doesnot exist`))	
		}
	}

	public findOne(query: {tableName: string, where: object }, callback = (...args: any[]) => {}): object {
		
		try {
			var model: any = this.sessionObject.loadSchema(query.tableName, cassandraStoreValidator.getModelSchema(this.pluginId, query.tableName))
			model.findOne(query.where, {raw:true, allow_filtering: true}, callback)
		} catch(e) {
			console.log(e)
			callback(new Error(`${query.tableName}: unable find record!`))	
		}
	}


	public find(query: {tableName: string, where: object }, callback = (...args: any[]) => {}): object {
		
		try {
			var model: any = this.sessionObject.loadSchema(query.tableName, cassandraStoreValidator.getModelSchema(this.pluginId, query.tableName))
			model.find(query.where, {raw:true, allow_filtering: true}, callback)
		} catch(e) {
			console.log(e)
			callback(new Error(`${query.tableName}: unable find record!`))	
		}
	}

	

	public update(query: { tableName: string, value: object, where: object}, callback = (...args: any[]) => {}) {
		try {
			var model: any = this.sessionObject.loadSchema(query.tableName, cassandraStoreValidator.getModelSchema(this.pluginId, query.tableName))
			model.update(query.where, query.value, {}, callback)
		} catch(e) {
			console.log(e)
			callback(new Error(`${query.tableName}: unable update record!`))	
		}
	}

	public delete(query: { tableName: string, where: object }, callback = (...args: any[]) => {}) {
		try {
			var model: any = this.sessionObject.loadSchema(query.tableName, cassandraStoreValidator.getModelSchema(this.pluginId, query.tableName))
			model.delete(query.where, callback)
		} catch(e) {
			console.log(e)
			callback(new Error(`${query.tableName}: unable delete record!`))	
		}
	}

	private getType(type: string): any {
		//TODO: add more cassandra db function types
		let types: {[index:string]: any} = {
			'UUID': {"$db_function": "uuid()"},
			'TIME_STAMP_NOW': { $db_function: 'toTimestamp(now())' }
		}

		return types[type]
	}

	public utils() {
		//TODO: add more cassandra handy functions
		return 	{
			getUUIDfromString: (str: string) => {
				return this.sessionObject.uuidFromString(str)
			},
			getType: (type: string) => {
				this.getType(type)
			}
		}
	}
}
