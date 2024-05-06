const mysql = require("mysql2");

// Conectar à database
let conexaoEstabelecida: Promise<void>;
export const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    charset: "utf8mb4" // Para permitir nomes estranhos...
});

export function connectDB(): void {
    conexaoEstabelecida = new Promise((resolve, reject) => {
        con.connect((err: any) => {
            if (err) {
                console.error("Erro ao conectar ao banco de dados:", err);
                reject(err);
            } else {
                console.log("Conexão com a database estabelecida!");
                resolve();
            }
        });
    });
}

connectDB();

export function getConexaoEstabelecida() {
    return conexaoEstabelecida;
}