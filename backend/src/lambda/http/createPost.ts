import 'source-map-support/register'
import { createPost } from '../../helpers/posts'
import { apiGatewayHandleErrors, apiGatewayMiddleware } from '../../external/framework/middlewares/api-gateway-middleware'
import middy from '@middy/core';
import { ICreatePostRequest } from '../../entities/request/CreatePostRequest';

export const handler = middy(async ({ requestContext: { authorizer }, body })=> {
    const newPost: ICreatePostRequest = body;

    return await createPost(newPost, authorizer.principalId);
})
    .use(apiGatewayMiddleware(200))
    .use(apiGatewayHandleErrors());