import  {Plugin, Injector, Inject} from './CoreDecorator'
import {pluginManager} from './managers/PluginManager'
import {CassandraConfig} from './database/cassandra/CassandraConfig'
import {ElasticsearchConfig} from './database/elasticsearch/ElasticsearchConfig'
import {CassandraStore} from './database/cassandra/CassandraStore'
import {ElasticsearchStore} from './database/elasticsearch/ElasticsearchStore'
import * as FrameworkConfig from './config/index.json'

import {expressApp} from '../MiddlewareApp';
import {routerRegistry as RouterRegistry} from './managers/RouterRegistry'
import {TokenAuthenticator} from './services/requestAuthenticator'

export default class BootstrapFramework {
	private static config: object;
	
	public static initialize(config: FrameworkConfig) {
		this.config = config;
		this.injectGlobalService();
		this.configureServices();
		pluginManager.installPlugin(config.plugins);
		this.startNodeApp(config.nodeApp.port)
	}

	public static injectGlobalService() {
		const globalObject = global["ext_framework"] = global["ext_framework"] || 
		{ 
			services: {
				CassandraStore,
				ElasticsearchStore,
				TokenAuthenticator,
				RouterRegistry
			}, 
			decorator: { Plugin, Injector, Inject }
		};

		//Register framework services with container
		globalObject.decorator.Injector.register('Elasticsearch', ElasticsearchStore)
		globalObject.decorator.Injector.register('Cassandra', CassandraStore)
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