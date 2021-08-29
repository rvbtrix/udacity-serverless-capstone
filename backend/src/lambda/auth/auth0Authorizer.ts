import 'source-map-support/register';
import middy from '@middy/core';
import { IJwtToken } from '../../auth/JwtToken';
import { managerSecurity } from '../../security/manager-security';
import { verify } from 'jsonwebtoken';

export const handler = middy(async event => {
    try {
        const secret = await managerSecurity.getSecret('authsecret');

        console.log('event::', event);

        const jwtToken = verifyToken(event.authorizationToken, secret);

        console.log('jwtToken::', jwtToken);
        console.log('authorizationToken::', event.authorizationToken);

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }

    } catch (exception) {
        console.log('User was not authorized', exception.message)

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
})

/**
 * 
 * @param authHeader 
 * @param secret 
 * @returns 
 */
function verifyToken(authHeader: string, secret: string): IJwtToken {
    if (!authHeader) { throw new Error('No authentication header') }

    if (!authHeader.toLowerCase().startsWith('bearer ')) { throw new Error('Invalid authentication header') }

    const split = authHeader.split(' ');
    const token = split[1];

    return verify(token, secret, { algorithms: ['RS256'] }) as IJwtToken
}
