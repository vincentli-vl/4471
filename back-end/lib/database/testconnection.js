import mysql from 'mysql2/promise';
import fs from 'fs';

console.log(fs.readFileSync("../../IBMSQL_Cert_Ca.crt"))

const pool = mysql.createPool({
  host: "60173590-d727-4a0d-ac06-840b7ce6fae0.4b2136ddd30a46e9b7bdb2b2db7f8cd0.databases.appdomain.cloud",
  port: "32090",
  user: "admin",
  password: "Pseudopodia1___",
  database: "service_registry",
  ssl: {
    ca: fs.readFileSync("../../IBMSQL_Cert_Ca.crt")
  }
});

const testConnection = async () => {
  try {
    const [rows, fields] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('The solution is: ', rows[0].solution);
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
  }
};

testConnection();

// function connect() {
//     const pool = mysql.createPool({
//         connectionLimit: 4,
//         host: "60173590-d727-4a0d-ac06-840b7ce6fae0.4b2136ddd30a46e9b7bdb2b2db7f8cd0.databases.appdomain.cloud",
//         port: "32090",
//         user: "admin",
//         password: "Pseudopodia1___",
//         database: "service_registry",
//     });
//     return pool;
// }


// function query(sql) {
//     console.log(`We are in the query function!\n`)
//     const pool = connect()
//     console.log(pool)
//     return new Promise((resolve, reject) => {
//         pool.getConnection((err, conn) => {
//             if (err) {
//                 console.log(err);
//                 reject({ code: err.errno, message: err.sqlMessage });
//             } else {
//                 conn.query(sql, (err, results, fields) => {
//                     if (err) {
//                         console.log(err);
//                         reject({
//                             code: err.errno,
//                             message: err.sqlMessage,
//                         });
//                     } else resolve(results);
//                     conn.release();
//                 });
//             }
//         });
//     });
// }