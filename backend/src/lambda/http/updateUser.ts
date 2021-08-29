import { updateUserProfile } from '../../helpers/user';
import 'source-map-support/register'
import { apiGatewayHandleErrors, apiGatewayMiddleware } from '../../external/framework/middlewares/api-gateway-middleware'
import middy from '@middy/core'
import { IUserRequest } from '../../entities/request/UserRequest';

export const handler = middy(async ({ requestContext: { authorizer }, body })=> {

    const user: IUserRequest = body;
  
    const post = await updateUserProfile(user, authorizer.principalId);

    return post;
})
    .use(apiGatewayMiddleware(200))
    .use(apiGatewayHandleErrors());