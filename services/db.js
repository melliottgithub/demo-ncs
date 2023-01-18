const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PWD || 'password123',
    host: process.env.DB_HOST || 'localhost',
    max: 25,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

function getClient () {
    return pool.connect();
}

function query (queryText, values) {
    return pool.query(queryText, values);
}

(async () => {
    await pool.connect();
    console.log('Connected to database');
})();

module.exports = { getClient, query };
