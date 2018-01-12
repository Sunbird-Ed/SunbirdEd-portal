import { FrameworkAPI } from '../../../src/framework/frameworkAPI'
const Inject = FrameworkAPI.getDecorator('Inject')
import { replyService } from './replyService'

class ThreadService {
	@Inject('CassandraStore')
	private cassandraStore: any;
	private cassandraStoreSession: any = this.cassandraStore.getConnection('org.ekstep.discussions')
	private tableName: String = "threads"

	public getThreads(req, res, next) {
		this.cassandraStoreSession.find({ tableName: this.tableName, where: {} }, (err: any, resp: any) => {
			if (err) {
				console.log(err)
				res.send({ status: 'fail', message: 'Error occured.Please try again.', error: err })
			} else {
				console.log(resp)
				res.send({ status: 'success', threads: resp })
			}
		})
	}

	public getThreadById(req, res, next) {
		let threadId = req.params.threadId
		this.cassandraStoreSession.findOne({ tableName: this.tableName, where: { id: this.cassandraStoreSession.utils().getUUIDfromString(threadId) } }, (err: any, resp: any) => {
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
						res.send({ status: 'success', thread: resp,replies:replies })
					}
				})
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
				console.log(resp)
				res.send({ status: 'success', message: 'Thread created successfully' })
			}
		})
	}
}

const threadService = new ThreadService();
export { threadService }
