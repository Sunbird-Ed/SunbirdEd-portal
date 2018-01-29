import  {Plugin, Injector, Inject} from './src/framework/CoreDecorator'
import {pluginManager} from './src/framework/PluginManager'
import {CassandraConfig} from './src/framework/services/cassandra/CassandraConfig'
import {ElasticsearchConfig} from './src/framework/services/elasticsearch/ElasticsearchConfig'
import {CassandraStore} from './src/framework/services/cassandra/CassandraStore'
import {ElasticsearchStore} from './src/framework/services/elasticsearch/ElasticsearchStore'
import * as FrameworkConfig from './src/framework/config.json'
import { PluginLifeCycleEvents } from './src/framework/interfaces/PluginLifeCycleEventsInterface'
import {expressApp} from './src/MiddlewareApp';
import {routerRegistry} from './src/framework/RouterRegistry'

class BootstrapFramework {
	private static config: object;

	public static initialize(config: FrameworkConfig) {
		this.config = config;
		this.injectGlobalService();
		this.configureServices();
		pluginManager.installPlugin(config.plugins);
		this.startNodeApp(config.nodeApp.port)
	}

	public static injectGlobalService() {
		global["ext_framework"] = global["ext_framework"] || {};

		// Plugin decorator
		global["ext_framework"].decorator = { Plugin, Injector, Inject }

		//Register framework services with container
		global["ext_framework"].decorator.Injector.register('ElasticsearchStore', ElasticsearchStore)
		global["ext_framework"].decorator.Injector.register('CassandraStore', CassandraStore)
		global["ext_framework"].decorator.Injector.register('RouterRegistry', routerRegistry)

		// Interface for plugin
		global["ext_framework"].interface = global["ext_framework"].interface || {};
		global["ext_framework"].interface.PluginLifeCycleEvents = PluginLifeCycleEvents
	}

	public static configureServices() {
		CassandraConfig.set({
			contactPoint: this.config.cassandra.contactPoint,
			port: this.config.cassandra.port
		})

		ElasticsearchConfig.set({
			host: this.config.elasticsearch.host
		})		
	}

	public static startNodeApp(port: number = 8000) {
		expressApp.listen(port);
	}
}

BootstrapFramework.initialize(FrameworkConfig);


 






