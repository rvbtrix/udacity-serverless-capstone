// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'vwpbkomolb'
export const apiEndpoint = `https://${apiId}.execute-api.sa-east-1.amazonaws.com/hml`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'botelhorv.us.auth0.com',            // Auth0 domain
  clientId: '7gZI9iDWCDYwKq5R5SPWSrNLhZgfj6qv',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
