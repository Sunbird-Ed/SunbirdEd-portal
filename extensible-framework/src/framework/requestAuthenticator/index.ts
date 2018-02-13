import { envVariables } from '../environmentVariables';
import { ApiInterceptor } from './APIInterceptor';

export class TokenAuthenticator {
    private static keyCloak_config = {
		'authServerUrl': envVariables.PORTAL_AUTH_SERVER_URL,
		'realm': envVariables.KEY_CLOAK_REALM,
		'clientId': envVariables.PORTAL_AUTH_SERVER_CLIENT,
		'public': envVariables.KEY_CLOAK_PUBLIC
	}

	private static cache_config = {
		store: envVariables.CACHE_STORE,
		ttl: envVariables.CACHE_TTL
	}

	public static verfiy(authUserToken: string, callback: (error: Error|undefined, result: boolean|undefined) => void) {
		if (authUserToken) {
                var apiInterceptor = new ApiInterceptor(this.keyCloak_config, this.cache_config)
                apiInterceptor.validateToken(authUserToken, function(err: object, token: boolean) {
                    if (token) {
                        callback(undefined, token)
                    } else {
                        callback(new Error('invalid user auth token!'), undefined);
                    }
                })
            } else {
                callback(new Error('invalid no. of arguments!'), undefined);
            }
	}
}

