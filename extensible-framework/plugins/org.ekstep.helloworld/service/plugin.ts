import { CassandraStore } from '../../../src/framework/services/cassandra/CassandraStore';
//import { CassandraStore } from '../../../src/framework/services/cassandra/CassandraStore';
import { FrameworkAPI } from '../../../src/framework/frameworkAPI'
import DataStoreService from './DataStoreService';

const { Plugin, Inject, DataStore } = FrameworkAPI.getDecorators(['Plugin', 'Inject', 'DataStore']);
const PluginLifeCycleEvents = FrameworkAPI.getInterface('PluginLifeCycleEvents');

@Plugin({	
	"name": "Hello world",
	"id": "org.ekstep.helloworld",
	"version": "1.0"
})
export class ExtPlugin implements PluginLifeCycleEvents {
	
	private indexStore: any;

	private cassandraStore: any;

	constructor() {
		// plugin should get cassandra store and elasticsearch store connection
		// during plugin intialization; and store it in its own service to get access to it later.
		this.cassandraStore = FrameworkAPI.getCassandraStoreInstance(this);
		this.indexStore = FrameworkAPI.getElasticsearchStoreInstance(this);
		DataStoreService.setCassandraStore(this.cassandraStore);
		DataStoreService.setElasticsearchStore(this.indexStore);
	}
	
	onInstall() {
		console.log('Hello world plugin is installed!')
		//let cassandraStoreSession = this.cassandraStore.getConnection('org.ekstep.helloworld')
		//let indexStoreSession = this.indexStore.getConnection('org.ekstep.helloworld');
		// cassandraStoreSession.findOne({tableName: "cyclist_name", where: { firstname: "sunil"}}, (err, res)=> {
		// 	console.log(err, res);
		// })
		this.indexStore.find({ 
			DSL: this.indexStore
			.utils()
			.getBodybuilder()
			.query('match', 'body.title', 'first tweet')
			.build()
		}, (err, res) => {
			console.log(err, res);
		})
	}
	
	onStart() {
		//let indexStoreSession = this.indexStore.getConnection('org.ekstep.helloworld');
		// indexStoreSession.deleteOne({ type: 'tweet', id: 2 }, (err: any, res: any) => {
		// 	console.log(err, res)
		// })
		//console.log('Hello world plugin is installed!')
		//let cassandraStoreSession = this.cassandraStore.getConnection('org.ekstep.helloworld')
		//let indexStoreSession = this.indexStore.getConnection('org.ekstep.helloworld');
		// cassandraStoreSession.findOne({tableName: "cyclist_name", where: { firstname: "sunil"}}, (err, res)=> {
		// 	console.log(err, res);
		// })
		// this.indexStore.find({ 
		// 	DSL: this.indexStore
		// 	.utils()
		// 	.getBodybuilder()
		// 	.query('match', 'body.title', 'first tweet')
		// 	.build()
		// }, (err, res) => {
		// 	console.log(err, res);
		// })
	}

	onStop() {

	}
}