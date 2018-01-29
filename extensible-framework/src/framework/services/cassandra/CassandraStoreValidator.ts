import * as _ from 'lodash';

class CassandraStoreValidator {

	private modelMap: {[index:string]: object[]} = {};
	private static instance: CassandraStoreValidator

	constructor() {

	}

	//TODO: validate schema.json for cassandra

	public validateSchema() {
		
	}

	public validateQuery() {

	}

	public registerSchema(pluginId: string, schema: object) {
		this.modelMap[pluginId] = schema.entities;
	}

	public getModelSchema(pluginId: string, modelName: string): object | undefined {
		let model = _.find(this.modelMap[pluginId], (model) => {
			return model.name === modelName
		})
		return _.cloneDeep(model);
	}


	//singleton 
	static getInstance() {
        if (!CassandraStoreValidator.instance) {
            CassandraStoreValidator.instance = new CassandraStoreValidator();
        }
        return CassandraStoreValidator.instance;
    }

}

export const cassandraStoreValidator = CassandraStoreValidator.getInstance()