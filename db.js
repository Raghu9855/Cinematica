import mysql from 'mysql2';

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ott_platform',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL!');
});


