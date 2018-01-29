import { FrameworkAPI } from '../../../src/framework/frameworkAPI'
import { threadService } from './threadService'
import { replyService } from './replyService'
const Inject = FrameworkAPI.getDecorator('Inject')

class PluginRoutes {

	@Inject('RouterRegistry')
	private static RouterRegistry: any;

	public static initialize() {
		this.RouterRegistry.registerRoute({
			pluginId: "org.ekstep.discussions",
			routes: [{
				method: 'GET',
				URL: '/list-thread',
				handler: (req, res, next) => {
					return threadService.getThreads(req, res, next)
				}
			},
			{
				method: 'GET',
				URL: '/thread/:threadId',
				handler: (req, res, next) => {
					return threadService.getThreadById(req, res, next)
				}
			},
			{
				method: 'POST',
				URL: '/create-thread',
				handler: (req, res, next) => {
					return threadService.createThread(req, res, next)
				}
			},
			{
				method: 'POST',
				URL: '/reply-thread',
				handler: (req, res, next) => {
					return replyService.replyToThread(req, res, next)
				}
			}
		]
		});
	}
}

PluginRoutes.initialize();
