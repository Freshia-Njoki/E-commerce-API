import dotenv from 'dotenv'
import assert from 'assert'//validates if a condition is true-boolean

dotenv.config();

const { PORT, SQL_USER, SQL_PWD, SQL_DB, SQL_SERVER, JWT_SECRET } = process.env;

assert(PORT, 'PORT is required');
 const config = {
    //for express
    port: PORT,
    //for server
    sql: {
        server: SQL_SERVER,
        database: SQL_DB,
        user: SQL_USER,
        password: SQL_PWD,
        options:{
            encrypt: true,
            enableArithAbort: false
        }
    }, 
    jwt_secret: JWT_SECRET

 };

 export default config;