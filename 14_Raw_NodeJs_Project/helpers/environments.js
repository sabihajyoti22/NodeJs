const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'sdfsdfsxfvdf',
    maxChecks: 5,
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'trutyuhjhgjg',
    maxChecks: 5,
};

const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.trim() : 'staging';

const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

module.exports = environmentToExport;
