import  {Plugin, Injector, Inject, DataStore} from './CoreDecorator'
import {pluginManager} from './PluginManager'
import {CassandraConfig} from './services/cassandra/CassandraConfig'
import {ElasticsearchConfig} from './services/elasticsearch/ElasticsearchConfig'
import {CassandraStore} from './services/cassandra/CassandraStore'
import {ElasticsearchStore} from './services/elasticsearch/ElasticsearchStore'
import * as FrameworkConfig from './config.json'

import {expressApp} from '../MiddlewareApp';
import {routerRegistry as RouterRegistry} from './RouterRegistry'
import {TokenAuthenticator} from './requestAuthenticator'

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