const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "DBluste",
    password: "1404",
    port: 5432
});

module.exports = pool;