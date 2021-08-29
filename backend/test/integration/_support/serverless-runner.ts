import path from 'path';
import Serverless from 'serverless';
import intercept from 'intercept-stdout';
import { find } from 'lodash';

// Porta padrão para serverless de testes
const DEFAULT_PORT: number = 3000;
// +rocess.env.TEST_SERVERLESS_PORT || 3000;

// Stage padrão para serverless de testes
const DEFAULT_STAGE: string = process.env.TEST_SERVERLESS_STAGE || 'local';

// Definição de verbosidade do log do serverless
const DEFAULT_VERBOSE: boolean = true; Boolean(process.env.TEST_SERVERLESS_VERBOSE);

let serverless: any;

// Verifica se existe uma URL já definida para os testes (outro ambiente)
export const isOfflineServer = !process.env.TEST_BASE_URL;

/**
 * Inicia o serviço serverless para testes
 *
 * @param stage 
 * @param stdoutNotify 
 */
export const start = (stage: string = DEFAULT_STAGE, stdoutNotify: string = 'Offline [http for lambda] listening on') => {

    // Serverless sendo executado em outro ambiente
    if (!isOfflineServer) {

        console.log('\nNot running against http://localhost, so will not start the local server. Let the tests begin!');

        return process.env.TEST_BASE_URL;

    };

    // Iniciar serverless offline local
    const cmd = `offline start --stage ${stage}`;

    // process.argv = process.argv.slice(0, 2).concat(cmd.split(' '));

    // Simulate the argv for Serverless cli instanciation
    const originalProcessArgv = process.argv;
    process.argv = `node serverless offline start --stage ${stage}`.split(' ');

    serverless = new Serverless({
        servicePath: path.join(__dirname, '../../../')
    });

    return new Promise(async (resolve, reject): Promise<string> => {

        const unhook = intercept((text: string) => {

            if (text.includes(stdoutNotify)) {
                resolve(process.env.TEST_BASE_URL = `http://localhost:${DEFAULT_PORT}`);
            }

            if (!DEFAULT_VERBOSE && text.includes('Serverless:')) return '';

        });

        return serverless
            .init()
            .then(() => serverless.run())
            .then(() => unhook())
            .then(() => { process.argv = originalProcessArgv; return; })
            .catch(reject);

    });

};

/**
 * Para o serviço serverless e seus plugins usado no teste
 */
export const stop = async () => {

    if (!isOfflineServer) return null

    console.log('Stopping Server...');

    const plugins = (serverless.pluginManager as any).getPlugins();

    const offline = find(plugins, plugin => plugin.constructor.name === 'ServerlessOffline');
    const dynamo = find(plugins, plugin => plugin.constructor.name === 'ServerlessDynamodbLocal');

    dynamo.endHandler();

    console.log('Server Stopped');

    return offline.hooks['offline:start:end']();

};

export default { start, stop };
