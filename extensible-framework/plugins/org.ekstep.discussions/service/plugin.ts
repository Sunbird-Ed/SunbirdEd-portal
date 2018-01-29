import { FrameworkAPI } from '../../../src/framework/frameworkAPI'
const Plugin = FrameworkAPI.getDecorator('Plugin')
const Inject = FrameworkAPI.getDecorator('Inject')
const PluginLifeCycleEvents = FrameworkAPI.getInterface('PluginLifeCycleEvents')

@Plugin({
	"name": "Discussions",
	"id": "org.ekstep.discussions",
	"version": "1.0"
})
export class ExtPlugin implements PluginLifeCycleEvents {

	//inject services from container
	@Inject('ElasticsearchStore')
	private elStore: any;

	@Inject('CassandraStore')
	private cassandraStore: any;

	onStart() {

	}

	onInstall() {
		console.log('Discussions plugin is installed!')
	}

	onStop() {

	}
}
