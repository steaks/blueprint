import pg from "pg-promise";

const options = {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'CITIFAKEBANK_BOT',
    password: 'HA1GNCP3Ux',
    max: 30 // use up to 30 connections
    // "types" - in case you want to set custom type parsers on the pool level
};

export const db = pg()(options)