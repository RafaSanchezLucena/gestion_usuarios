const mysql = require("mysql");



// Conexión a BBDD local
const pool = mysql.createPool({
    poolLimit: 10,
    host: `localhost`,
    user: `rafa`,
    password: `13sirope15`,
    database: `colegio`,
    socketPath: "/var/lib/mysql/mysql.sock",
});


pool.getConnection((err) => {
    if (err) {
        console.log(`Error de conexión --> ${err}`);
        return;
    }
    console.log("Conectado a Mysql");
});



module.exports = pool;