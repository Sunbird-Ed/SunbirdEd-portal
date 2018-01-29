import * as elasticsearch from 'elasticsearch'

interface ElasticsearchConfigInterface {
	host: string;
	log?: string;
}

export class ElasticsearchConfig {

	private static config: ElasticsearchConfigInterface = {
		host: "",
		log: ""
	}

	public static set(config: ElasticsearchConfigInterface): void {
		this.config.host = config.host
  		this.config.log = config.log
	}

	public static get(): object {
		return this.config
	}
}