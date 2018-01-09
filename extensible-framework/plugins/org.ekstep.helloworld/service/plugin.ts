//TODO: inject services and interfaces from factory service
import {Plugin} from '../../../src/framework/CoreDecorator'
import { PluginLifeCycleEvents } from '../../../src/framework/interfaces/PluginLifeCycleEventsInterface'
import {CassandraStore} from '../../../src/framework/services/cassandra/CassandraStore'
import {ElasticsearchStore} from '../../../src/framework/services/elasticsearch/ElasticsearchStore'


@Plugin({	
	"name": "Hello world",
	"type": "plugin",
	"description": "sample plugin",
	"id": "org.ekstep.helloworld",
	"version": "1.0",
	"author": "Sunil<sunils@ilimi.in>"
})
export class ExtPlugin implements PluginLifeCycleEvents {

	onStart() {
		let indexStore = ElasticsearchStore.getConnection('org.ekstep.helloworld');
		// indexStore.insertOne({
		// 	type: 'tweet',
		// 	id: 2,
		// 	body: {
		// 		title: 'second tweet',
  //   			tags: ['#secondTweet']
		// 	}
		// }, (err, res) => {
		// 		console.log(err, res)
		// 	});
		//let storeSession = CassandraStore.getConnection('org.ekstep.helloworld');
		// storeSession.insert({
		// 	tableName: 'cyclist_name',
		// 	data: [
		// 		{id: storeSession.utils().getType('UUID'), firstname:'manju', lastname: 'davanam'},
		// 		{id: storeSession.utils().getType('UUID'), firstname:'anil'	, lastname: 's'},
		// 		{id: storeSession.utils().getType('UUID'), firstname:'virat', lastname: 'kohli'}
		// 	],
		// 	callback: function(err: object, res: object) {
		// 		console.log('data inserted', err, res)

		// 	}
		// });

		// storeSession.update({
		// 	tableName: "cyclist_name",
		// 	value: {firstname: 'bakasur'}
		// 	where: { id: storeSession.utils().getUUIDfromString("6f357b96-66f9-476a-a435-d5c2c13a07fc")}
		// 	callback: function(err) {
		// 		console.log(err)
		// 	}
		// })

		// storeSession.findOne({
		// 	tableName: 'cyclist_name',
		// 	where: { firstname: 'john1234'},
		// 	callback: (err: object, res: object) => {
		// 		console.log(`one record found ${res}`)
		// 	}
		// })
		
	}

	onInstall() {
		console.log('Hello world plugin is installed!')
	}
}