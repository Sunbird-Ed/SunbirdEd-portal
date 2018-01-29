import { FrameworkAPI } from '../../../src/framework/frameworkAPI'
const Inject = FrameworkAPI.getDecorator('Inject')
class ReplyService {
	@Inject('CassandraStore')
	private cassandraStore: any;
	private cassandraStoreSession: any = this.cassandraStore.getConnection('org.ekstep.discussions')
	private tableName: String = "replies"

	public getRepliesByThreadId(threadId, cb) {
		this.cassandraStoreSession.find({ tableName: this.tableName, where: { thread_id: threadId } }, (err: any, resp: any) => {
			if (err) {
				cb(err, null)
			} else {
				cb(null, resp)
			}
		})
	}

	public replyToThread(req, res, next) {
		let requestData = req.body.request
		let tableData = {
			thread_id: requestData.threadId,
			body: requestData.body,
			user_id: requestData.userId
		}
		this.cassandraStoreSession.insertOne({ tableName: this.tableName, data: tableData }, (err: any, resp: any) => {
			if (err) {
				console.log(err);
				res.send({ status: 'fail', message: 'Error occured.Please try again.', error: err })
			} else {
				console.log(resp)
				res.send({ status: 'success', message: 'Reply added successfully' })
			}
		})
	}
}

const replyService = new ReplyService();
export { replyService }
