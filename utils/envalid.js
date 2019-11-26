const { cleanEnv, str } = require('envalid');

const validateEnv = () =>
    cleanEnv(process.env, {
        DATA_NAME: str(),
        DATA_PASSWORD: str(),
        DATA_BASE: str(),
        HOST: str(),
        PORT: str(),
    });

module.exports = validateEnv();
