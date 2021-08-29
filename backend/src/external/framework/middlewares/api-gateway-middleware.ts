import middy from '@middy/core';
import { APIGatewayEvent } from 'aws-lambda';
// Import cors from '@middy/http-cors';

type ApiGatewayEventParsed = APIGatewayEvent & { body: Record<string, any> };
type ApiGatewayMiddleware = (statusCode?: number) => middy.MiddlewareObj<ApiGatewayEventParsed, ApiGatewayEventResponse>;
type ApiGatewayEventResponse = { body: string; statusCode: number, headers: Record<string, any> } | Record<string, any>;

/**
 * 
 * @param headers 
 * @returns 
 */
const cors = () => {
    
    const allowedHeaders = '*';
    const allowedMethods = process.env.CORS_ALLOW_METHODS || 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
    const allowedOrigin = '*';

    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': allowedMethods,
        'Access-Control-Allow-Headers': allowedHeaders,
    };
};

/**
 * 
 * @param statusCode 
 * @returns 
 */
export const apiGatewayMiddleware: ApiGatewayMiddleware = (statusCode = 200) => ({

    before: async (handler: middy.Request<APIGatewayEvent>) => {

        /* eslint-disable no-param-reassign */
        handler.event.body = JSON.parse(handler.event.body);
       
        const parameters: Record<string, any> = {};

        /* eslint-disable no-restricted-syntax, guard-for-in */
        for (const parameter in handler.event.multiValueQueryStringParameters) {
            // eslint-disable-next-line no-nested-ternary, no-unneeded-ternary, no-confusing-arrow
            const value = handler.event.multiValueQueryStringParameters[parameter].map(
                param => ['true', 'false'].includes(param.toLowerCase()) ? param.toLowerCase() === 'true' ? true : false : param);

            parameters[parameter] = value.length > 1 ? value : value[0];
        }

        /* eslint-enable no-restricted-syntax, guard-for-in */

        // Override parameters
        // eslint-disable-next-line no-multi-assign
        handler.event.queryStringParameters = handler.event.multiValueQueryStringParameters = parameters as any;
        /* eslint-enable no-param-reassign */
    },

    after: async handler => {
        /* eslint-disable no-param-reassign */
        handler.response = !handler.response ? { statusCode, body: null } : {
            statusCode: handler.response.statusCode || statusCode,
            body: JSON.stringify(handler.response.body || handler.response.statusCode ? null : handler.response),
            headers: {
                ...(handler.response ? handler.response.headers : {}),
                ...cors(),
            },
        };

        /* eslint-enable no-param-reassign */
    },

});

/**
 * 
 * @param status 
 * @returns 
 */
export const apiGatewayHandleErrors: (status?: number) => middy.MiddlewareObj<any, any> = (status = 500) => ({
    onError: async handler => {
        let statusCode = status;

        // eslint-disable-next-line no-prototype-builtins
        if(handler.error.hasOwnProperty('statusCode')){
            statusCode = handler.error['statusCode'];
        }

        /* eslint-disable no-param-reassign */
        const { message, details } = handler.error as Error & { details?: Record<string, any>[] };
        
        console.log(details);
        const isValidation = Array.isArray(details);

        // Resposta por contexto, se erro de validação, retorna 422 com detalhes, demais erros retorna 500
        const body = JSON.stringify(isValidation ? { isValidation: true, details, message } : { message });
        
        statusCode = isValidation ? 422 : statusCode;

        handler.response = {
            body,
            statusCode,
            headers: {
                ...(handler.response ? handler.response.headers : {}),
                ...cors(),
            },
        };

        /* eslint-enable no-param-reassign */
    },
});

