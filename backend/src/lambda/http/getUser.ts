import { getUser } from '../../helpers/user';
import 'source-map-support/register'
import { apiGatewayHandleErrors, apiGatewayMiddleware } from '../../external/framework/middlewares/api-gateway-middleware'
import middy from '@middy/core'

export const handler = middy(async ({ requestContext: { authorizer } })=> {

    return await getUser(authorizer.principalId);
})
    .use(apiGatewayMiddleware(200))
    .use(apiGatewayHandleErrors());