import {FrameworkAPI} from '../../../src/framework/frameworkAPI'

const Plugin = FrameworkAPI.getDecorator('Plugin');
const Inject = FrameworkAPI.getDecorator('inject');
const PluginLifeCycleEvents = FrameworkAPI.getInterface('PluginLifeCycleEvents');

@Plugin({	
	"name": "Hello world",
	"id": "org.ekstep.helloworld",
	"version": "1.0",
})
export class ExtPlugin implements PluginLifeCycleEvents {

	//inject services from container
	@Inject('ElasticsearchStore') 
	private indexStore: any;
	
	@Inject('CassandraStore') 
	private cassandraStore: any;
	
	onStart() {
		let indexStoreSession = this.indexStore.getConnection('org.ekstep.helloworld');
		indexStoreSession.deleteOne({ type: 'tweet', id: 2 }, (err: any, res: any) => {
			console.log(err, res)
		})

		let cassandraStoreSession = this.cassandraStore.getConnection('org.ekstep.helloworld')
		//cassandraStoreSession.findOne()		
	}

	onInstall() {
		console.log('Hello world plugin is installed!')
	}
}