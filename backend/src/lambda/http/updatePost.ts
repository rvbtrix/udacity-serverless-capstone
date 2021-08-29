import 'source-map-support/register'
import { updatePost } from '../../helpers/posts'
import { apiGatewayHandleErrors, apiGatewayMiddleware } from '../../external/framework/middlewares/api-gateway-middleware'
import middy from '@middy/core'
import { IUpdatePostRequest } from '../../entities/request/UpdatePostRequest';

export const handler = middy(async ({ requestContext: { authorizer }, pathParameters, body })=> {
    const { postId } = pathParameters;

    const postToUpdate: IUpdatePostRequest = body;
  
    const post = await updatePost(postId, postToUpdate, authorizer.principalId);

    return post;
})
    .use(apiGatewayMiddleware(200))
    .use(apiGatewayHandleErrors());