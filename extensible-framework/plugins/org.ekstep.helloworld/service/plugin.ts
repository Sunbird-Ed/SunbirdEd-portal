import {FrameworkAPI} from '../../../src/framework/frameworkAPI'

const Plugin = FrameworkAPI.getDecorator('Plugin');
const Inject = FrameworkAPI.getDecorator('Inject');
const PluginLifeCycleEvents = FrameworkAPI.getInterface('PluginLifeCycleEvents');

@Plugin({	
	"name": "Hello world",
	"id": "org.ekstep.helloworld",
	"version": "1.0"
})
export class ExtPlugin implements PluginLifeCycleEvents {

	//inject services from container
	@Inject('ElasticsearchStore') 
	private indexStore: any;

	@Inject('CassandraStore') 
	private cassandraStore: any;

	onInstall() {
	}
	
	onStart() {
		let indexStoreSession = this.indexStore.getConnection('org.ekstep.helloworld');
		// indexStoreSession.deleteOne({ type: 'tweet', id: 2 }, (err: any, res: any) => {
		// 	console.log(err, res)
		// })
		console.log('Hello world plugin is installed!')
		let cassandraStoreSession = this.cassandraStore.getConnection('org.ekstep.helloworld')
		//let indexStoreSession = this.indexStore.getConnection('org.ekstep.helloworld');
		// cassandraStoreSession.findOne({tableName: "cyclist_name", where: { firstname: "sunil"}}, (err, res)=> {
		// 	console.log(err, res);
		// })
		indexStoreSession.find({ 
			DSL: indexStoreSession
			.utils()
			.getBodybuilder()
			.query('match', 'body.title', 'first tweet')
			.build()
		}, (err, res) => {
			console.log(err, res);
		})
	}

	onStop() {

	}
}