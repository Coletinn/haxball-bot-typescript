import { con, getConexaoEstabelecida } from './dbConnection';

interface UniformProps {
    angle: number;
    mainColor: string[];
    avatarColor: number;
}
export interface EquipeUniforme {
    ID: number;
    shortName: string;
    longName: string;
    country: string;
    uniform: UniformProps[];
}

export const uniformes: EquipeUniforme[] = [];

async function carregarUniformes(): Promise<void> {
    try {
        await getConexaoEstabelecida();

        const sql = `SELECT * FROM uniformes`;
        const [rows] = await con.promise().query(sql);

        uniformes.length = 0;

        rows.forEach((row: any) => {
            row.uniform = JSON.parse(row.uniform);
            uniformes.push(row);
        });

        console.log(`${uniformes.length} uniformes carregados com sucesso.`);
    } catch (error) {
        console.error('Erro ao carregar uniformes:', error);
        throw error;
    }
}

// Chamada da função
carregarUniformes();

export async function buscarUniformePorNome(nome: string): Promise<EquipeUniforme | undefined> {
    let uniforme = uniformes.find(u => u.shortName === nome);

    if (!uniforme) {
        uniforme = await buscarUniformeDBPorNome(nome);
        if (uniforme) {
            uniformes.push(uniforme);
        }
    }

    return uniforme;
}

export async function buscarUniformeDBPorNome(nome: string): Promise<EquipeUniforme | undefined> {
    try {
        const sql = `SELECT * FROM uniformes WHERE shortName = ? OR longName = ?`;
        const [rows] = await con.promise().query(sql, [nome, nome]);

        if (rows.length > 0) {
            const resultado = rows[0];
            resultado.uniform = JSON.parse(resultado.uniform);
            return resultado;
        } else {
            console.log("Nenhum uniforme encontrado para o nome fornecido.");
            return undefined;
        }
    } catch (error) {
        console.error('Erro ao buscar uniforme:', error);
        throw error;
    }
}