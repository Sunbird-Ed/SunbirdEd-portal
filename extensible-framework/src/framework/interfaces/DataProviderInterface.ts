export interface DataProviderInterface {
	connect: (...args: any[]) => any;
	insert: (...args: any[]) => any;
	insertOne?: (...args: any[]) => any;
	find: (...args: any[]) => any;
	findOne?: (...args: any[]) => any;
	update: (...args: any[]) => any;
	delete: (...args: any[]) => any;
}