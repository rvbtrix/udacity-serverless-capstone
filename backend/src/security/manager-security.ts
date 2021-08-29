import aws from 'aws-sdk';

/**
 * 
 * @returns 
 */
const getSecretManager = async () => {
    const secretManager = new aws.SecretsManager({ apiVersion: '2017-10-17' });

    console.log('Buscando chave de token em', process.env.SECRET_KEYS_ID);
    
    return secretManager
        .getSecretValue({ SecretId: process.env.SECRET_KEYS_ID })
        .promise()
        .then(({ SecretString }) => JSON.parse(SecretString) as Record<string, any>);
};


/**
 * Secrets
 * @returns 
 */
const getSecret = async (key: string) => {
    const values = await getSecretManager();

    return values[key];
};

export const managerSecurity = {
    getSecret,
};
