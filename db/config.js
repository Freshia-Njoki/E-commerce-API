import dotenv from 'dotenv'
import assert from 'assert'//validates if a condition is true-boolean

dotenv.config();

const { PORT, HOST, HOST_URL, SQL_USER, SQL_PWD, SQL_DB, SQL_SERVER, JWT_SECRET } = process.env;

const sqlEncrypt = process.env.SQL_ENCRYPTED === 'true';

assert(PORT, 'PORT is required');
assert(HOST, 'HOST is required');

 const config = {
    //for express
    port: PORT,
    host: HOST,
    url: HOST_URL,
    //for server
    sql: {
        server: SQL_SERVER,
        database: SQL_DB,
        user: SQL_USER,
        password: SQL_PWD,
        options:{
            encrypt: sqlEncrypt,
            enableArithAbort: true
        }
    }, 
    jwt_secret: JWT_SECRET

 };

 export default config;