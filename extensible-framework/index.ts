import {pluginManager} from './src/framework/PluginManager'
import {CassandraConfig} from './src/framework/services/cassandra/CassandraConfig'
import {ElasticsearchConfig} from './src/framework/services/elasticsearch/ElasticsearchConfig'

CassandraConfig.set({
	contactPoint: '127.0.0.1',
	port: 9042
})

ElasticsearchConfig.set({
	host: 'localhost:9200'
}) 

let plugin = {
	id: "org.ekstep.helloworld", 
	ver: "1.0", 
	scope: "service"
}

pluginManager.installPlugin(plugin);
pluginManager.activatePlugin(plugin);



