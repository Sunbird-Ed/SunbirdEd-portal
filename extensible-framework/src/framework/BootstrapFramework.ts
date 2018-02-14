import {Plugin, Injector, Inject, expressApp}
	 from './index';

import {RouterRegistry, pluginManager, pluginRegistry} from './managers';
import {ElasticsearchStore,ElasticsearchConfig,CassandraStore,CassandraConfig } from './database'
import {TokenAuthenticator} from './services';
import {frameworkConfig} from './config';

export default class BootstrapFramework {
	private static config: object;
	
	public static initialize(config: frameworkConfig) {
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