import * as expressCassandra from 'express-cassandra'

export interface CassandraConfigInterface {
	contactPoint: string;
	port: number;
}

export class CassandraConfig {

	private static contactPoint: string;
	private static port: number;

	public static set(config: CassandraConfigInterface): void {
		this.contactPoint = config.contactPoint;
		this.port = config.port;
	}

	public static get(config: { keyspace: string }): object {
		return {
		    clientOptions: {
		        contactPoints: [this.contactPoint],
		        protocolOptions: { port: this.port },
		        keyspace: config.keyspace,
		        queryOptions: {consistency: expressCassandra.consistencies.one}
		    },
		    ormOptions: {
		        defaultReplicationStrategy : {
		            class: 'SimpleStrategy',
		            replication_factor: 1
		        },
		        migration: 'safe',
		    }
		}
	}
}