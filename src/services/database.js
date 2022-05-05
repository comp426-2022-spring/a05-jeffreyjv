// Put your database code here
const Database = require('better-sqlite3');

const logdb = new Database('log.db');

const stmt = logdb.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' and name='accessLog';`
    );

let row = stmt.get();

if (row == undefined) {
    const sqlInit = `
        CREATE TABLE accessLog ( 
            id INTEGER PRIMARY KEY, 
            remoteaddr TEXT,
            remoteuser TEXT,
            time INTEGER, 
            method TEXT,
            url TEXT,
            protocol TEXT, 
            httpversion TEXT, 
            status INTEGER, 
            referer TEXT, 
            useragent TEXT
        );     
    `;
    logdb.exec(sqlInit);
} else {
    console.log("Database already exists");
}

module.exports = logdb