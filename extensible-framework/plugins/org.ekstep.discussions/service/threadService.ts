import { FrameworkAPI } from '../../../src/framework/frameworkAPI'
const Inject = FrameworkAPI.getDecorator('Inject')
import { replyService } from './replyService'
import { _ } from "lodash";
class ThreadService {
	@Inject('CassandraStore')
	private cassandraStore: any;
	private cassandraStoreSession: any = this.cassandraStore.getConnection('org.ekstep.discussions')

	@Inject('ElasticsearchStore')
	private elasticSearchStore: any;
	private elasticSearchStoreSession: any = this.elasticSearchStore.getConnection('org.ekstep.discussions')

	private tableName: String = "threads"


	public extractThreadData(esData) {
		console.log(esData)
		let hitsData = esData.hits
		let threadData = { count: hitsData.total, threads: [] }
		if (threadData.count > 0) {
			_.forEach(hitsData.hits, (thread: object) => {
				threadData.threads.push({
					identifier: thread._source.identifier,
					subject: thread._source.subject,
					objectType: thread._source.object_type,
					objectId: thread._source.object_id,
					body: thread._source.body,
					userId: thread._source.user_id
				})
			})
		}
		return threadData
	}

	public getThreads(req, res, next) {
		this.elasticSearchStoreSession.find({ query: { type: { value: this.tableName } } }, (err: any, resp: any) => {
			if (err) {
				console.log(err)
				res.send({ status: 'fail', message: 'Error occured.Please try again.', error: err })
			} else {
				console.log(resp)
				res.send({ status: 'success', response: this.extractThreadData(resp) })
			}
		})
	}

	public getThreadById(req, res, next) {
		let threadId = req.params.threadId
		let query = {
			"query": {
				"bool": {
					"must": {
						"match": {
							"identifier": threadId
						}
					}
				}
			}
		}
		console.log(query)

		this.elasticSearchStoreSession.find({ DSL: query }, (err: any, resp: any) => {
			if (err) {
				console.log(err)
				res.send({ status: 'fail', message: 'Error occured.Please try again.', error: err })
			} else {
				replyService.getRepliesByThreadId(threadId, (err: any, replies: any) => {
					if (err) {
						console.log(err)
						res.send({ status: 'fail', message: 'Error occured in getting replies.Please try again.', error: err })
					}
					else {
						let threadData = this.extractThreadData(resp)
						res.send({ status: 'success', thread: threadData.threads[0], replies: replies })
					}
				})
			}
		})
	}
	public getCreatedThread(query, cb) {
		this.cassandraStoreSession.findOne({ tableName: this.tableName, where: query }, (err: any, resp: any) => {
			if (err) {
				cb(err, null)
			} else {
				cb(null, resp)
			}
		})

	}
	public createThread(req, res, next) {
		let requestData = req.body.request
		let tableData = {
			subject: requestData.subject,
			object_type: requestData.objectType,
			object_id: requestData.objectId,
			body: requestData.body,
			user_id: requestData.userId
		}
		this.cassandraStoreSession.insertOne({ tableName: this.tableName, data: tableData }, (err: any, resp: any) => {
			if (err) {
				res.send({ status: 'fail', message: 'Error occured.Please try again.', error: err })
			} else {
				this.getCreatedThread(tableData, (err: any, threadData: any) => {
					if (err) {
						res.send({ status: 'fail', message: 'Error occured.Please try again.', error: err })
					} else {
						var esThreadBody = {
							subject: threadData.subject,
							object_type: threadData.object_type,
							object_id: threadData.object_id,
							body: threadData.body,
							user_id: threadData.user_id,
							identifier: threadData.id
						}
						this.elasticSearchStoreSession.insertOne({ type: this.tableName, body: esThreadBody }, (err: any, esRes: any) => {
							if (err) {
								res.send({ status: 'fail', message: 'Error occured.Please try again.', error: err })
							} else {
								res.send({ status: 'success', message: 'Thread created successfully' })
							}

						})
					}
				})

			}
		})
	}
}

const threadService = new ThreadService();
export { threadService }
