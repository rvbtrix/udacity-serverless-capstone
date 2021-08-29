import 'source-map-support/register'
import { apiGatewayHandleErrors, apiGatewayMiddleware } from '../../external/framework/middlewares/api-gateway-middleware'
import { deletePost } from '../../helpers/posts'
import middy from '@middy/core';


export const handler = middy(async ({ requestContext: { authorizer }, pathParameters })=> {
    const { postId } = pathParameters;

    console.log('postId', postId );
    console.log('authorizer', authorizer.principalId );
    await deletePost(postId, authorizer.principalId);
    
    return { deleted: true };
})
    .use(apiGatewayMiddleware(200))
    .use(apiGatewayHandleErrors());
