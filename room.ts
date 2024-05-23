require('dotenv').config();
if (Number(process.env.maxTeamSize) == 0 || Number(process.env.maxGoals) == 0 || Number(process.env.timeLimit) == 0 || process.env.room_id == undefined) {
    console.error("Necessário as variáveis de ambiente 'maxTeamSize', 'maxGoals' e 'room_id'.");
    process.exit(1);
}

import { con, getConexaoEstabelecida } from './src/Room/Config/dbConnection';

const HaxballJS = require("haxball.js");
const bcrypt = require('bcrypt');
const fs = require("fs");
const NoGoal = fs.readFileSync('./stadiums/nogoal.hbs', 'utf8'); // Mapa 1
const Aquecimento = fs.readFileSync('./stadiums/Aquecimento.hbs', 'utf8'); // Mapa 2
const nomeMapa = process.env.mapa ?? 'x3'
const Mapa = fs.readFileSync(`./stadiums/${nomeMapa}.hbs`, 'utf8'); // Mapa 3
const readline = require('readline');
const config = require('./config.json');
const FormData = require('form-data');
const axios = require('axios');

import { EmbedBuilder } from 'discord.js';
import { Player } from './src/api/player';
import client from './src/Client/client';
import './src/Client/Modals';
import './src/Discord/Commands/SlashCommands/Membros/registrar';
import './src/Discord/Commands/SlashCommands/ceo/clear-bans';
import './src/Discord/Commands/SlashCommands/ceo/config';
import './src/Discord/Commands/SlashCommands/admins/send';
import './src/Discord/Commands/SlashCommands/admins/resetball';
import './src/Room/Functions/getStaffOnline';
import './src/Discord/Commands/SlashCommands/Membros/players';
import './src/Discord/Config/images';
import './src/Discord/Commands/SlashCommands/admins/kick';
// import { roomLogChannel, roomReplaysChannel } from './src/Client/Modals';
import { error } from './src/Room/Config/errors';
import { cores } from './src/Room/Config/cores';
import { getStaffOnlineInfo } from './src/Room/Functions/getStaffOnline';
import { entrada } from './src/Room/Functions/entrada';
import { data } from './src/Discord/Config/images';
import { calladmin } from './src/Room/Commands/calladmin';
import { chooseUni } from './src/Room/Functions/ChooseUni';

export let goalName: string | null = null;
export let passName: string | null = null;
export let discord = config.discord;
export let roomName = process.env.SERVERNAME ?? '🩸 BORE ARENE 🩸 | X3 | FUTSAL'; // Dps tu altera o nome da sala

export var teamR: Player[] = [];
export var teamB: Player[] = [];
export var teamS: Player[] = [];

export var roomLogChannel: string | null = null;
export let roomReplaysChannel: string | null = null;
export let roomErrorsChannel: string | null = null;
export let roomEntradasChannel: string | null = null;
export let roomStatusChannel: string | null = null;

//Tudo que precisar de conexão com a database deve ser colocado abaixo desta linha.
//TODO: Mover tudo de DB para outro lugar futuramente
import { uniformes, EquipeUniforme } from './src/Room/Config/uniformes';

async function loadConfig() {
    await getConexaoEstabelecida();
    con.query(`SELECT * FROM rooms WHERE id = ?`, [process.env.room_id], (err: any, result: any) => {
        if (err) throw err;
        if (result.length > 0) {
            roomLogChannel = result[0].log;
            roomReplaysChannel = result[0].replay;
            roomErrorsChannel = result[0].error;
            roomEntradasChannel = result[0].join;
            roomStatusChannel = result[0].status;
        }
    });
} loadConfig();

export const setRoomLogChannel = (log: string) => {
    con.query(`UPDATE rooms SET log = ? WHERE id = ?`, [log, process.env.room_id], (err: any, result: any) => {
        if (err) throw err;
        roomLogChannel = log;
    });
};
export const setRoomReplayChannel = (replay: string) => {
    con.query(`UPDATE rooms SET replay = ? WHERE id = ?`, [replay, process.env.room_id], (err: any, result: any) => {
        if (err) throw err;
        roomReplaysChannel = replay;
    });
};

export const setRoomErrorsChannel = (error: string) => {
    con.query(`UPDATE rooms SET error = ? WHERE id = ?`, [error, process.env.room_id], (err: any, result: any) => {
        if (err) throw err;
        roomErrorsChannel = error;
    });
};

export const setRoomEntradasChannel = (join: string) => {
    con.query('UPDATE rooms SET `join` = ? WHERE id = ?', [join, process.env.room_id], (err: any, result: any) => {
        if (err) throw err;
        roomEntradasChannel = join;
    });
};

export const setRoomStatusChannel = (status: string) => {
    con.query(`UPDATE rooms SET status = ? WHERE id = ?`, [status, process.env.room_id], (err: any, result: any) => {
        if (err) throw err;
        roomStatusChannel = status;
    });
};

export function createChannelMessage(channelName: string, channelId: string | null): string {
    return channelId ?
        `🩸 - Canal de ${channelName} **(<#${channelId}>)**\n` :
        `❌ - Canal de ${channelName}\n`;
}

// Abrir variavel para timeout do jogador.
const timeoutIds: Record<string, any> = {};

// definir Interfaces para player
/* interface Player {
    id: number;
    name: string;
    team: number;
} */

interface PlayerStatus {
    [id: number]: boolean;
}

// Definir player
let player: Player;

// Definir as estatísticas
interface PlayerStatistics {
    [playerId: string]: {
        goals: number;
        assists: number;
        ag: number;
    }
}

let playerStatistics: PlayerStatistics = {};

// Definir AFK
let afkStatus: { [key: number]: number } = {};
let loggedInPlayers: { [key: number]: boolean } = {};
let isMuted: { [key: number]: boolean } = {};

// Definir equipe que ganha perde
let winningTeam: number;
let losingTeam: number;

// Definir elo ganho
let eloPointsWin = 0;
let eloPointsLost = 0;

// Variáveis da previsão de vitória
let team1Elo = 0;
let team2Elo = 0;

// Variável WinStreak.
var winstreak: any = 0;

// Variável dos GK
let gk = Array(2); // Array de 2, 1 GK red / 1 GK blue

// Registro pelo Discord
type UserUnsaved = {
    nick?: string;
    senha?: string;
    generatedPassword?: string;
};

type UsersCollection = { [userId: number]: UserUnsaved };

// Assuming you have a variable to track match start time
let matchStartTime: Date;

export let unsavedUsers: UsersCollection = {};
let nextUserId = 1;

export function registroDiscord(nomeDele: string, senhaDele: string) {
    const userId: number = nextUserId;
    nextUserId++;

    if (!unsavedUsers[userId]) {
        unsavedUsers[userId] = {};
    }

    var randomString = generateRandomString();

    unsavedUsers[userId].nick = nomeDele;
    unsavedUsers[userId].senha = senhaDele;
    unsavedUsers[userId].generatedPassword = randomString;

    var returnContent = {
        id: userId,
        name: nomeDele,
        password: senhaDele,
        generated: `${randomString}`  // Invoca a função aqui
    }

    return returnContent;
}


export function buscarUsuarioPorNome(nome: string): UserUnsaved | undefined {
    for (const userId in unsavedUsers) {
        if (unsavedUsers.hasOwnProperty(userId)) {
            if (unsavedUsers[userId].nick === nome) {
                return unsavedUsers[userId];
            }
        }
    }
    return undefined; // Retorna undefined se nenhum usuário for encontrado com o nome fornecido
}

function generateRandomString(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';

    for (let i = 0; i < 20; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

function decryptHex(conn: string): string {
    const matches = conn.match(/.{1,2}/g);
    if (matches === null) {
        return '';
    }
    return matches.map(function (v: string) {
        return String.fromCharCode(parseInt(v, 16));
    }).join('');
}


// Variável da Staff
let superadmin: { [key: string | number]: number } = {};
let gerentes: { [key: string | number]: number } = {};
let admins: { [key: string | number]: number } = {};
let mods: { [key: string | number]: number } = {};

let vips: { [key: string | number]: number } = {};
let premiums: { [key: string | number]: number } = {};
let legends: { [key: string | number]: number } = {};

// Preciso disto para o Ban ser mais fidedigno
export let playerConnections: any = new Map();
export let playerAuth: any = new Map();
export let playerIpv4: any = new Map();

// Para não executar o CS + que 1 vez.
let executed = false;

// Variável de quando a topstreak é batida enviar apenas o announcement 1x.
let TopStreakBatida = false;

// Chat colorido
var Admin = config.cargos.admin;

var ceoPassword = config.ceo_password;
var gerentePassword = config.gerente_password;

var adminsTag = config.cargos.admin;
var modsTag = config.cargos.mod;
var gerentesTag = config.cargos.gerente;
var CeoTag = config.cargos.ceo;

var vipTag = config.cargos.vips.vip;
var premiumTag = config.cargos.vips.premium;
var legendTag = config.cargos.vips.legend;

var palavrasRacismo = ["macaco", "primata", "negrinho", "negrinha", "mascaico", "makako", "makaka", "makakinho", "makakinha"],
    regexRacismo = new RegExp(palavrasRacismo.join("|"), 'gi');

var palavrasSuicidio = ["se suicida", "se corta"],
    regexSuicidio = new RegExp(palavrasSuicidio.join("|"), 'gi');

export var passwordVip = getRandomInt2(10000, 97999);
export var passwordPremium = getRandomInt2(10000, 98999);
export var passwordLegend = getRandomInt2(10000, 99999);


function getRandomInt2(min: any, max: any) {
    return Math.floor(Math.random() * (max - min) + 1)
}

function getRandomInt(max: number) { // returns a random number from 0 to max-1
    return Math.floor(Math.random() * Math.floor(max));
}

// Explicações do que cada comando faz.
const commandExplanations: any = {
    "help": "Exibe a lista de comandos disponíveis.",
    "registrar": "Digite !registrar seguido pela sua senha (ex. !registrar 1234 )",
    "login": "Digite !login seguido pela sua senha (ex. !login 1234 )",
    "mudarsenha": "Digite !mudarsenha seguido da sua senha antiga e depois a senha nova (ex. !mudarsenha 1234 senha123 )",
    "afk": "Digite uma vez para ficar afk, digite novamente para remover o status de afk.",
    "about": "Mostra as informações da sala.",
    "discord": "Veja o link do discord oficial da sala.",
    "stats": "Mostra as suas estátisticas ou as de outro jogador. (!stats) ou (!stats NOME)",
    "rank": "Mostra os ranks que pode obter na sala.",
    "t": "Digite: t Mensagem para enviar uma mensagem no chat de equipe.",
    "gk": "Caso a sala tenha detectado o GK errado, colocará você como GK.",
    "afks": "Mostra a lista de usuários AFK.",
    "streak": "Mostra o streak atual da sala.",
    "topstreak": "Mostra o recorde de streak da sala.",
    "sub": "É substituído caso esteja nos primeiros 5 segundos da partida.",
    "prev": "Veja a previsão de vitória para o jogo atual.",
    "#": "Envia mensagem privada para o jogador através do ID. (Ex: #50 teste)",
    "bb": "Faz logout da sala.",
    "cs": "Mostra o top 10 cs da sala.",
    "gols": "Mostra o top 10 artilheiros da sala.",
    "vitorias": "Mostra o top 10 com mais vitórias na sala.",
    "jogos": "Mostra o top 10 jogadores com mais jogos da sala.",
    "uniformes": "Mostra a lista de uniformes disponíveis."
};

var room: any;
export let numberOfPlayers: number = 0;
export function updateNumberOfPlayers(playerList: any[]) {
    numberOfPlayers = playerList.length;
}

const rl = readline.createInterface({
    input: process.stdin,
    // output: process.stdout,
});

// Lidar com entrada de comando do usuário
rl.on("line", (input: string) => {
    if (input === "exit") {
        rl.close();
        process.exit(0);
    } else if (input == "players") {
        console.log(room.getPlayerList());
        console.log(`Número de jogadores: ${numberOfPlayers}`);
    } else if (input.startsWith("eval ")) {
        const codeToEvaluate = input.slice(5);
        try {
            const result = eval(codeToEvaluate);
            console.log("Resultado da avaliação:", result);
        } catch (error) {
            console.error("Erro na avaliação:", error);
        }
    }
    rl.prompt();
});

rl.on("close", () => {
    console.log("Encerrando servidor.");
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Encerrando a sala...');
    process.exit(0);
});

client.login(process.env.DISCORDTOKEN);

HaxballJS.then((HBInit: (arg0: { roomName: any; maxPlayers: number; public: boolean; noPlayer: boolean; geo: { "code": string, "lat": number, "lon": number }; token: string; }) => any) => {
    room = HBInit({
        roomName: roomName, // Nome da Sala
        maxPlayers: 16,
        public: ['true', '1'].includes(process.env.public || '0'),
        noPlayer: true,
        geo: { "lat": -19.90, "lon": -43.95, "code": "br" },
        token: String(process.env.TOKEN), // Colocar a token que se adquire aqui: https://www.haxball.com/headlesstoken
    });

    // Enviar o link da sala para a consola.
    room.onRoomLink = function (link: any) {
        con.query(`UPDATE players SET game_id = 0, loggedIn = 0 WHERE loggedIn = 1 OR game_id <> 0;`, [], (err: any) => {
            if (err) throw err;
        });
        console.log(link);
        room.setCustomStadium(Mapa); // Carregar estádio.
        console.log(`Sala iniciada com sucesso, se quiser encerrar a sala digite: Ctrl + C`);

        if (roomStatusChannel !== null) {
            let responseMessage = `Dados da sala:\n${link}\n`;
            responseMessage += createChannelMessage('logs', roomLogChannel);
            responseMessage += createChannelMessage('replays', roomReplaysChannel);
            responseMessage += createChannelMessage('errors', roomErrorsChannel);
            responseMessage += createChannelMessage('entradas/saídas', roomEntradasChannel);
            responseMessage += createChannelMessage('status', roomStatusChannel);

            const embed = new EmbedBuilder()
                .setTitle(`${roomName} online.`)
                .setDescription(responseMessage)
                .setColor('Random');
            client.send(roomStatusChannel, [embed], true);
        }
    };

    var rankTag: any = [];
    var vipPausou: any = [];
    const ranks = config.rankings;

    function organizeRanks(ranks: any) {
        var organizedRanks: any = [];
        var points = 0;

        for (let i = 0; i < ranks.length; i++) {
            const rank: any = ranks[i];
            const pointsText: any = `${points} pts`;

            organizedRanks.push(`${pointsText}:${rank}`);
            points += 200;
        }

        return organizedRanks.join(" | ");
    }

    // Vou definir aqui em cima caso necessite de usar em alguma merda em principio não mas mais vale :D
    let activePlayers = room.getPlayerList().filter((p: Player) => {
        return afkStatus[p.id] !== 1;
    });

    // Funções da sala
    room.setScoreLimit(Number(process.env.maxGoals)); // Score setado a 3
    room.setTimeLimit(Number(process.env.timeLimit)); // TimeLimit setado a 3
    room.setTeamsLock(true); // Bloquear as equipes
    room.setTeamColors(1, 60, 0xFFFFFF, [0xFF4D40, 0xFF4D40, 0xFF4D40]); // Cor equipe RED
    room.setTeamColors(2, 60, 0xFFFFFF, [0x0080ff, 0x0080ff, 0x0080ff]); // Cor equipe BLUE

    // Checkar a equipe que ganha e perde.
    function trackWinningTeam() {
        if (room.getScores().red > room.getScores().blue) {
            winningTeam = 1;
            losingTeam = 2;
        } else if (room.getScores().blue > room.getScores().red) {
            winningTeam = 2;
            losingTeam = 1;
        }
    }

    function distribuirStats(playerStatistics: PlayerStatistics) {
        const playersOnTeam = activePlayers.filter((p: { team: number; }) => p.team === 1 || p.team === 2);
        for (let player of playersOnTeam) {
            if (playerStatistics[player.id]) {
                for (let stat in playerStatistics[player.id]) {
                    if (stat === "goals") {
                        const sql = `UPDATE stats SET goals = goals + ? WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?`;
                        const values = [playerStatistics[player.id][stat], player.name, process.env.room_id];
                        con.query(sql, values, (err: any, result: any) => {
                            if (err) throw err;
                        });
                    } else if (stat === "assists") {
                        const sql = `UPDATE stats SET assists = assists + ? WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?`;
                        const values = [playerStatistics[player.id][stat], player.name, process.env.room_id];
                        con.query(sql, values, (err: any, result: any) => {
                            if (err) throw err;
                        });
                    } else if (stat === "ag") {
                        const sql = `UPDATE stats SET ag = ag + ? WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?`;
                        const values = [playerStatistics[player.id][stat], player.name, process.env.room_id];
                        con.query(sql, values, (err: any, result: any) => {
                            if (err) throw err;
                        });
                    }
                }
            }
            // Sistema de Elo
            // Equipe vermelha
            if (winningTeam === 1) {
                eloPointsWin = 5 + (6 * room.getScores().red) - (4 * room.getScores().blue);
            } else if (losingTeam === 1) {
                eloPointsLost = -6 + (4 * room.getScores().red) - (6 * room.getScores().blue);
            }
            // Equipe azul
            if (winningTeam === 2) {
                eloPointsWin = 5 + (6 * room.getScores().blue) - (4 * room.getScores().red);
            } else if (losingTeam === 2) {
                eloPointsLost = -6 + (4 * room.getScores().blue) - (6 * room.getScores().red);
            } // Sistema de Elo

            if (player.team === winningTeam) {
                if (room.getScores().blue === 0) {
                    if (gk[0].position != null && gk[0].name && !executed) {
                        const sql = `UPDATE stats SET cs = cs + 1, elo = elo + 2 WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?`;
                        const values = [gk[0].name, process.env.room_id];
                        con.query(sql, values, (err: any, result: any) => {
                            if (err) throw err;
                        });
                        executed = true;
                        room.sendAnnouncement(`🏆 O GK ${gk[0].name} não tomou nenhum gol, parabéns!`, null, 0xFFFFFF, "bold", 0);
                    }
                } else if (room.getScores().red === 0) {
                    if (gk[1].position != null && gk[1].name && !executed) {
                        const sql = `UPDATE stats SET cs = cs + 1, elo = elo + 2 WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?`;
                        const values = [gk[1].name, process.env.room_id];
                        con.query(sql, values, (err: any, result: any) => {
                            if (err) throw err;
                        });
                        executed = true;
                        room.sendAnnouncement(`🏆 O GK ${gk[1].name} não tomou nenhum gol, parabéns!`, null, 0xFFFFFF, "bold", 0);
                    }
                }
                // Ganhar
                const sql = `UPDATE stats SET wins = wins + 1, games = games + 1, elo = elo + ? WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?`;
                const values = [eloPointsWin, player.name, process.env.room_id];
                con.query(sql, values, (err: any, result: any) => {
                    if (err) throw err;
                });

            } else {
                // Perder
                const sql = `UPDATE stats SET losses = losses + 1, games = games + 1, elo = GREATEST(0, elo + ?) WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?`;
                const values = [eloPointsLost, player.name, process.env.room_id];
                con.query(sql, values, (err: any, result: any) => {
                    if (err) throw err;
                });
            }
        }
        // Um bocado óbvio o que isto faz :)
        if (room.getScores().red > room.getScores().blue) {
            room.sendAnnouncement(`🔴 Equipe vermelha ganhou por ${room.getScores().red} a ${room.getScores().blue}!`, null, 0xFF0000, "bold");
            console.log(`Equipe vermelha ganhou por ${room.getScores().red} a ${room.getScores().blue}.`);
        } else {
            room.sendAnnouncement(`🔵 Equipe azul ganhou por ${room.getScores().blue} a ${room.getScores().red}!`, null, 0x035FFF, "bold");
            console.log(`Equipe azul ganhou por ${room.getScores().blue} a ${room.getScores().red}.`);
        }
    }

    function prejudicarJogador(player: Player) {
        if (!player) { // Proteger contra crash.
            return;
        }
        // Prejudicar o jogador que saiu.
        const sql = `UPDATE stats SET elo = GREATEST(0, elo - 50), games = games + 1, losses = losses + 1 WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?`;
        const values = [player.name, process.env.room_id];
        con.query(sql, values, (err: any) => {
            if (err) throw err;
            console.log(`${player.name} Foi prejudicado por sair no meio do jogo.`);
        });
    }

    // Mensagem de 5 em 5 minutos
    setInterval(() => {
        room.sendAnnouncement(`📢 Faça parte da nossa comunidade no discord: ${discord}\n📢 Nosso website está em construção!`, null, 0xbbb7fc, "bold", 0);
    }, 300000); // 5 minutos

    function handleRanks(player: Player) { // Código que trata dos avatars.
        if (!player) { // Proteger contra crash.
            return;
        }
        // Checkar a database por alguém com o mesmo nome.
        const sql = `SELECT * FROM stats WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?`;
        const values = [player.name, process.env.room_id];
        con.query(sql, values, (err: any, result: any) => {
            if (err) throw err;
            if (result.length > 0) {
                if (result && result[0] && result[0].games < 5) {
                    // room.setPlayerAvatar(player.id, "🌱");
                    rankTag[player.id] = ranks[0];
                } else {
                    if (result && result[0]) {
                        if (result[0].elo >= 6200) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[32];
                        } else if (result[0].elo >= 6000) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[31];
                        } else if (result[0].elo >= 5800) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[30];
                        } else if (result[0].elo >= 5600) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[29];
                        } else if (result[0].elo >= 5400) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[28];
                        } else if (result[0].elo >= 5200) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[27];
                        } else if (result[0].elo >= 5000) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[26];
                        } else if (result[0].elo >= 4800) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[25];
                        } else if (result[0].elo >= 4600) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[24];
                        } else if (result[0].elo >= 4400) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[23];
                        } else if (result[0].elo >= 4200) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[22];
                        } else if (result[0].elo >= 4000) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[21];
                        } else if (result[0].elo >= 3800) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[20];
                        } else if (result[0].elo >= 3600) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[19];
                        } else if (result[0].elo >= 3400) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[18];
                        } else if (result[0].elo >= 3200) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[17];
                        } else if (result[0].elo >= 3000) {
                            // room.setPlayerAvatar(player.id, "👑");
                            rankTag[player.id] = ranks[16];
                        } else if (result[0].elo >= 2800) {
                            // room.setPlayerAvatar(player.id, "🏆");
                            rankTag[player.id] = ranks[15];
                        } else if (result[0].elo >= 2600) {
                            // room.setPlayerAvatar(player.id, "🌟");
                            rankTag[player.id] = ranks[14];
                        } else if (result[0].elo >= 2400) {
                            // room.setPlayerAvatar(player.id, "⭐");
                            rankTag[player.id] = ranks[13];
                        } else if (result[0].elo >= 2200) {
                            // room.setPlayerAvatar(player.id, "🏅");
                            rankTag[player.id] = ranks[12];
                        } else if (result[0].elo >= 2000) {
                            // room.setPlayerAvatar(player.id, "🥇");
                            rankTag[player.id] = ranks[11];
                        } else if (result[0].elo >= 1800) {
                            // room.setPlayerAvatar(player.id, "🥈");
                            rankTag[player.id] = ranks[10];
                        } else if (result[0].elo >= 1600) {
                            // room.setPlayerAvatar(player.id, "🥉");
                            rankTag[player.id] = ranks[9];
                        } else if (result[0].elo >= 1400) {
                            // room.setPlayerAvatar(player.id, "🐓");
                            rankTag[player.id] = ranks[8];
                        } else if (result[0].elo >= 1200) {
                            // room.setPlayerAvatar(player.id, "🐥");
                            rankTag[player.id] = ranks[7];
                        } else if (result[0].elo >= 1000) {
                            // room.setPlayerAvatar(player.id, "🐣");
                            rankTag[player.id] = ranks[6];
                        } else if (result[0].elo >= 800) {
                            // room.setPlayerAvatar(player.id, "🥚");
                            rankTag[player.id] = ranks[5];
                        } else if (result[0].elo >= 600) {
                            // room.setPlayerAvatar(player.id, "🕳️");
                            rankTag[player.id] = ranks[4];
                        } else if (result[0].elo >= 400) {
                            // room.setPlayerAvatar(player.id, "💀");
                            rankTag[player.id] = ranks[3];
                        } else if (result[0].elo >= 200) {
                            // room.setPlayerAvatar(player.id, "☠️");
                            rankTag[player.id] = ranks[2];
                        } else {
                            // room.setPlayerAvatar(player.id, "⚰️");
                            rankTag[player.id] = ranks[1];
                        }
                    }
                }
            }
        });
    }

    //                          Quando o player entra                        //

    room.onPlayerJoin = (player: any) => {
        // Log Entradas
        entrada(player);

        var conn = player.conn;
        var ipv4 = decryptHex(conn);

        const playerList = room.getPlayerList();
        updateNumberOfPlayers(playerList);

        // Guardar variáveis locais.
        playerConnections.set(player.id, player.conn);
        playerAuth.set(player.id, player.auth);
        playerIpv4.set(player.id, ipv4);

        superadmin[player.id] = 0;
        gerentes[player.id] = 0;
        admins[player.id] = 0;
        mods[player.id] = 0;
        vips[player.id] = 0;
        premiums[player.id] = 0;
        legends[player.id] = 0;

        console.log(`${player.name} entrou na sala.`);

        setTimeout(() => { // Timeout para apenas checkar os bans após 15ms para não haver ghost logins.
            // Checkar nomes, conn e auth por ban.
            con.query(`SELECT * FROM bans WHERE name = ? OR conn = ? OR auth = ? OR ipv4 = ?`, [player.name, player.conn, player.auth, ipv4], (err: any, result: any) => {
                if (err) throw err;
                if (result.length > 0) {
                    for (const ban of result) {
                        // Reduzir tamanho da data.
                        const banEndTime = new Date(ban.time);
                        const formattedBanEndTime = banEndTime.toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                        });
                        const now = Date.now();
                        if (now < new Date(banEndTime).getTime()) {
                            room.kickPlayer(player.id, `🩸 Você está banido até ${formattedBanEndTime}. Motivo: ${ban.reason}`);
                            console.log(`${player.name} Levou kick porque está banido.`);
                            break;
                        }
                    }
                }
            });
        }, 15); // 15 ms para não bugar login automático, otherwise fica com o login na db.

        // Checkar se o jogador está mute pelo nome, conn ou auth, se sim, definir na variável local :)
        con.query(`SELECT * FROM mutes WHERE name = ? OR conn = ? OR auth = ?`, [player.name, player.conn, player.auth], (err: any, result: any) => {
            if (err) throw err;
            if (result.length > 0) {
                for (const mute of result) {
                    const muteEndTime = new Date(mute.time).getTime();
                    const now = Date.now();
                    if (now < muteEndTime) {
                        isMuted[player.id] = true
                        break;
                    }
                }
            }
        });

        // Evitar double login.
        // Checkar o nome na DB.
        var conn = playerConnections.get(player.id);
        var ipv4 = decryptHex(conn);

        activePlayers = room.getPlayerList().filter((p: Player) => {
            return !afkStatus[p.id];
        });
        loggedInPlayers[player.id] = false;
        con.query(`SELECT * FROM players WHERE name = ?`, [player.name], (err: any, result: any) => {
            if (err) throw err;
            if (result.length > 0) {
                if (result[0].password) {
                    // Timer para kick se não fizer login.
                    timeoutIds[player.id] = setTimeout(() => {
                        // Se o timer acabar leva kick.
                        room.kickPlayer(player.id, "🩸 Tempo esgotado para login.");
                        // Mostrar a razão na consola.
                        // console.log(`${player.name} Foi expulso da sala porque excedeu o limite de tempo para registro/login.`); // Isto por vezes aparece erróneamente porém eu não tenho pachorra para limpar este cadito de código :)
                    }, 45000); // 45 segundos
                } else { //Caso exista player mas não tenha senha
                    room.sendAnnouncement(`🩸 Bem-vindo, ${player.name}! Se registre usando o seguinte comando: !registrar <senha>`, player.id, 0xFF0000, "bold");
                    room.sendAnnouncement(`🩸 Digite !help para ver todos os comandos disponíveis na sala, em caso de dúvida digite: !help <comando>`, player.id, 0xFFFFFF, "bold");
                    room.sendAnnouncement(`👥 Não se esqueça de entrar no nosso discord: ${discord}`, player.id, 0xFFFFFF, "bold");
                }

                const playerId = player.id;
                const sql = `UPDATE players SET game_id = ?, conn = ?, ipv4 = ?, loggedIn = 1 WHERE LOWER(name) = LOWER(?)`;
                const values = [playerId, conn, ipv4, player.name];

                con.query(sql, values, (err: any) => {
                    if (err) throw err;
                    handleRanks(player); // Definir avatar.

                    if (result[0].password && result[0].auth === player.auth) {
                        loggedInPlayers[player.id] = true;

                        if (result[0].ceo === 1) {
                            room.setPlayerAdmin(player.id, true);
                            room.sendAnnouncement(`👑 ${player.name} Você recebeu o cargo de CEO automaticamente.`, player.id, 0xFFA500, "bold");
                            superadmin[player.id] = 1;
                        }
                        if (result[0].gerente === 1) {
                            room.setPlayerAdmin(player.id, true);
                            room.sendAnnouncement(`🔥 ${player.name} Você recebeu o cargo de Gerente automaticamente.`, player.id, 0xFFA500, "bold");
                            gerentes[player.id] = 1;
                        }
                        if (result[0].admin === 1) {
                            room.setPlayerAdmin(player.id, true);
                            room.sendAnnouncement(`🚧 ${player.name} Você recebeu o cargo de administrador automaticamente.`, player.id, 0xFFA500, "bold");
                            admins[player.id] = 1;
                        }
                        if (result[0].mod === 1) {
                            room.setPlayerAdmin(player.id, true);
                            room.sendAnnouncement(`🚧 ${player.name} Você recebeu o cargo de moderador automaticamente.`, player.id, 0xFFA500, "bold");
                            mods[player.id] = 1;
                        }

                        if (result[0].vip === 1) {
                            room.sendAnnouncement(`💎 ${player.name}, seja bem vindo Vip!`, player.id, cores.ciano, "bold");
                            vips[player.id] = 1;
                        }
                        if (result[0].vip === 2) {
                            room.sendAnnouncement(`🔰 ${player.name}, seja bem vindo Premium!`, player.id, cores.coral, "bold");
                            premiums[player.id] = 1;
                        }
                        if (result[0].vip === 3) {
                            room.sendAnnouncement(`🌋 ${player.name}, seja bem vindo Legend!`, player.id, cores.violeta, "bold");
                            legends[player.id] = 1;
                        }

                        console.log(`${player.name} logou automaticamente.`);
                        room.sendAnnouncement(`🩸 Você logou automaticamente. Bem-vindo(a) de volta ${player.name}!`, player.id, 0xFF0000, "bold");
                        room.sendAnnouncement(`🩸 Digite !help para ver todos os comandos disponíveis na sala, em caso de dúvida digite: !help <comando>`, player.id, 0xFFFFFF, "bold");
                        room.sendAnnouncement(`👥 Não se esqueça de entrar no nosso discord: ${discord}`, player.id, 0xFFFFFF, "bold");
                        // Limpar timeout.
                        if (timeoutIds[player.id]) {
                            clearTimeout(timeoutIds[player.id]);
                            delete timeoutIds[player.id];
                        }
                    } else {
                        if (result[0].password) {
                            room.sendAnnouncement(`🩸 Olá ${player.name}, para ter acesso aos outros comandos digite: !login seguido pela sua senha (Ex: !login 1234).`, player.id, 0xFF0000, "bold");
                            room.sendAnnouncement(`🩸 Digite !help para ver todos os comandos disponíveis na sala, em caso de dúvida digite: !help <comando>`, player.id, 0xFFFFFF, "bold");
                            room.sendAnnouncement(`👥 Não se esqueça de entrar no nosso discord: ${discord}`, player.id, 0xFFFFFF, "bold");
                        }
                    }
                });
            } else {
                // O nome não está registado, pedir ao usuário para se registar.
                room.sendAnnouncement(`🩸 Bem-vindo, ${player.name}! Se registre usando o seguinte comando: !registrar <senha>`, player.id, 0xFF0000, "bold");
                room.sendAnnouncement(`🩸 Digite !help para ver todos os comandos disponíveis na sala, em caso de dúvida digite: !help <comando>`, player.id, 0xFFFFFF, "bold");
                room.sendAnnouncement(`👥 Não se esqueça de entrar no nosso discord: ${discord}`, player.id, 0xFFFFFF, "bold");
                const auth = playerAuth.get(player.id);
                const sql = `INSERT INTO players (game_id, name, password, loggedIn, conn, ipv4, auth) VALUES (?,?,?,?,?,?,?)`;
                const values = [player.id, player.name, null, 1, conn, ipv4, auth];
                con.query(sql, values, (err: any) => {
                    if (err) throw err;
                    handleRanks(player); // Definir avatar.
                });
            }
        });

        // Proteção do double login :D
        const sql2 = `SELECT game_id FROM players WHERE LOWER(name) = LOWER(?) OR ipv4 = ?`;
        const values2 = [player.name, ipv4];
        con.query(sql2, values2, (err: any, result: { game_id: number; }[]) => {
            if (err) throw err;
            if (result.length === 0) {
                // Usuário não registado, deixar entrar, pois é impossível estar com login feito, se o mesmo não existe.
            }
            // else if (result[0].game_id !== 0 && !process.env.debug) {
            //     room.kickPlayer(player.id, "🩸 Você já está conectado em outra conta.");
            // }
        });

        const sql3 = `SELECT * FROM stats WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?`;
        con.query(sql3, [player.name, process.env.room_id], (err: any, result: any) => {
            if (err) throw err;
            if (result.length === 0) {
                const sql4 = `INSERT INTO stats (player_id, room_id) VALUES ((SELECT id FROM players WHERE LOWER(name) = LOWER(?)), ?)`;
                con.query(sql4, [player.name, process.env.room_id], (err: any) => {
                    if (err) throw err;
                });
            }
        });

        setTimeout(() => {
            updateRoleOnPlayerIn();
        }, 30);
    }

    const Team = {
        SPECTATORS: 0,
        RED: 1,
        BLUE: 2
    };

    const State = { PLAY: 0, PAUSE: 1, STOP: 2 };
    var gameState = State.STOP;
    var unpauseTimeout: any;
    var allowAFK: boolean = true;
    var resettingTeams: boolean = false;
    var inChooseMode: boolean = false;
    var endGameVariable: boolean = false;
    var players: Player[];

    var slowMode: number = 0;
    var timeOutCap: NodeJS.Timeout;
    var redCaptainChoice: string = "";
    var blueCaptainChoice: string = "";
    var chooseTime: number = 12;

    function updateRoleOnPlayerIn() {
        updateTeams();
        if (inChooseMode) {
            getSpecList(teamR.length <= teamB.length ? teamR[0] : teamB[0]);
        }
        balanceTeams();
    }

    function updateRoleOnPlayerOut() {
        updateTeams();

        if (inChooseMode) {
            if ((teamR.length == 0 || teamB.length == 0) && teamS.length > 0) {
                teamR.length == 0 ? room.setPlayerTeam(teamS[0].id, Team.RED) : room.setPlayerTeam(teamS[0].id, Team.BLUE);
                return;
            }
            if (teamS.length > 0 && Math.abs(teamR.length - teamB.length) == teamS.length) {
                room.sendAnnouncement("Sem opções restantes, deixa que eu escolho...", 0xFF0000, 'bold');
                deactivateChooseMode();
                resumeGame();
                var b = teamS.length;
                if (teamR.length > teamB.length) {
                    for (var i = 0; i < b; i++) {
                        setTimeout(() => {
                            room.setPlayerTeam(teamS[0].id, Team.BLUE);
                        }, 5 * i);
                    }
                } else {
                    for (var i = 0; i < b; i++) {
                        setTimeout(() => {
                            room.setPlayerTeam(teamS[0].id, Team.RED);
                        }, 5 * i);
                    }
                }
                return;
            }
            if (winstreak == 0 && room.getScores() == null) {
                if (Math.abs(teamR.length - teamB.length) == 2) { //se alguém saiu de um time com 2 jogadores a mais que o outro, coloca o último jogador de volta em seu lugar para que seja justo
                    room.sendAnnouncement("Equilibrando times...", null, 0xFF0000, 'bold');
                    teamR.length > teamB.length ? room.setPlayerTeam(teamR[teamR.length - 1].id, Team.SPECTATORS) : room.setPlayerTeam(teamB[teamB.length - 1].id, Team.SPECTATORS);
                }
            }
            if (teamR.length == teamB.length && teamS.length < 2) {
                deactivateChooseMode();
                resumeGame();
                return;
            }
            capLeft ? choosePlayer() : getSpecList(teamR.length <= teamB.length ? teamR[0] : teamB[0]);
        }
        balanceTeams();
    }

    function updateTeams() { // update the players' list and all the teams' list
        players = room.getPlayerList().filter((player: Player) => player.id != 0 && !afkStatus[player.id]);
        teamR = players.filter(p => p.team === Team.RED);
        teamB = players.filter(p => p.team === Team.BLUE);
        teamS = players.filter(p => p.team === Team.SPECTATORS);
    }

    function getSpecList(player: Player) {

        if (teamB.length == 0) {
            if (!endGameVariable) {
                room.setPlayerTeam(teamS[0].id, Team.BLUE);
            }
            gambiarrabug(1);
            return;
        }
        if (teamR.length == 0) {
            if (!endGameVariable) {
                room.setPlayerTeam(teamS[0].id, Team.RED);
            }
            gambiarrabug(2);
            return;
        }
        var cstm = "Jogadores: ";
        for (var i = 0; i < teamS.length; i++) {
            if (140 - cstm.length < (teamS[i].name + "[" + (i + 1) + "], ").length) {
                room.sendAnnouncement(cstm, player.id, 0xFFFFFF, 'bold');
                cstm = "... ";
            }
            cstm += teamS[i].name + "[" + (i + 1) + "], ";
        }

        cstm = cstm.substring(0, cstm.length - 2);
        cstm += ".";
        room.sendAnnouncement(cstm, player.id, 0xFFFFFF, 'bold');
    }

    function balanceTeams() {
        if (!inChooseMode) {
            if (players.length == 1 && teamR.length == 0) { // 1 player
                quickRestart();
                room.setPlayerTeam(players[0].id, Team.RED);
            } else if (Math.abs(teamR.length - teamB.length) == teamS.length && teamS.length > 0) { // spec players supply required players
                const n = Math.abs(teamR.length - teamB.length);
                if (teamR.length > teamB.length) {
                    for (var i = 0; i < n; i++) {
                        room.setPlayerTeam(teamS[i].id, Team.BLUE);
                    }
                } else {
                    for (var i = 0; i < n; i++) {
                        room.setPlayerTeam(teamS[i].id, Team.RED);
                    }
                }
            } else if (Math.abs(teamR.length - teamB.length) > teamS.length && players.length > 1) { //no sufficient players
                const n = Math.abs(teamR.length - teamB.length);
                if (players.length == 1) {
                    quickRestart();
                    room.setPlayerTeam(players[0].id, Team.RED);
                    return;
                } else if (players.length == 6) {
                    quickRestart();
                }
                // if (players.length == getMaxTeamSize() * 2 - 1) {
                //     allReds = [];
                //     allBlues = [];
                // }
                if (teamR.length > teamB.length) {
                    for (var i = 0; i < n; i++) {
                        room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
                    }
                } else {
                    for (var i = 0; i < n; i++) {
                        room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
                    }
                }
            } else if (Math.abs(teamR.length - teamB.length) < teamS.length && teamR.length != teamB.length) { //choose mode
                room.pauseGame(true);
                activateChooseMode();
                choosePlayer();
            } else if (teamS.length >= 2 && teamR.length == teamB.length && teamR.length < getMaxTeamSize()) { //2 in red 2 in blue and 2 or more spec
                if (teamR.length == 2) {
                    quickRestart();
                }
                topBtn();
            }
        }
        if (players.length == 0) {
            room.stopGame();
        }
    }

    function choosePlayer() {
        clearTimeout(timeOutCap);
        if (teamR.length <= teamB.length && teamR.length != 0) {
            room.sendAnnouncement("Para escolher um player, insira seu número da lista ou use 'top', 'random' ou 'bottom'.", teamR[0].id, 0xFF0000, 'bold');
            timeOutCap = setTimeout(function (player) {
                room.sendAnnouncement("Vai rápido @" + player.name + ", apenas " + chooseTime / 2 + " segundos restantes para escolher!", player.id, 0xFFA500, 'bold');
                timeOutCap = setTimeout(function (player) {
                    room.kickPlayer(player.id, "Você não escolheu a tempo!", false);
                }, chooseTime * 500, teamR[0]);
            }, chooseTime * 1000, teamR[0]);
        } else if (teamB.length < teamR.length && teamB.length != 0) {
            room.sendAnnouncement("Para escolher um jogador, insira seu número da lista ou use 'top', 'random' ou 'bottom'.", teamB[0].id, 0xFF0000, 'bold');
            timeOutCap = setTimeout(function (player) {
                room.sendAnnouncement("Vai rápido @" + player.name + ", apenas " + chooseTime / 2 + " segundos restantes para escolher!", player.id, 0xFFA500, 'bold');
                timeOutCap = setTimeout(function (player) {
                    room.kickPlayer(player.id, "Você não escolheu a tempo!", false);
                }, chooseTime * 500, teamB[0]);
            }, chooseTime * 1000, teamB[0]);
        }
        if (teamR.length != 0 && teamB.length != 0) getSpecList(teamR.length <= teamB.length ? teamR[0] : teamB[0]);
    }

    function topBtn() {
        if (teamS.length == 0) {
            return;
        } else {
            if (teamR.length == teamB.length) {
                if (teamS.length > 1) {
                    room.setPlayerTeam(teamS[0].id, Team.RED);
                    room.setPlayerTeam(teamS[1].id, Team.BLUE);
                }
                return;
            } else if (teamR.length < teamB.length) {
                room.setPlayerTeam(teamS[0].id, Team.RED);
            } else {
                room.setPlayerTeam(teamS[0].id, Team.BLUE);
            }
        }
    }

    function randomBtn() {
        if (teamS.length == 0) {
            return;
        } else {
            if (teamR.length == teamB.length) {
                if (teamS.length > 1) {
                    var r = getRandomInt(teamS.length);
                    room.setPlayerTeam(teamS[r].id, Team.RED);
                    teamS = teamS.filter((spec) => spec.id != teamS[r].id);
                    room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
                }
                return;
            } else if (teamR.length < teamB.length) {
                room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.RED);
            } else {
                room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
            }
        }
    }

    function blueToSpecBtn() {
        resettingTeams = true;
        setTimeout(() => {
            resettingTeams = false;
        }, 100);
        for (var i = 0; i < teamB.length; i++) {
            room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
        }
    }

    function redToSpecBtn() {
        resettingTeams = true;
        setTimeout(() => {
            resettingTeams = false;
        }, 100);
        for (var i = 0; i < teamR.length; i++) {
            room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
        }
    }

    function resetBtn() {
        resettingTeams = true;
        setTimeout(() => {
            resettingTeams = false;
        }, 100);
        if (teamR.length <= teamB.length) {
            for (var i = 0; i < teamR.length; i++) {
                room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
                room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
            }
            for (var i = teamR.length; i < teamB.length; i++) {
                room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
            }
        } else {
            for (var i = 0; i < teamB.length; i++) {
                room.setPlayerTeam(teamB[teamB.length - 1 - i].id, Team.SPECTATORS);
                room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
            }
            for (var i = teamB.length; i < teamR.length; i++) {
                room.setPlayerTeam(teamR[teamR.length - 1 - i].id, Team.SPECTATORS);
            }
        }
    }

    function blueToRedBtn() {
        resettingTeams = true;
        setTimeout(() => {
            resettingTeams = false;
        }, 100);
        for (var i = 0; i < teamB.length; i++) {
            room.setPlayerTeam(teamB[i].id, Team.RED);
        }
        // swapUniform();
    }

    function getMaxTeamSize(): number {
        return Number(process.env.maxTeamSize);
    }

    function activateChooseMode() {
        inChooseMode = true;
        slowMode = 2;
        room.sendAnnouncement("Modo lento ativado de 2 segundos!", 0xFF0000, 'bold');
    }

    function deactivateChooseMode() {
        inChooseMode = false;
        clearTimeout(timeOutCap);
        if (slowMode != 0) {
            slowMode = 0;
            room.sendAnnouncement("Fim do modo lento", 0xFF0000, 'bold');
        }
        redCaptainChoice = "";
        blueCaptainChoice = "";
    }

    function quickRestart() {
        room.stopGame();
        setTimeout(() => {
            room.startGame();
        }, 2000);
    }

    function gambiarrabug(num: number) {
        if (num == 1) {
            setTimeout(() => {
                getSpecList(teamB[0]);
            }, 100);
            return;
        }
        if (num == 2) {
            setTimeout(() => {
                getSpecList(teamR[0]);
            }, 100);
            return;
        }
    }

    //             Função AFK a meio do jogo            //

    const activities: { [key: string]: number } = {}; // Verificar quando foi a última atividade.
    var AFKTimeout = 12000; // 10 segundos afk = kick
    let lastWarningTime: number = 0; // Mandar avisos de kick

    function afkKick() {
        activePlayers = room.getPlayerList().filter((p: Player) => {
            return !afkStatus[p.id] && p.team > 0;
        });
        const redTeam = activePlayers.filter((p: { team: number; }) => p.team === 1);
        const blueTeam = activePlayers.filter((p: { team: number; }) => p.team === 2);
        if (redTeam.length >= 2 && blueTeam.length >= 2) { // Levar kick caso estejam X jogadores em cada equipe.
            for (const p of activePlayers) {
                if (p.team !== 0) {
                    if (Date.now() - activities[p.id] > AFKTimeout) {
                        room.kickPlayer(p.id, "🩸 Inatividade detectada!");

                    } else if (Date.now() - activities[p.id] > AFKTimeout - 6000) {
                        if (Date.now() - lastWarningTime > 2000) {
                            room.sendAnnouncement("🩸 Você vai ser kickado por inatividade, se mova ou escreva algo para evitar ser kickado.", p.id, 0xFFA500, "bold", 2);
                            lastWarningTime = Date.now();
                        }
                    }
                }
            }
        }
    }

    room.onGamePause = function (player: { id: string | number; } | null) {
        // Atividades
        if (player != null) {
            activities[player.id] = Date.now();
        }
        // Não permitir pausar o jogo.
        // room.pauseGame(false);
        gameState = State.PAUSE;
    }

    room.onGameUnpause = function (player: { id: string | number; } | null) {
        unpauseTimeout = setTimeout(() => {
            gameState = State.PLAY;
        }, 2000);
        // Atividade
        let playersGaming = room.getPlayerList().filter((p: Player) => p.team > 0);
        playersGaming.forEach((p: Player) => {
            activities[p.id] = Date.now();
        });
    }

    room.onPositionsReset = function () {
        // Atividade
        for (var i = 0; i < activePlayers.length; i++) {
            activities[activePlayers[i].id] = Date.now();
        }
    }

    room.onPlayerActivity = function (player: { id: string | number; }) {
        // Atividade
        activities[player.id] = Date.now();
    }

    // Remover ban automaticamente.
    room.onPlayerKicked = () => {
        // room.clearBans();
    }

    //                                    CHAT                                      //

    var lastCallAdminTime: any = 0;
    var callCount: any = 0;
    var bloquear_comando: any = [];

    function getDate() {
        let data = new Date(),
            dia = data.getDate().toString().padStart(2, '0'),
            mes = (data.getMonth() + 1).toString().padStart(2, '0'),
            ano = data.getFullYear(),
            horas = data.getHours().toString().padStart(2, '0'),
            minutos = data.getMinutes().toString().padStart(2, '0');
        return `${dia}-${mes}-${ano}-${horas}h${minutos}m`;
    }

    async function automod(player: any, response: any) {
        try {
            var motivo: any = "";
            var autoModBot = "AUTOMOD"

            if (response === 1) {
                motivo = "Racismo";
            } else if (response === 2) {
                motivo = "Apologia ao suicídio";
            }

            // Checkar a database por alguém com o mesmo nome da pessoa em questão.
            const sql2 = `SELECT * FROM players WHERE LOWER(name) = LOWER(?)`;
            const values2 = [player.name];
            con.query(sql2, values2, (err: any, result: any) => {
                if (err) throw err;
                if (result.length > 0) {
                    if (loggedInPlayers[player.id] && result[0].ceo === 1) {
                        const name = player.name;

                        var timeStr: any;

                        if (response === 1) {
                            timeStr = '9999d'
                        } else if (response === 2) {
                            timeStr = '7d'
                        }

                        const timeRegex = /^(\d+)([a-zA-Z]+)$/;
                        if (!timeStr) {
                            return;
                        }
                        const match = timeStr.match(timeRegex);

                        if (match) {
                            const duration = parseInt(match[1]);
                            const unit = match[2];
                            let banDuration = 0;
                            switch (unit) {
                                case "d":
                                    banDuration = duration * 24 * 60 * 60 * 1000;
                                    break;
                                case "h":
                                    banDuration = duration * 60 * 60 * 1000;
                                    break;
                                case "m":
                                    banDuration = duration * 60 * 1000;
                                    break;
                                case "s":
                                    banDuration = duration * 1000;
                                    break;
                                default:
                                    room.sendAnnouncement("🩸 Formato de tempo inválido. Use um número seguido de d (Dias), h (Horas), m (Minutos), ou s (Segundos)", player.id, 0xFF0000, "bold", 2);
                                    return;
                            }

                            const banEndTime = new Date(Date.now() + banDuration);
                            const banEndTimeFormatted = banEndTime.toISOString().slice(0, 19).replace('T', ' '); // Dar replace da data para um valor readable
                            const formattedBanEndTime = banEndTime.toLocaleDateString('pt-BR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric'
                            });
                            const targetPlayer = room.getPlayerList().find((p: Player) => p.name === name);
                            const conn = targetPlayer && playerConnections.get(targetPlayer.id);
                            const auth = targetPlayer && playerAuth.get(targetPlayer.id);
                            const ipv4 = targetPlayer && playerIpv4.get(targetPlayer.id);

                            const conn2 = player.conn;
                            const auth2 = player.auth;

                            // Se o jogador estiver On.
                            if (targetPlayer) {
                                // Inserir a informação do ban na database.
                                const sql = `INSERT INTO bans (name, time, reason, banned_by, conn, ipv4, auth) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                                const values = [name, banEndTimeFormatted, motivo, autoModBot, conn, ipv4, auth];
                                con.query(sql, values, (err: any, result: any) => {
                                    if (err) throw err;
                                    room.kickPlayer(targetPlayer.id, `🩸 Você foi banido. Motivo: ${motivo} até ${formattedBanEndTime}.`);
                                    room.sendAnnouncement(`[🤖 AUTOMOD] ${player.name} Foi banido!`, null, cores.vermelho, "bold", 2);
                                });

                                if (config.canais.punicoes && config.canais.punicoes !== "") {
                                    var embedPunicao = new EmbedBuilder()
                                        .setTitle(`O jogador **${player.name} foi banido!**`)
                                        .setDescription(`🚧 Informações do banimento:`)
                                        .addFields(
                                            { name: 'Banido por', value: `[🤖 AUTOMOD]` },
                                            { name: 'Nick/ID', value: `${player.name}#${player.id}` },
                                            { name: 'Motivo', value: `${motivo}` },
                                            { name: 'Tempo de banimento', value: `Até ${formattedBanEndTime}` },
                                        )
                                        .setColor('Red')
                                        .setFooter({ text: `Data & Hora: ${getDate()}` })

                                    client.send(config.canais.punicoes, [embedPunicao], true);
                                }
                                // Se não estiver on.
                            } else {
                                const sql = `INSERT INTO bans (name, time, reason, banned_by, conn, ipv4, auth) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                                const values = [name, banEndTimeFormatted, motivo, autoModBot, conn2, ipv4, auth2];
                                con.query(sql, values, (err: any, result: any) => {
                                    if (err) throw err;
                                    room.sendAnnouncement(`[🤖 AUTOMOD] ${player.name} Foi banido!`, null, cores.vermelho, "bold", 2);

                                    if (config.canais.punicoes && config.canais.punicoes !== "") {
                                        var embedPunicao = new EmbedBuilder()
                                            .setTitle(`O jogador **${player.name} foi banido!**`)
                                            .setDescription(`🚧 Informações do banimento:`)
                                            .addFields(
                                                { name: 'Banido por', value: `[🤖 AUTOMOD]` },
                                                { name: 'Nick/ID', value: `${player.name}#${player.id}` },
                                                { name: 'Motivo', value: `${motivo}` },
                                                { name: 'Tempo de banimento', value: `Até ${formattedBanEndTime}` },
                                            )
                                            .setColor('Red')
                                            .setFooter({ text: `Data & Hora: ${getDate()}` })

                                        client.send(config.canais.punicoes, [embedPunicao], true);
                                    }
                                });
                            }
                        }
                    }
                }
            });
        } catch (err) {
            error(`Erro no automod: `, err)
        }
    }


    room.onPlayerChat = (player: any, message: string) => {
        if (message.match(regexRacismo)) {
            automod(player, 1);
        }
        if (message.match(regexSuicidio)) {
            automod(player, 2);
        }

        // Logs sem os !comandos.
        if (!message.startsWith("!")) {
            var Hora = new Date(Date.now());
            var HoraFormatada = Hora.toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
            });
            // console.log(`${HoraFormatada} | ${player.name}: ${message}`); // Colocar no cmd.
            /* fs.appendFile('./logs/chat.txt', `${HoraFormatada} | ${player.name}: ${message}\n`, (err: any) => { // Colocar no chat.txt
                if (err) throw err;
            }); */
            if (roomLogChannel != null) {
                try {
                    client.send(roomLogChannel, `> ||${HoraFormatada}|| ${player.name} (#${player.id}): ${message}`);
                } catch (err) {
                    error(`LogChat`, error);
                }
            }
        }
        // Jogador escreveu, adicionar atividade recente.
        activities[player.id] = Date.now();
        // Comandos
        if (message.startsWith("!")) {
            const words = message.split(" ");
            /* const comando = words[0].toLowerCase();

            const equipe = uniformes.find((equipe: EquipeUniforme) => equipe.shortName.toLowerCase() === comando || equipe.longName.toLowerCase() === comando);

            if (equipe) {
                const uniform = equipe.uniform;
                room.setTeamColors(player.team, ...uniform);
                return false;
            } */


            // Comando de registro
            if (words[0] === "!registrar" || words[0] === "!register") {
                if (loggedInPlayers[player.id]) { //Não tem porque executar selects se a variável indica que ele esta logado é porque tem registro.
                    room.sendAnnouncement(`🩸 ${player.name} Você já está logado.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                const password = words[1];
                if (!password) {
                    room.sendAnnouncement(`🩸 ${player.name}, você precisa colocar uma senha depois do !registrar. (Ex: !registrar 1234)`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                if (password.length < 3) {
                    room.sendAnnouncement(`🩸 ${player.name} A senha deve ter pelo menos 3 caracteres.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                const conn = playerConnections.get(player.id);
                const auth = playerAuth.get(player.id);
                /*
                    Se essa validação for realmente ficar: removi o ipv4 pois é o mesmo que a conn só que desencriptado
                    Validei o auth também já que o ip do jogador pode mudar, o auth também pode mas provvelmente não se estiver do mesmo app.
                    Também adicionei para validar se tem senha para saber se esses nicks são registrados
                */
                const sql = `SELECT COUNT(*) as count FROM players WHERE (conn = ? OR auth = ?) AND password IS NOT NULL`;
                const values = [conn, auth];
                con.query(sql, values, (err: any, result: any) => {
                    if (err) throw err;
                    if (result[0].count >= 1) {
                        room.sendAnnouncement(`🩸 ${player.name} Você já tem uma conta registrada.`, player.id, 0xFF0000, "bold", 2);
                        console.log(`O usuário ${player.name} tentou se registrar, porém já tem 2 contas. CONN: ${conn}`);
                    } else {
                        const sql = `SELECT * FROM players WHERE LOWER(name) = LOWER(?) AND password IS NOT NULL`;
                        const values = [player.name];
                        con.query(sql, values, (err: any, result: any) => {
                            if (err) throw err;
                            if (result.length > 0) {
                                // Nome do jogador já está na database :(
                                room.sendAnnouncement(`🩸 ${player.name} Já existe uma conta com este nome registrada. Por favor troque o seu nome no haxball ou faça login com o seguinte comando: !login seguido pela sua senha.`, player.id, 0xFF0000, "bold", 2);
                            } else {
                                // O nome do jogador não está na database, siga siga registar :D
                                bcrypt.hash(password, 10, (err: any, hashedPassword: any) => {
                                    if (err) throw err;
                                    const sql = `UPDATE players SET password = ?, loggedIn = 1 WHERE LOWER(name) = LOWER(?)`;
                                    const values = [hashedPassword, player.name];
                                    con.query(sql, values, (err: any) => {
                                        if (err) throw err;
                                        console.log(`Novo registro: ${player.name}`);
                                        room.sendAnnouncement(`🩸 ${player.name} o seu registro foi concluído com sucesso!`, player.id, 0xFF0000, "bold");
                                        room.sendAnnouncement(`🩸 Digite !help para ver os comandos disponíveis na sala, em caso de dúvida com algum comando digite: !help <comando>`, player.id, 0xFFFFFF, "bold");
                                        room.sendAnnouncement(`👥 Não se esqueça de entrar no nosso discord: ${discord}`, player.id, 0xFFFFFF, "bold");
                                        loggedInPlayers[player.id] = true;
                                    });
                                });
                            }
                        });
                    }
                });
                // Comando de Login
            } else if (words[0] === "!furar") {
                if (vips[player.id] === 1 || premiums[player.id] === 1 || legends[player.id] === 1) {
                    if (player.team == 0) {
                        if (gameState == State.PLAY) {
                            con.query(`SELECT * FROM players WHERE name = ?`, [player.name], (err: any, result: any) => {
                                if (err) throw err;

                                if (result.length > 0) {
                                    var tipoVip: any = result[0].vip;

                                    if (result[0].furar === 0) {
                                        con.query(`UPDATE players SET furar = 1 WHERE name = ?`, [player.name], (err2: any, result2: any) => {
                                            if (err2) {
                                                console.error(err2);
                                                return false;
                                            }
                                        });

                                        var tagFurar: any = "";

                                        if (result[0].vip === 1) tagFurar = "Vip";
                                        if (result[0].vip === 2) tagFurar = "Premium";
                                        if (result[0].vip === 3) tagFurar = "Legend";

                                        room.reorderPlayers([player.id], true);
                                        room.sendAnnouncement(`O jogador ${tagFurar} ${player.name} furou a fila!`, null, 0xFFA500, 'bold', 2);

                                        let x = tipoVip == 1 ? 30 : tipoVip == 2 ? 20 : 10

                                        setTimeout(() => {
                                            con.query(`UPDATE players SET furar = 0 WHERE name = ?`, [player.name], (err2: any, result2: any) => {
                                                if (err2) {
                                                    console.error(err2);
                                                    return false;
                                                }
                                            });
                                        }, x * 60 * 1000);

                                        return false;
                                    } else {
                                        let msgErro = tipoVip == 1 ? '30' : tipoVip == 2 ? '20' : '10'
                                        room.sendAnnouncement(`Você só pode pular a fila a cada ${msgErro} minutos!`,
                                            player.id, cores.vermelho, 'bold', 2);
                                        return false;
                                    }
                                } else {
                                    room.sendAnnouncement(`Ocorreu um erro ao tentar furar a fila, se o erro persistir contate algum administrador!`, player.id, cores.vermelho, "bold", 2);
                                    return false;
                                }
                            });
                        } else {
                            room.sendAnnouncement(`Você só pode pular a fila com o jogo em andamento!`,
                                player.id, cores.vermelho, 'bold', 2);
                            return false
                        }
                    } else {
                        room.sendAnnouncement(`Você precisa estar na fila de espectador para usar este comando!`, player.id, cores.vermelho, 'bold', 2);
                        return false;
                    }
                } else {
                    room.sendAnnouncement(`Você precisa ser um vip para usar esse comando`, player.id, cores.vermelho, "bold", 2);
                    return false;
                }
            } else if (words[0] === "!p") {
                if (vips[player.id] === 1 || premiums[player.id] === 1 || legends[player.id] === 1) {
                    con.query(`SELECT * FROM players WHERE name = ?`, [player.name], (err: any, result: any) => {
                        if (err) throw err;

                        if (result.length > 0) {
                            if (player.team != 0) {
                                if (gameState == State.PLAY) {
                                    if (result[0].pause === 0) {
                                        var tipoVip: any = result[0].vip;
                                        var tagPause: any = "";

                                        if (result[0].vip === 1) tagPause = "Vip";
                                        if (result[0].vip === 2) tagPause = "Premium";
                                        if (result[0].vip === 3) tagPause = "Legend";

                                        vipPausou.push(player.name)
                                        con.query(`UPDATE players SET pause = 1 WHERE name = ?`, [player.name], (err2: any, result2: any) => {
                                            if (err2) {
                                                console.error(err2);
                                                return false;
                                            }
                                        });

                                        room.pauseGame(true);

                                        setTimeout(() => {
                                            if (State.PAUSE) {
                                                room.pauseGame(false);
                                                room.sendAnnouncement(`Jogo despausado!`, null, 0xFF0000, 'bold', 2);
                                            }
                                            vipPausou.splice(vipPausou.indexOf(player.name), 1)
                                        }, tipoVip == 1 ? 10000 : (tipoVip == 2 ? 15000 : 30000));

                                        setTimeout(() => {
                                            con.query(`UPDATE players SET pause = 0 WHERE name = ?`, [player.name], (err2: any, result2: any) => {
                                                if (err2) {
                                                    console.error(err2);
                                                    return false;
                                                }
                                            });
                                        }, tipoVip == 1 ? 30 * 60 * 1000 : 5 * 60 * 1000)

                                        if (tipoVip == 3) {
                                            room.sendAnnouncement(`Jogo pausado 30 segundos pelo ${tagPause}: ${player.name}`, null, 0xFF0000, 'bold', 2);
                                            return false;
                                        }

                                        room.sendAnnouncement(`Jogo pausado por 15 segundos pelo ${tagPause}: ${player.name}`, null, 0xFF0000, 'bold', 2);
                                        return false;
                                    } else {
                                        if (tipoVip == 1) {
                                            room.sendAnnouncement(`Você só pode usar o comando pause a cada 30 minutos. Aguarde...`, player.id, cores.vermelho, 'bold', 2);
                                            return false;
                                        } else if (tipoVip == 2) {
                                            room.sendAnnouncement(`Você só pode usar o comando pause a cada 15 minutos. Aguarde...`, player.id, cores.vermelho, 'bold', 2);
                                            return false;
                                        } else {
                                            room.sendAnnouncement(`Você só pode usar o comando pause a cada 5 minutos. Aguarde...`, player.id, cores.vermelho, 'bold', 2);
                                            return false;
                                        }
                                    }
                                } else if (gameState == State.STOP) {
                                    room.sendAnnouncement(`🤖 Você só pode pausar enquanto o jogo está em andamento.`, player.id, cores.vermelho, 'bold', 2);
                                    return false;
                                } else {
                                    room.sendAnnouncement(`🤖 O jogo já está pausado.`, player.id, cores.vermelho, 'bold', 2);
                                    return false;
                                }
                            } else {
                                room.sendAnnouncement(
                                    `Você precisa estar jogando para pausar o jogo`,
                                    player.id,
                                    cores.vermelho,
                                    'bold',
                                    2);
                                return false
                            }
                        } else {
                            room.sendAnnouncement(`Ocorreu um erro ao tentar pausar a partida, se o erro persistir contate algum administrador!`, player.id, cores.vermelho, "bold", 2);
                            return false;
                        }
                    });
                } else {
                    room.sendAnnouncement(`Você precisa ser um vip para usar esse comando`, player.id, cores.vermelho, "bold", 2);
                    return false;
                }
            } else if (words[0] === "!pp") {
                if (vips[player.id] === 1 || premiums[player.id] === 1 || legends[player.id] === 1) {
                    con.query(`SELECT * FROM players WHERE name = ?`, [player.name], (err: any, result: any) => {
                        if (err) throw err;

                        if (result.length > 0) {
                            if (player.team != 0) {
                                if (gameState == State.PAUSE) {
                                    var tagUnPause: any = "";

                                    if (result[0].vip === 1) tagUnPause = "Vip";
                                    if (result[0].vip === 2) tagUnPause = "Premium";
                                    if (result[0].vip === 3) tagUnPause = "Legend";


                                    //if (pausarJogoOFF) {
                                    vipPausou.splice(vipPausou.indexOf(player.name), 1);

                                    room.pauseGame(false);
                                    room.sendAnnouncement(`Jogo despausado pelo ${tagUnPause}: ${player.name}`, null, 0xFF0000, 'bold', 2);

                                    return false;
                                    //}
                                } else if (gameState == State.STOP) {
                                    room.sendAnnouncement(`Você só pode despausar quando o jogo estiver em andamento.`, player.id, cores.vermelho, 'bold', 2);
                                    return false;
                                }
                            } else {
                                room.sendAnnouncement(`Você precisa estar jogando para despausar o jogo`, player.id, cores.vermelho, 'bold', 2);
                                return false
                            }
                        }
                    });
                }
            } else if (words[0] === "!login") {
                if (loggedInPlayers[player.id]) { //Não tem porque executar selects se a variável indica que ele esta logado é porque tem registro.
                    room.sendAnnouncement(`🩸 ${player.name} Você já está logado.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                const password = words[1];
                if (!password) {
                    room.sendAnnouncement(`🩸 ${player.name} Você não digitou a senha corretamente.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                if (password.length < 1) {
                    room.sendAnnouncement(`🩸 ${player.name} Você precisa colocar a senha depois do !login.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                // Checkar a database por alguém com o mesmo nome da pessoa em questão.
                const sql = `SELECT * FROM players WHERE LOWER(name) = LOWER(?) AND password IS NOT NULL`;
                const values = [player.name];
                con.query(sql, values, (err: any, result: any) => {
                    if (err) throw err;

                    if (result.length > 0) { // Um jogador com o mesmo nome foi encontrado.
                        if (false/*result[0].loggedIn === 1*/) { // O jogador já está logado.
                            room.sendAnnouncement(`🩸 Você já está logado.`, player.id, 0xFF0000, "bold", 2);
                        } else {
                            // O jogador não está logado ainda, então prosseguir.
                            bcrypt.compare(password, result[0].password, (err: any, isMatch: boolean) => {
                                if (err) throw err;
                                if (isMatch) { // Password correta, permitir o login e associar game_id à conta em questão.
                                    const playerId = player.id;
                                    const conn = playerConnections.get(player.id);
                                    const auth = playerAuth.get(player.id);
                                    const sql = `UPDATE players SET game_id = ?, conn = ? , auth = ?, loggedIn = 1 WHERE LOWER(name) = LOWER(?)`;
                                    const values = [playerId, conn, auth, player.name];
                                    con.query(sql, values, (err: any) => {
                                        if (err) throw err;

                                        handleRanks(player); // Definir avatar.

                                        loggedInPlayers[player.id] = true;
                                        activePlayers = room.getPlayerList().filter((p: Player) => {
                                            return !afkStatus[p.id];
                                        });

                                        if (result[0].ceo === 1) { // O usuário é super admin como tal dar admin ao mesmo.
                                            room.setPlayerAdmin(player.id, true);
                                            room.sendAnnouncement(`👑 ${player.name}, você entrou logado como CEO automaticamente.`, player.id, 0xFFA500, "bold");
                                            superadmin[player.id] = 1;
                                        }
                                        if (result[0].gerente === 1) {
                                            room.setPlayerAdmin(player.id, true);
                                            room.sendAnnouncement(`🔥 ${player.name}, você entrou logado como Gerente automaticamente.`, player.id, 0xFFA500, "bold");
                                            gerentes[player.id] = 1;
                                        }
                                        if (result[0].admin === 1) {
                                            room.setPlayerAdmin(player.id, true);
                                            room.sendAnnouncement(`🚧 ${player.name}, você entrou logado como Administrator automaticamente.`, player.id, 0xFFA500, "bold");
                                            admins[player.id] = 1;
                                        }
                                        if (result[0].mod === 1) {
                                            room.setPlayerAdmin(player.id, true);
                                            room.sendAnnouncement(`🚧 ${player.name}, você entrou logado como Moderador automaticamente.`, player.id, 0xFFA500, "bold");
                                            mods[player.id] = 1;
                                        }

                                        console.log(`${player.name} logou.`);
                                        room.sendAnnouncement(`🩸 Bem-vindo de volta ${player.name}!`, player.id, 0xFF0000, "bold");
                                        room.sendAnnouncement(`🩸 Digite !help para ver os comandos disponíveis na sala, em caso de dúvida com algum comando digite: !help <comando>`, player.id, 0xFFFFFF, "bold");
                                        room.sendAnnouncement(`👥 Não se esqueça de entrar no nosso discord: ${discord}`, player.id, 0xFFFFFF, "bold");
                                        // room.sendAnnouncement(`🚧 Faça !login para poder jogar as partidas!`, player.id, 0xFFFFFF, "bold");
                                        // Limpar timeout.
                                        if (timeoutIds[player.id]) {
                                            clearTimeout(timeoutIds[player.id]);
                                            delete timeoutIds[player.id];
                                        }
                                    });
                                } else {
                                    // Password errada e kick no homem, lá pra fora!
                                    room.kickPlayer(player.id, `🩸 ${player.name} Senha incorreta!`);
                                    console.log(`${player.name} foi expulso por digitar a senha errada ao tentar fazer login.`);
                                }
                            });
                        }
                    } else { // Não foi encontrada uma conta o jogador tem de se registar primeiro.
                        room.sendAnnouncement(`🩸 ${player.name} Você ainda não se registrou. Por favor, digite: !registrar seguido pela sua senha.`, player.id, 0xFF0000, "bold", 2);
                    }
                });
                // CallAdmin:
            } else if (words[0] === "!calladmin") {
                calladmin(player, message);
                return false;
                // Fundador:
            } else if (words[0] === "!rr2") {
                if (superadmin[player.id] === 1 || gerentes[player.id] === 1 || admins[player.id] === 1 || mods[player.id] === 1) {
                    room.pauseGame(true);

                    for (let i = 0; i < teamR.length; i++) {
                        let playerId = teamR[i].id;
                        let newPosition = { x: -350, y: 0 };

                        room.setPlayerDiscProperties(playerId, newPosition);
                    }

                    room.setDiscProperties(0, { x: 0, y: 0 });

                    for (let i = 0; i < teamB.length; i++) {
                        let playerId = teamB[i].id;
                        let newPosition = { x: 350, y: 0 };

                        room.setPlayerDiscProperties(playerId, newPosition);
                    }


                    room.pauseGame(false);
                    room.sendAnnouncement(`🚧 ${player.name} resetou a localização da bola!`, null, 0xFFA500, 'bold', 2);

                    return false;
                }
            } else if (words[0] === "!uni" || words[0] === "!uniforme" || words[0] === "!camisetas") {
                chooseUni(player, words);
                return false;
            } else if (words[0] == "!uniformes" || words[0] == "!unis") {
                if (words[1]) {
                    // Listar uniformes de um país específico
                    const country = words[1];
                    const uniformesPorPais: EquipeUniforme[] = uniformes.filter(u => u.country.toLowerCase() === country.toLowerCase());

                    if (uniformesPorPais.length > 0) {
                        const listaUniformes = uniformesPorPais.map(u => `${u.shortName} (${u.longName})`).join(', ');
                        room.sendAnnouncement(`Uniformes ${country}:`, player.id, 0xFF0000, "bold");
                        room.sendAnnouncement(`${listaUniformes}`, player.id, 0xFFFFFF, "bold");
                        room.sendAnnouncement(`Para usar um uniforme digite !uni [codigo]`, player.id, 0xFF0000, "bold");
                    } else {
                        room.sendAnnouncement(`Não foram encontrados uniformes ${country}.`, player.id, cores.vermelho, "bold", 2);
                    }
                } else {
                    // Listar todos os países
                    const paises = [...new Set(uniformes.map(u => u.country))].join(', ');
                    room.sendAnnouncement(`Países disponíveis:`, player.id, 0xFF0000, "bold");
                    room.sendAnnouncement(`${paises}`, player.id, 0xFFFFFF, "bold");
                    room.sendAnnouncement(`Para ver os uniformes do país digite !uniformes [pais]`, player.id, 0xFF0000, "bold");
                }
                return false;

            } else if (words[0] === "!setvip") {
                if (superadmin[player.id] === 1 || gerentes[player.id] === 1) {
                    var input = words;
                    var jogador: any = input[1];
                    var vipType: any = input[2];
                    var userId: any;
                    var userName: any;

                    if (jogador.startsWith("#")) {
                        var id = jogador.substring(1);
                        var playerSet = room.getPlayerList().filter((p: any) => p.id === parseInt(id));
                        if (playerSet) {
                            userId = playerSet[0].id;
                            userName = playerSet[0].name;
                        } else {
                            room.sendAnnouncement(`🩸 Não consegui encontrar nenhum jogador com o ID ${id}!`, player.id, cores.vermelho, "bold", 2);
                            return false;
                        }
                    } else {
                        room.sendAnnouncement(`🩸 ${player.name} você não digitou o comando corretamente. (Ex: !setvip #id 1-3)`, player.id, 0xFF0000, "bold", 2);
                        return false;
                    }

                    if (!userId || !userName) {
                        room.sendAnnouncement(`🩸 Não consegui encontrar nenhum jogador com esse ID!`, player.id, cores.vermelho, "bold", 2);
                        return false;
                    }

                    if (!vipType || isNaN(vipType) || vipType > 3 || vipType < 1) {
                        room.sendAnnouncement(`🩸 Você não digitou o vip corretamente. (Ex: !setvip #id 1-3)`, player.id, cores.vermelho, "bold", 2);
                        return false;
                    }

                    con.query(`SELECT * FROM players WHERE name = ?`, [userName], (err: any, result: any) => {
                        if (err) throw err;

                        if (result.length > 0) {
                            if (vipType === '1') {
                                if (result[0].vip === 0) {
                                    con.query(`UPDATE players SET vip = 1 WHERE name = ?`, [userName], (err: any, result: any) => {
                                        if (err) {
                                            console.error(err);
                                            return false;
                                        }

                                        if (result.affectedRows > 0) {
                                            room.sendAnnouncement(`💎 O ${player.name} concedeu o cargo de VIP para o ${userName}!`, null, 0xFFA500, "bold", 2);
                                            room.sendAnnouncement(`Parabéns ${userName}! Você recebeu o cargo "Vip" pelo Admin ${player.name}`, userId, cores.cinza, "bold", 2);
                                            vips[userId] = 1;
                                        } else {
                                            return false;
                                        }
                                    });
                                } else {
                                    room.sendAnnouncement(`O ${userName} já é um jogador Vip!`, player.id, cores.vermelho, "bold", 2);
                                    return false;
                                }
                            }

                            if (vipType === '2') {
                                if (result[0].vip === 0) {
                                    con.query(`UPDATE players SET vip = 2 WHERE name = ?`, [userName], (err: any, result: any) => {
                                        if (err) {
                                            console.error(err);
                                            return false;
                                        }

                                        if (result.affectedRows > 0) {
                                            room.sendAnnouncement(`O ${player.name} concedeu o cargo de PREMIUM para o ${userName}!`, null, 0xFFA500, "bold", 2);
                                            room.sendAnnouncement(`Parabéns ${userName}! Você recebeu o cargo "Premium" pelo Admin ${player.name}`, userId, cores.cinza, "bold", 2);
                                            premiums[userId] = 1;
                                        } else {
                                            return false;
                                        }
                                    });
                                } else {
                                    room.sendAnnouncement(`O ${userName} já é um jogador Premium!`, player.id, cores.vermelho, "bold", 2);
                                    return false;
                                }
                            }

                            if (vipType === '3') {
                                if (result[0].vip === 0) {
                                    con.query(`UPDATE players SET vip = 3 WHERE name = ?`, [userName], (err: any, result: any) => {
                                        if (err) {
                                            console.error(err);
                                            return false;
                                        }

                                        if (result.affectedRows > 0) {
                                            room.sendAnnouncement(`🌋 O ${player.name} concedeu o cargo de LEGEND para o ${userName}!`, null, 0xFFA500, "bold", 2);
                                            room.sendAnnouncement(`Parabéns ${userName}! Você recebeu o cargo "Legend" pelo Admin ${player.name}`, userId, cores.cinza, "bold", 2);
                                            legends[userId] = 1;
                                        } else {
                                            return false;
                                        }
                                    });
                                } else {
                                    room.sendAnnouncement(`O ${userName} já é um jogador Legend!`, player.id, cores.vermelho, "bold", 2);
                                    return false;
                                }
                            }
                        } else {
                            room.sendAnnouncement(`🩸 ${player.name} Não encontrei um jogador com esse nome/id.`, player.id, 0xFF0000, "bold", 2);
                            return false;
                        }
                    });
                }
                //SETAR ADMIN
            } else if (words[0] === "!setadmin") {
                if (words.length < 3) {
                    room.sendAnnouncement(`🩸 ${player.name} Você não digitou o comando corretamente. (Ex: !setadmin #id 1-4)`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                const input = words;
                const jogador: any = input[1];
                const adminType: any = input[2];
                var userId: any;
                var userName: any;

                if (jogador.startsWith("#")) {
                    id = parseInt(jogador.substring(1), 10); // Aqui está a correção
                    var playerSet = room.getPlayer(id);
                    if (playerSet) {
                        userId = playerSet.id;
                        userName = playerSet.name;
                    } else {
                        room.sendAnnouncement(`🩸 Não consegui encontrar nenhum jogador com o ID ${id}!`, player.id, cores.vermelho, "bold", 2);
                        return false;
                    }
                } else {
                    return false;
                }

                if (!userId || !userName) {
                    room.sendAnnouncement(`🩸 Não consegui encontrar nenhum jogador com esse ID!`, player.id, cores.vermelho, "bold", 2);
                    return false;
                }

                if (userId === player.id) {
                    room.sendAnnouncement(`🩸 ${player.name} você não pode se auto-promover.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (!adminType || isNaN(adminType)) {
                    room.sendAnnouncement(`🩸 Você não digitou o cargo corretamente. (Ex: !setadmin #id 1-4)`, player.id, cores.vermelho, "bold", 2);
                    return false;
                }

                // Verifica se o jogador que está tentando usar o comando é um CEO
                con.query(`SELECT * FROM players WHERE name = ? AND ceo = 1`, [player.name], (err: any, result: any) => {
                    if (err) throw err;

                    if (result.length > 0) {
                        var adminColumn = '';
                        if (adminType === '1') {
                            adminColumn = '`ceo`';
                        } else if (adminType === '2') {
                            adminColumn = '`gerente`';
                        } else if (adminType === '3') {
                            adminColumn = '`admin`';
                        } else if (adminType === '4') {
                            adminColumn = '`mod`';
                        } else {
                            room.sendAnnouncement(`🩸 Você não digitou o cargo corretamente. (Ex: !setadmin #id 1-4)`, player.id, cores.vermelho, "bold", 2);
                            return false;
                        }

                        con.query(`UPDATE players SET ${adminColumn} = 1 WHERE name = ?`, [userName], (err: any, result: any) => {
                            if (err) throw err;

                            if (result.affectedRows > 0) {
                                room.sendAnnouncement(`👑 ${userName} Agora é um ${adminColumn.replace(/`/g, '')}!`, null, 0xFFA500, "bold", 2);
                                room.sendAnnouncement(`👑 ${userName} Por favor, saia e entre na sala novamente para que o cargo seja atualizado.`, userId, 0xFF0000, "bold", 2);
                                superadmin[userId] = parseInt(adminType);
                            } else {
                                return false;
                            }
                        });
                    } else {
                        room.sendAnnouncement(`🩸 ${userName} você não tem permissão para usar este comando.`, player.id, 0xFF0000, "bold", 2);
                        return false;
                    }
                });
                //MUDAR SENHA
            } else if (words[0] === "!mudarsenha") {
                const input = words;
                if (input.length < 3) {
                    room.sendAnnouncement(`🩸 ${player.name} utilize o seguinte formato: !mudarsenha antiga_senha nova_senha`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                const oldPassword = input[1];
                const newPassword = input[2];
                if (!oldPassword || !newPassword) {
                    room.sendAnnouncement(`🩸 ${player.name} você precisa colocar uma senha antiga e uma nova senha depois do comando !mudarsenha`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                if (oldPassword.length < 3 || newPassword.length < 3) {
                    room.sendAnnouncement(`🩸 ${player.name} a senha deve ter pelo menos 3 caracteres.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                const sql = `SELECT * FROM players WHERE LOWER(name) = LOWER(?)`;
                const values = [player.name];
                con.query(sql, values, (err: any, result: any) => {
                    if (err) throw err;

                    if (result.length > 0) {
                        const hashedPassword = result[0].password;
                        bcrypt.compare(oldPassword, hashedPassword, (err: any, match: any) => {
                            if (err) throw err;

                            if (match) {
                                bcrypt.hash(newPassword, 10, (err: any, newHashedPassword: any) => {
                                    if (err) throw err;

                                    const sql = `UPDATE players SET password = ? WHERE LOWER(name) = LOWER(?)`;
                                    const values = [newHashedPassword, player.name];
                                    con.query(sql, values, (err: any) => {
                                        if (err) throw err;
                                        room.sendAnnouncement(`🩸 ${player.name} A sua senha foi alterada com sucesso!`, player.id, 0xFFFFFF, "bold");
                                        console.log(`${player.name} alterou a senha.`);
                                    });
                                });
                            } else {
                                room.sendAnnouncement(`🩸 ${player.name} A sua senha antiga está incorreta.`, player.id, 0xFF0000, "bold", 2);
                                console.log(`${player.name} tentou mudar a senha mas errou a senha antiga.`);
                            }
                        });
                    } else {
                        room.sendAnnouncement(`🩸 ${player.name} A sua conta não está registrada.`, player.id, 0xFF0000, "bold", 2);
                    }
                });
                // Comando AFK
            } else if (message === "!afk" && allowAFK) {
                if (loggedInPlayers[player.id]) {
                    let playersGaming = room.getPlayerList().filter((p: Player) => p.team > 0);
                    if (playersGaming.length >= getMaxTeamSize() * 2 && (player.team === 1 || player.team === 2)) {
                        room.sendAnnouncement(`🩸 ${player.name} Você não pode ficar AFK pois está no meio de uma partida.`, player.id, 0xFF0000, "bold", 2);
                    }
                    // Está logado, logo proceder com o comando.
                    else if (afkStatus[player.id] === 1) {
                        afkStatus[player.id] = 0;
                        room.sendAnnouncement(`💤 ${player.name} não está mais AFK!`, null, 0xFFA500, "bold", 0);
                        if (timeoutIds[player.id]) {
                            clearTimeout(timeoutIds[player.id]);
                            delete timeoutIds[player.id];
                        }
                        loggedInPlayers[player.id] = true;
                    } else {
                        room.setPlayerTeam(player.id, Team.SPECTATORS);
                        afkStatus[player.id] = 1;
                        room.sendAnnouncement(`💤 ${player.name} agora está AFK!`, null, 0xFFA500, "bold", 0);
                        // Levar kick por AFK +10 minutos se não for superAdmin
                        if (superadmin[player.id] !== 1 || gerentes[player.id] !== 1 || admins[player.id] !== 1 || mods[player.id] !== 1) {
                            setTimeout(() => {
                                if (afkStatus[player.id] === 1) {
                                    afkStatus[player.id] = 0;
                                    // room.kickPlayer(player.id, `🩸 ${player.name} Você ficou AFK por muito tempo.`);
                                }
                            }, 10 * 60 * 1000); // 10 minutos = 600000 ms
                        }
                    }
                    activePlayers = room.getPlayerList().filter((p: Player) => {
                        return !afkStatus[p.id];
                    });
                    afkStatus[player.id] ? updateRoleOnPlayerOut() : updateRoleOnPlayerIn();
                } else {
                    // Jogador não está logado, logo não pode ir AFK
                    room.sendAnnouncement(`🩸 ${player.name} você precisa estar logado para usar este comando.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }
            } else if (words[0] === "!listafks") {
                const afkPlayers = room.getPlayerList().filter((p: { id: number; }) => afkStatus[p.id] === 1);
                let playerNames = afkPlayers.map((p: { id: any; }) => {
                    return room.getPlayer(p.id).name;
                });
                if (playerNames.length > 0) {
                    room.sendAnnouncement(`💤 Lista de jogadores AFK: ${playerNames.join(", ")}`, player.id, 0xFFFFFF, "bold");
                } else {
                    room.sendAnnouncement(`🩸 Não há jogadores AFK no momento.`, player.id, 0xFF0000, "bold");
                }
                // Comando Streak
            }
            else if (words[0] === "!sequencia") {
                room.sendAnnouncement(`🏆 ${player.name} a sequência atual da sala é de ${winstreak} jogos para a equipe 🔴!`, player.id, 0xFFFFFF, "bold");
                // Comando Top Streak
            }
            else if (words[0] === "!topsequencia") {
                const sql = `SELECT * FROM streak ORDER BY games DESC LIMIT 1`;
                con.query(sql, (err: any, result: any) => {
                    if (err) throw err;
                    if (result.length == 0) {
                        room.sendAnnouncement(`🩸 ${player.name} não há nenhuma streak registrada.`, player.id, 0xFF0000, "bold", 2);
                        return false;
                    }
                    room.sendAnnouncement(`🏆 ${player.name} a top sequência atual é de ${result[0].games} jogos e foi conquistada pelos jogadores ${result[0].player1}, ${result[0].player2} e ${result[0].player3}!`, player.id, 0xFFFFFF, "bold");
                });
                // Logout bem básico.
            }
            else if (words[0] === "!bb") {
                room.kickPlayer(player.id, `👋 Adeus ${player.name}, até a próxima!`);
                // Comando para mostrar o link do meu discord.
            }
            else if (words[0] === "!discord" || words[0] === "!disc") {
                room.sendAnnouncement(`👥 Discord: ${discord}`, player.id, 0x094480, "bold");
                // Comando das estatísticas
            }
            else if (words[0] === "!stats" || words[0] === "!me" || words[0] === "!status") {
                const sql = `SELECT * FROM players WHERE LOWER(name) = LOWER(?)`;
                const values = [player.name];
                con.query(sql, values, (err: any, playersResult: any) => {
                    if (err) throw err;
                    if (playersResult.length === 0) {
                        room.sendAnnouncement(`Você não está registrado! Digite: !registrar <senha> para se registrar.`, player.id, 0xFF0000, "bold", 2);
                    } else {
                        const playerID = playersResult[0].id;
                        const sqlStats = `SELECT * FROM stats WHERE player_id = ? AND room_id = ?`;
                        const statsValues = [playerID, process.env.room_id];
                        con.query(sqlStats, statsValues, (err: any, statsResult: any) => {
                            if (err) throw err;
                            if (statsResult.length === 0) {
                                room.sendAnnouncement(`Não há estatísticas disponíveis para você.`, player.id, 0xFF0000, "bold", 2);
                            } else {
                                const stats = statsResult[0];

                                const totalGoals = Number(stats.goals) || 0;
                                const totalAssists = Number(stats.assists) || 0;
                                const totalGames = Number(stats.games) || 0;
                                const totalWins = Number(stats.wins) || 0;
                                let averageGoalsPerGame = 0;
                                let averageAssistsPerGame = 0;
                                let winRate = 0;
                                if (totalGames > 0) {
                                    averageGoalsPerGame = totalGoals / totalGames;
                                    averageAssistsPerGame = totalAssists / totalGames;
                                    winRate = (totalWins / totalGames) * 100;
                                }
                                room.sendAnnouncement(`📊 Você tem uma média de ${averageGoalsPerGame.toFixed(2)} gols e ${averageAssistsPerGame.toFixed(2)} assistências por jogo e um percentual de vitória de ${winRate.toFixed(2)}%.`, player.id, 0xFFFFFF, "bold", 0);
                                room.sendAnnouncement(`📊 O seu ELO: ${stats.elo}`, player.id, 0xFF0000, "bold");
                                room.sendAnnouncement(`📊 As suas estatísticas: Jogos: ${stats.games}, Vitórias: ${stats.wins}, Derrotas: ${stats.losses}, Gols: ${stats.goals}, Assistências: ${stats.assists}, Gols contras: ${stats.ag}, CS: ${stats.cs}`, player.id, 0xFFFFFF, "bold", 0);
                            }
                        });
                    }
                });
            }


            else if (words[0] === "!gols" || words[0] === "!goals") {
                // Retrieve the top 10 goal scorers in the room
                const sql = `SELECT p.name, s.goals FROM stats s JOIN players p ON s.player_id = p.id WHERE s.room_id = ? ORDER BY s.goals DESC LIMIT 10`;
                const values = [process.env.room_id];
                con.query(sql, values, (err: Error | null, result: any[]) => {
                    if (err) throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement(`🩸 Não há dados suficientes para exibir os artilheiros.`, player.id, 0xFF0000, "bold", 2);
                    } else {
                        // Displaying the top scorers on one line
                        let announcement = `🏆⚽ Top 10 Artilheiros: `;
                        result.forEach((player, index) => {
                            announcement += `#${index + 1} ${player.name}: ${player.goals}; `;
                        });
                        room.sendAnnouncement(announcement, player.id, 0xFFFFFF, "bold");
                    }
                });
            }



            else if (words[0] === "!assists" || words[0] === "!assistencias") {
                // Retrieve the top 10 goal scorers in the room
                const sql = `SELECT p.name, s.assists FROM stats s JOIN players p ON s.player_id = p.id WHERE s.room_id = ? ORDER BY s.assists DESC LIMIT 10`;
                const values = [process.env.room_id];
                con.query(sql, values, (err: Error | null, result: any[]) => {
                    if (err) throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement(`🩸 Não há dados suficientes para exibir os assistentes.`, player.id, 0xFF0000, "bold", 2);
                    } else {
                        // Displaying the top scorers on one line
                        let announcement = `🏆🅰️ Top 10 em Assistências: `;
                        result.forEach((player, index) => {
                            announcement += `#${index + 1} ${player.name}: ${player.assists}; `;
                        });
                        room.sendAnnouncement(announcement, player.id, 0xFFFFFF, "bold");
                    }
                });
            }

            else if (words[0] === "!golscontra" || words[0] === "!owngoals") {
                // Retrieve the top 10 players with most own goals in the room
                const sql = `SELECT p.name, s.ag FROM stats s JOIN players p ON s.player_id = p.id WHERE s.room_id = ? ORDER BY s.ag DESC LIMIT 10`;
                const values = [process.env.room_id];
                con.query(sql, values, (err: Error | null, result: any[]) => {
                    if (err) throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement(`🩸 Não há dados suficientes para exibir os jogadores com mais gols contra.`, player.id, 0xFF0000, "bold", 2);
                    } else {
                        // Displaying the top players with most own goals on one line
                        let announcement = `🥅🏆 Top 10 Jogadores com Mais Gols Contra: `;
                        result.forEach((player, index) => {
                            announcement += `#${index + 1} ${player.name}: ${player.ag}; `;
                        });
                        room.sendAnnouncement(announcement, player.id, 0xFFFFFF, "bold");
                    }
                });
            }

            else if (words[0] === "!ricos" || words[0] === "!rich") {
                // Retrieve the top 10 richest players
                const sql = `SELECT p.name, p.balance FROM players p ORDER BY p.balance DESC LIMIT 10`;
                con.query(sql, (err: Error | null, result: any[]) => {
                    if (err) throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement(`🩸 Não há dados suficientes para exibir os jogadores mais ricos.`, player.id, 0xFF0000, "bold", 2);
                    } else {
                        // Displaying the top richest players on one line
                        let announcement = `💰🏆 Top 10 Jogadores Mais Ricos: `;
                        result.forEach((player, index) => {
                            // Format the balance to remove decimals and add thousand separators
                            const formattedBalance = Number(player.balance).toLocaleString('pt-BR');
                            announcement += `#${index + 1} ${player.name}: ${formattedBalance}; `;
                        });
                        // Remove the last semicolon
                        announcement = announcement.slice(0, -2);
                        room.sendAnnouncement(announcement.trim(), player.id, 0xFFFFFF, "bold");
                    }
                });
            }

            else if (words[0] === "!jogos" || words[0] === "!games") {
                // Retrieve the top 10 goal scorers in the room
                const sql = `SELECT p.name, s.games FROM stats s JOIN players p ON s.player_id = p.id WHERE s.room_id = ? ORDER BY s.games DESC LIMIT 10`;
                const values = [process.env.room_id];
                con.query(sql, values, (err: Error | null, result: any[]) => {
                    if (err) throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement(`🩸 Não há dados suficientes para exibir os jogos.`, player.id, 0xFF0000, "bold", 2);
                    } else {
                        // Displaying the top scorers on one line
                        let announcement = `🏆🏟️ Top 10 em Jogos: `;
                        result.forEach((player, index) => {
                            announcement += `#${index + 1} ${player.name}: ${player.games}; `;
                        });
                        room.sendAnnouncement(announcement, player.id, 0xFFFFFF, "bold");
                    }
                });
            }


            else if (words[0] === "!vitorias" || words[0] === "!wins") {
                // Retrieve the top 10 goal scorers in the room
                const sql = `SELECT p.name, s.wins FROM stats s JOIN players p ON s.player_id = p.id WHERE s.room_id = ? ORDER BY s.wins DESC LIMIT 10`;
                const values = [process.env.room_id];
                con.query(sql, values, (err: Error | null, result: any[]) => {
                    if (err) throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement(`🩸 Não há dados suficientes para exibir as vitórias.`, player.id, 0xFF0000, "bold", 2);
                    } else {
                        // Displaying the top scorers on one line
                        let announcement = `🏆✅ Top 10 em Vitórias: `;
                        result.forEach((player, index) => {
                            announcement += `#${index + 1} ${player.name}: ${player.wins}; `;
                        });
                        room.sendAnnouncement(announcement, player.id, 0xFFFFFF, "bold");
                    }
                });
            }


            else if (words[0] === "!cs") {
                // Retrieve the top 10 goal scorers in the room
                const sql = `SELECT p.name, s.cs FROM stats s JOIN players p ON s.player_id = p.id WHERE s.room_id = ? ORDER BY s.cs DESC LIMIT 10`;
                const values = [process.env.room_id];
                con.query(sql, values, (err: Error | null, result: any[]) => {
                    if (err) throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement(`🩸 Não há dados suficientes para exibir os dados de CS.`, player.id, 0xFF0000, "bold", 2);
                    } else {
                        // Displaying the top scorers on one line
                        let announcement = `🏆👋 Top 10 em CS: `;
                        result.forEach((player, index) => {
                            announcement += `#${index + 1} ${player.name}: ${player.cs}; `;
                        });
                        room.sendAnnouncement(announcement, player.id, 0xFFFFFF, "bold");
                    }
                });
            }


            else if (words[0] === "!gk") {
                // Coloca status de GK no jogador que digitou o comando
                if (player.team === 1) {  // Equipe RED
                    gk[0] = player;  // Atualiza o GK do Red
                    room.sendAnnouncement(`🔴 ${player.name} é agora o GK do Red!`, null, 0xFFFFFF, "bold", 0);
                }
                else if (player.team === 2) {  // Equipe BLUE
                    gk[1] = player;  // Atualiza o GK do Blue
                    room.sendAnnouncement(`🔵 ${player.name} é agora o GK do Blue!`, null, 0xFFFFFF, "bold", 0);
                }
                else {
                    // Se o jogador não está em uma equipe, envia uma mensagem de erro
                    room.sendAnnouncement(`Você precisa estar em uma equipe para ser o GK.`, player.id, 0xFF0000, "bold", 0);
                }
                return false;
            }


            else if (words[0] === "!unmute") {
                // Verifica se o jogador tem permissão para usar o comando
                const sql = `SELECT * FROM players WHERE LOWER(name) = LOWER(?)`;
                const values = [player.name];
                con.query(sql, values, (err: any, result: any) => {
                    if (err) {
                        room.sendAnnouncement(`🩸 Erro no banco de dados: ${err.message}`, player.id, 0xFF0000, "bold", 2);
                        console.error(err);
                        return;
                    }
                    if (result.length === 0 || !loggedInPlayers[player.id] || !(result[0].ceo || result[0].gerente || result[0].admin || result[0].mod)) {
                        room.sendAnnouncement("🩸 Você não tem autorização para usar este comando!", player.id, 0xFF0000, "bold", 2);
                        return;
                    }

                    // Espera uma menção com "@" e manipulação de formato incorreto
                    if (words.length < 2 || !words[1].startsWith('@')) {
                        room.sendAnnouncement("🩸 Por favor, mencione um jogador com '@nomeDoJogador' para desmutar.", player.id, 0xFF0000, "bold", 2);
                        return;
                    }

                    // Parseia o nome do jogador mencionado removendo o prefixo "@" e substituindo underscores por espaços
                    const targetPlayerName = words[1].substring(1).replace(/_/g, ' ').toLowerCase(); // Transforma para minúsculo
                    console.log(`Attempting to unmute: ${targetPlayerName}`);  // Debug: Mostra o nome do jogador mencionado

                    // Find the mentioned player in the room.
                    const targetPlayer = room.getPlayerList().find((p: Player) => p.name.toLowerCase() === targetPlayerName);
                    if (!targetPlayer) {
                        room.sendAnnouncement("🩸 Jogador não encontrado.", player.id, 0xFF0000, "bold", 2);
                        return;
                    }

                    // Query para verificar se um mute está ativo e ainda não expirou
                    con.query(`SELECT * FROM mutes WHERE LOWER(name) = LOWER(?)`, [targetPlayer.name], (err: any, result: any) => {
                        if (err) {
                            room.sendAnnouncement(`🩸 Erro ao acessar registros de mute: ${err.message}`, player.id, 0xFF0000, "bold", 2);
                            console.error(err);
                            return;
                        }

                        if (result.length === 0) {
                            room.sendAnnouncement(`🩸 O jogador não está mutado ou o mute já expirou.`, player.id, 0xFF0000, "bold", 2);
                            console.log('No mute records found');  // Debug: Confirma que não há registros de mute
                        } else {
                            const muteRecord = result[0];
                            console.log(`Found mute record expiring at ${muteRecord.time}`);
                            // Checa se o mute ainda está ativo
                            const muteExpiration = new Date(muteRecord.time);
                            const currentTime = new Date();
                            if (currentTime < muteExpiration) {
                                // Se o mute ainda está ativo, deleta o registro de mute
                                con.query(`DELETE FROM mutes WHERE id = ?`, [muteRecord.id], (err: any, result: any) => {
                                    if (err) {
                                        room.sendAnnouncement(`🩸 Erro ao desmutar: ${err.message}`, player.id, 0xFF0000, "bold", 2);
                                        console.error(err);
                                        return;
                                    }
                                    if (result.affectedRows > 0) {
                                        room.sendAnnouncement(`🩸 ${targetPlayer.name} desmutado com sucesso!`, null, 0xFFA500, "bold");
                                        isMuted[targetPlayer.id] = false;
                                    } else {
                                        room.sendAnnouncement(`🩸 Falha ao desmutar, por favor tente novamente.`, player.id, 0xFF0000, "bold", 2);
                                    }
                                });
                            } else {
                                room.sendAnnouncement(`🩸 O mute para ${targetPlayer.name} já expirou.`, player.id, 0xFFA500, "bold");
                            }
                        }
                    });
                });
            }


            else if (words[0] === "!unban") {
                // Checkar a database por alguém com o mesmo nome da pessoa em questão.
                const sql = `SELECT * FROM players WHERE LOWER(name) = LOWER(?)`;
                const values = [player.name];
                con.query(sql, values, (err: any, result: any) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        if (!loggedInPlayers[player.id] || !(result[0].ceo || result[0].gerente || result[0].admin || result[0].mod)) {
                            room.sendAnnouncement("🩸 Você não tem autorização para usar este comando!", player.id, 0xFF0000, "bold", 2);
                        } else {
                            const currentDate = new Date();
                            const name = words.slice(1).join(" ");
                            const targetPlayer = room.getPlayerList().find((p: Player) => p.name === name);
                            // Remover o ban se o ban ainda estiver ativo.
                            con.query(`DELETE FROM bans WHERE name = ? and time > ?`, [name, currentDate], (err: any, result: any) => {
                                if (err) throw err;
                                if (result.affectedRows > 0) {
                                    room.sendAnnouncement(`🩸 Desbanido com sucesso!`, null, 0xFFA500, "bold");
                                    if (targetPlayer) {
                                        isMuted[targetPlayer.id] = false;
                                    }
                                } else {
                                    room.sendAnnouncement(`🩸 O jogador não está banido.`, player.id, 0xFF0000, "bold", 2);
                                }
                            });
                        }
                    }
                });
            }

            else if (words[0] === "!ban") {
                const sql = `SELECT * FROM players WHERE LOWER(name) = LOWER(?)`;
                const values = [player.name];
                con.query(sql, values, (err: any, result: any) => {
                    if (err) throw err;
                    if (result.length === 0 || !loggedInPlayers[player.id] || !(result[0].ceo || result[0].gerente || result[0].admin || result[0].mod)) {
                        room.sendAnnouncement("🩸 Você não tem autorização para usar este comando!", player.id, 0xFF0000, "bold", 2);
                        return;
                    }

                    if (words.length < 2 || !words[1].startsWith('@')) {
                        room.sendAnnouncement("🩸 Por favor, mencione um jogador com '@nomeDoJogador'.", player.id, 0xFF0000, "bold", 2);
                        return;
                    }

                    let targetPlayerName = words[1].substring(1).replace(/_/g, ' '); // Remove '@' e substitui underscores por espaços
                    let reason = words.slice(2).join(" ") || "Sem motivo";
                    let timeStr = "6h"; // Padrão para 6 horas

                    const timeRegex = /^(\d+)([a-zA-Z]+)$/;
                    words.slice(2).some(word => {
                        if (word.match(timeRegex)) {
                            timeStr = word;
                            reason = words.slice(words.indexOf(word) + 1).join(" ");
                            return true;
                        }
                    });

                    const match = timeStr.match(timeRegex);
                    if (!match) {
                        room.sendAnnouncement("🩸 Formato de tempo inválido. Use um número seguido de d (Dias), h (Horas), m (Minutos), ou s (Segundos)", player.id, 0xFF0000, "bold", 2);
                        return;
                    }

                    const duration = parseInt(match[1]);
                    const unit = match[2];
                    let banDuration = 0;
                    switch (unit) {
                        case "d": banDuration = duration * 24 * 60 * 60 * 1000; break;
                        case "h": banDuration = duration * 60 * 60 * 1000; break;
                        case "m": banDuration = duration * 60 * 1000; break;
                        case "s": banDuration = duration * 1000; break;
                        default:
                            room.sendAnnouncement("🩸 Formato de tempo inválido.", player.id, 0xFF0000, "bold", 2);
                            return;
                    }

                    const banEndTime = new Date(Date.now() + banDuration);
                    const timezoneOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
                    const localBanEndTime = new Date(banEndTime.getTime() - timezoneOffsetMs);
                    const banEndTimeFormatted = localBanEndTime.toISOString().slice(0, 19).replace('T', ' ')

                    // Tenta achar o jogador alvo por menção e aplicar o ban se existir
                    const targetPlayer = room.getPlayerList().find((p: Player) => p.name.toLowerCase() === targetPlayerName.toLowerCase());
                    if (targetPlayer) {
                        const conn = playerConnections.get(targetPlayer.id);
                        const auth = playerAuth.get(targetPlayer.id);
                        const sqlInsert = `INSERT INTO bans (name, time, reason, banned_by, conn, auth) VALUES (?, ?, ?, ?, ?, ?)`;
                        const valuesInsert = [targetPlayer.name, banEndTimeFormatted, reason, player.name, conn, auth];
                        con.query(sqlInsert, valuesInsert, (err: any, result: any) => {
                            if (err) throw err;
                            room.sendAnnouncement(`🩸 ${targetPlayer.name} banido com sucesso!`, null, 0xFFA500, "bold");
                            // Bane o jogador alvo
                            room.kickPlayer(targetPlayer.id, `🩸 Você foi banido. Motivo: ${reason} até ${banEndTimeFormatted}.`);
                        });
                    } else {
                        room.sendAnnouncement("🩸 Jogador não encontrado.", player.id, 0xFF0000, "bold", 2);
                    }
                });
            }



            else if (words[0] === "!mute") {
                const sql = `SELECT * FROM players WHERE LOWER(name) = LOWER(?)`;
                const values = [player.name];
                con.query(sql, values, (err: any, result: any) => {
                    if (err) throw err;
                    if (result.length === 0 || !loggedInPlayers[player.id] || !(result[0].ceo || result[0].gerente || result[0].admin || result[0].mod)) {
                        room.sendAnnouncement("🩸 Você não tem autorização para usar este comando!", player.id, 0xFF0000, "bold", 2);
                        return;
                    }

                    if (words.length < 2 || !words[1].startsWith('@')) {
                        room.sendAnnouncement("🩸 Por favor, mencione um jogador com '@nomeDoJogador'.", player.id, 0xFF0000, "bold", 2);
                        return;
                    }

                    let targetPlayerName = words[1].substring(1).replace(/_/g, ' '); // Remove '@' e substitui underscores por espaços
                    let reason = words.slice(2).join(" ") || "Sem motivo";
                    let timeStr = "5m"; // Padrão para 5 minutos

                    const timeRegex = /^(\d+)([a-zA-Z]+)$/;
                    words.slice(2).some(word => {
                        if (word.match(timeRegex)) {
                            timeStr = word;
                            reason = words.slice(words.indexOf(word) + 1).join(" ");
                            return true;
                        }
                    });

                    const match = timeStr.match(timeRegex);
                    if (!match) {
                        room.sendAnnouncement("🩸 Formato de tempo inválido. Use um número seguido de d (Dias), h (Horas), m (Minutos), ou s (Segundos)", player.id, 0xFF0000, "bold", 2);
                        return;
                    }

                    const duration = parseInt(match[1]);
                    const unit = match[2];
                    let muteDuration = 0;
                    switch (unit) {
                        case "d": muteDuration = duration * 24 * 60 * 60 * 1000; break;
                        case "h": muteDuration = duration * 60 * 60 * 1000; break;
                        case "m": muteDuration = duration * 60 * 1000; break;
                        case "s": muteDuration = duration * 1000; break;
                        default:
                            room.sendAnnouncement("🩸 Formato de tempo inválido.", player.id, 0xFF0000, "bold", 2);
                            return;
                    }

                    const muteEndTime = new Date(Date.now() + muteDuration);
                    const timezoneOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
                    const localMuteEndTime = new Date(muteEndTime.getTime() - timezoneOffsetMs);
                    const muteEndTimeFormatted = localMuteEndTime.toISOString().slice(0, 19).replace('T', ' ')

                    // Tenta achar o jogador alvo por menção e aplicar o mute se existir
                    const targetPlayer = room.getPlayerList().find((p: Player) => p.name.toLowerCase() === targetPlayerName.toLowerCase());
                    if (targetPlayer) {
                        const conn = playerConnections.get(targetPlayer.id);
                        const auth = playerAuth.get(targetPlayer.id);
                        const sqlInsert = `INSERT INTO mutes (name, time, reason, muted_by, conn, auth) VALUES (?, ?, ?, ?, ?, ?)`;
                        const valuesInsert = [targetPlayer.name, muteEndTimeFormatted, reason, player.name, conn, auth];
                        con.query(sqlInsert, valuesInsert, (err: any, result: any) => {
                            if (err) throw err;
                            room.sendAnnouncement(`🩸 ${targetPlayer.name} mutado com sucesso!`, null, 0xFFA500, "bold");
                            isMuted[targetPlayer.id] = true;
                        });
                    } else {
                        room.sendAnnouncement("🩸 Jogador não encontrado.", null, 0xFF0000, "bold", 2);
                    }
                });
            }

            else if (words[0] === "!clearmutes") {
                const sql = `SELECT * FROM players WHERE LOWER(name) = LOWER(?)`;
                const values = [player.name];
                con.query(sql, values, (err: any, result: any) => {
                    if (err) throw err;
                    if (result.length === 0 || !loggedInPlayers[player.id] || !(result[0].ceo || result[0].gerente || result[0].admin || result[0].mod)) {
                        room.sendAnnouncement("🩸 Você não tem autorização para usar este comando!", player.id, 0xFF0000, "bold", 2);
                        return;
                    }

                    // Execute o comando para limpar a tabela de mutes
                    con.query(`DELETE FROM mutes`, (err: any, result: any) => {
                        if (err) throw err;
                        room.sendAnnouncement(`🩸 Todos os mutes foram limpos com sucesso!`, null, 0xFFA500, "bold");
                    });
                });
            }

            else if (words[0] === "!clearbans") {
                const sql = `SELECT * FROM players WHERE LOWER(name) = LOWER(?)`;
                const values = [player.name];
                con.query(sql, values, (err: any, result: any) => {
                    if (err) throw err;
                    if (result.length === 0 || !loggedInPlayers[player.id] || !(result[0].ceo || result[0].gerente || result[0].admin || result[0].mod)) {
                        room.sendAnnouncement("🩸 Você não tem autorização para usar este comando!", player.id, 0xFF0000, "bold", 2);
                        return;
                    }

                    // Executa o comando para limpar a tabela de bans
                    con.query(`DELETE FROM bans`, (err: any, result: any) => {
                        if (err) throw err;
                        room.sendAnnouncement(`🩸 Todos os bans foram limpos com sucesso!`, player.id, 0xFFA500, "bold");
                    });
                });
            }
            //LOJA
            if (words[0] === "!bet" || words[0] === "!apostar") {
                const currentTime = new Date();
                const timeDiff = (currentTime.getTime() - matchStartTime.getTime()) / 1000; // diferença de tempo em segundos

                // Verifica se a aposta foi feita nos primeiros 15 segundos da partida
                if (timeDiff > 15) {
                    room.sendAnnouncement(`🩸 ${player.name} Só é permitido apostar nos primeiros 15 segundos da partida.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                // Verifica se há pelo menos 6 jogadores na sala
                if (numberOfPlayers < 6) {
                    room.sendAnnouncement(`🩸 ${player.name} Precisa ter 6 jogadores na sala para apostar.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                // Verifica se o jogador está logado e em um time
                if (loggedInPlayers[player.id]) {
                    let playersGaming = room.getPlayerList().filter((p: Player) => p.team > 0);
                    if (playersGaming.length >= getMaxTeamSize() * 2 && (player.team === 1 || player.team === 2)) {
                        room.sendAnnouncement(`💰 ${player.name} Jogadores que estão em um time não podem apostar.`, player.id, 0xFF0000, "bold", 2);
                        return false;
                    }
                }

                const betTeam = words[1];
                const betValue = parseInt(words[2]);

                // Verifica se a aposta é válida
                if (!betTeam || isNaN(betValue) || (betTeam !== "red" && betTeam !== "blue")) {
                    room.sendAnnouncement(`🩸 ${player.name} Formato inválido. Use: !bet [red/blue] [valor] ou !apostar [red/blue] [valor]`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                // Verifica se o valor da aposta está entre 10 e 5000
                if (betValue < 10 || betValue > 5000) {
                    room.sendAnnouncement(`🩸 ${player.name} O valor da aposta deve estar entre 10 e 5000.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                const teamValue = betTeam === "red" ? 1 : 2;

                con.query(`SELECT id, balance FROM players WHERE name = ?`, [player.name], (err: any, result: any) => {
                    if (err) throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement(`🩸 ${player.name} Você precisa registrar para poder apostar.`, player.id, 0xFF0000, "bold", 2);
                        return false;
                    }

                    const playerId = result[0].id;
                    const playerBalance = result[0].balance;

                    // Verifica se o jogador tem saldo suficiente para apostar
                    if (playerBalance < betValue) {
                        room.sendAnnouncement(`🩸 ${player.name} Você não tem dinheiro suficiente para apostar.`, player.id, 0xFF0000, "bold", 2);
                        return false;
                    }

                    // Verifica se o jogador já fez uma aposta neste jogo
                    con.query(`SELECT * FROM bets WHERE player_id = ? AND room_id = ?`, [playerId, process.env.room_id], (err: any, existingBets: any) => {
                        if (err) throw err;
                        if (existingBets.length > 0) {
                            room.sendAnnouncement(`🩸 ${player.name} Você já fez uma aposta nesse jogo.`, player.id, 0xFF0000, "bold", 2);
                            return false;
                        }

                        // Deduz o valor da aposta do saldo do jogador
                        con.query(`UPDATE players SET balance = balance - ? WHERE id = ?`, [betValue, playerId], (err: any) => {
                            if (err) throw err;

                            // Adiciona a aposta à tabela de apostas
                            con.query(`INSERT INTO bets (player_id, team, value, room_id) VALUES (?, ?, ?, ?)`, [playerId, teamValue, betValue, process.env.room_id], (err: any) => {
                                if (err) throw err;

                                room.sendAnnouncement(`💰 ${player.name} apostou ${betValue} atacoins no time ${betTeam.toUpperCase()}.`, null, 0x00FF00, "bold", 2);
                            });
                        });
                    });
                });

                return false;
            }
            //DOAÇÃO
            let lastDonationTime: { [key: string]: number } = {};

            if (words[0] === "!doarcoins") {
                if (!words[1] || !words[2] || isNaN(parseInt(words[1].substring(1), 10)) || isNaN(parseInt(words[2], 10))) {
                    room.sendAnnouncement(`🩸 Use: !doarcoins [#ID] [quantidade]. Exemplo: !doarcoins #2 50`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                const recipient_id = parseInt(words[1].substring(1), 10); // Aqui usamos substring(1) para remover o '#'
                const amount = parseInt(words[2], 10);

                if (amount < 50 || amount > 1000) {
                    room.sendAnnouncement(`💰 ${player.name}, a quantidade de atacoins para doação deve ser entre 50 e 1000.`, player.id, 0x10F200, "bold", 2);
                    return false;
                }

                const recipient = room.getPlayer(recipient_id);

                if (!recipient) {
                    room.sendAnnouncement(`🩸 ${player.name}, o ID do jogador que você forneceu não é válido.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (recipient.id === player.id) {
                    room.sendAnnouncement(`🩸 ${player.name}, você não pode doar atacoins para si mesmo.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                const currentTime = Date.now();
                const lastDonation = lastDonationTime[player.name] || 0;
                const timeSinceLastDonation = currentTime - lastDonation;

                if (timeSinceLastDonation >= 5 * 60 * 1000) {
                    con.query(`SELECT balance FROM players WHERE name = ?`, [player.name], (err: any, result: any[]) => {
                        if (err) throw err;
                        if (result.length === 0) {
                            room.sendAnnouncement(`🩸 ${player.name}, você precisa se registrar para doar atacoins.`, player.id, 0xFF0000, "bold", 2);
                            return false;
                        }

                        const playerBalance = result[0].balance;
                        if (playerBalance < 50) {
                            room.sendAnnouncement(`💰 ${player.name}, você precisa ter pelo menos 50 atacoins para fazer uma doação.`, player.id, 0x10F200, "bold", 2);
                            return false;
                        } else if (playerBalance < amount) {
                            room.sendAnnouncement(`💰 ${player.name}, você não tem atacoins suficientes para doar.`, player.id, 0x10F200, "bold", 2);
                            return false;
                        }

                        con.query(`UPDATE players SET balance = balance - ? WHERE name = ?`, [amount, player.name], (err: any) => {
                            if (err) throw err;
                        });
                        con.query(`UPDATE players SET balance = balance + ? WHERE name = ?`, [amount, recipient.name], (err: any) => {
                            if (err) throw err;
                        });

                        room.sendAnnouncement(`💰 ${player.name}, você doou ${amount} atacoins para ${recipient.name}.`, player.id, 0x10F200, "bold", 2);
                        room.sendAnnouncement(`💰 ${recipient.name}, você recebeu ${amount} atacoins de ${player.name}.`, recipient.id, 0x10F200, "bold", 2);

                        lastDonationTime[player.name] = currentTime;
                    });
                } else {
                    const remainingTime = Math.ceil((5 * 60 * 1000 - timeSinceLastDonation) / 60000);
                    room.sendAnnouncement(`🕒 ${player.name}, você precisa esperar ${remainingTime} minutos para fazer outra doação.`, player.id, 0xFF0000, "bold", 2);
                }
            }
            //LOJA
            if (words[0] === "!loja") {
                var input = words;
                var action = input[1];
                var itemNumber = parseInt(input[2]); // Convert to integer
                var userId = player.id;
                var userName = player.name;

                var storeItems: { [key: number]: { name: string, cost: number } } = {
                    1: { name: 'VIP', cost: 150000 },
                    2: { name: 'PREMIUM', cost: 250000 },
                    3: { name: 'LEGEND', cost: 300000 }
                };

                if (action === 'comprar' && !isNaN(itemNumber)) {
                    var item = storeItems[itemNumber];
                    if (item) {
                        con.query(`SELECT balance FROM players WHERE name = ?`, [userName], (err: Error, result: any[]) => {
                            if (err) {
                                console.error(err);
                                room.sendAnnouncement(`🩸 Desculpe ${userName}, ocorreu um erro ao verificar seu saldo.`, userId, 0xFF0000, "bold", 2);
                                return;
                            }

                            if (result[0]) {
                                if (result[0].balance >= item.cost) {
                                    con.query(`UPDATE players SET balance = balance - ?, vip = ? WHERE name = ?`, [item.cost, itemNumber, userName], (err: Error, result: any) => {
                                        if (err) {
                                            console.error(err);
                                            room.sendAnnouncement(`🩸 Desculpe ${userName}, ocorreu um erro ao atualizar seu saldo e status VIP.`, userId, 0xFF0000, "bold", 2);
                                            return;
                                        }

                                        if (result.affectedRows > 0) {
                                            room.sendAnnouncement(`🎉 ${userName} acabou de comprar o cargo "${item.name}" na loja!`, null, 0xFFA500, "bold", 2);
                                            room.sendAnnouncement(`🩸 Para atualizar sua nova tag, por favor, saia e entre na sala novamente.`, userId, 0xFF0000, "bold", 2);
                                        } else {
                                            return false;
                                        }
                                    });
                                } else {
                                    room.sendAnnouncement(`🩸 Desculpe ${userName}, você não tem atacoins suficientes para comprar este item.`, userId, 0xFF0000, "bold", 2);
                                }
                            } else {
                                room.sendAnnouncement(`🩸 Desculpe ${userName}, não foi possível encontrar suas informações de jogador.`, userId, 0xFF0000, "bold", 2);
                            }
                        });
                    } else {
                        room.sendAnnouncement(`🩸 Desculpe ${userName}, este item não está disponível na loja.`, userId, 0xFF0000, "bold", 2);
                    }
                } else {
                    var storeMessage = '🛒 Loja de Itens: ';
                    for (var i in storeItems) {
                        storeMessage += `${i}. ${storeItems[i].name} - ${storeItems[i].cost} atacoins, `;
                    }
                    // Remove the trailing comma and space
                    storeMessage = storeMessage.slice(0, -2);
                    room.sendAnnouncement(storeMessage, userId, 0xFFFFFF, "bold", 2);
                    room.sendAnnouncement(`💰 Para comprar um item, digite "!loja comprar <número do item>".`, userId, 0xFF0000, "bold", 2);
                }
            }
            //SALDO
            else if (words[0] === "!meusaldo" || words[0] === "!saldo") {
                con.query(`SELECT balance FROM players WHERE name = ?`, [player.name], (err: any, result: any) => {
                    if (err) throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement(`🩸 ${player.name} Você precisa se registrar para ter um saldo.`, player.id, 0xFF0000, "bold", 2);
                        return false;
                    }

                    const playerBalance = result[0].balance;
                    room.sendAnnouncement(`💰 ${player.name}, seu saldo é de ${playerBalance} atacoins.`, player.id, 0x10F200, "bold", 2);
                });
                return false;
            }



            else if (words[0] == "!provocacoes" || words[0] === "!provos" || words[0] === "!prov") {
                room.sendAnnouncement('Provocações: !oe, !izi, !red, !blue, !paired, !paiblue, !ifood, !chora, !bolso, !divisao, !seupai, !pega, !quentin, !arn, !cag, !dmr, !fran, !furo, !grl, !ini', player.id, 0xFFFFFF, "bold")
            }

            // ---------- PROVOCAÇÕES ------------//

            else if (words[0] === "!arn") {
                room.sendAnnouncement(`${player.name} provocou: Pode isso, Arnaldo? 🤔`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!cag") {
                room.sendAnnouncement(`${player.name} provocou: Cagada 💩`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!dmr") {
                room.sendAnnouncement(`${player.name} provocou: Demora mais!!! 🙄`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!fran") {
                room.sendAnnouncement(`${player.name} provocou: Frango! 🐔`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!furo") {
                room.sendAnnouncement(`${player.name} provocou: Mustela putorius furo, o Furão! 🦦`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!grl") {
                room.sendAnnouncement(`${player.name} provocou: Gorila é sinistro 🦍`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!ini") {
                room.sendAnnouncement(`${player.name} provocou: Inimigo do gol! 👹`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!oe") {
                room.sendAnnouncement(`${player.name} provocou: OEEE! Virou Space Bounce! 😅😅`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!red") {
                room.sendAnnouncement(`${player.name} provocou: Esse era o RED?`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!blue") {
                room.sendAnnouncement(`${player.name} provocou: Esse era o BLUE?`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!divisao") {
                room.sendAnnouncement(`${player.name} provocou: EU SOU O PROBLEMA DA DIVISÃO!!!`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!paired") {
                room.sendAnnouncement(`${player.name} provocou: EU = PAI DO RED𝗞𝗞𝗞𝗞𝗞𝗞🤣😂🤣😂`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!paiblue") {
                room.sendAnnouncement(`${player.name} provocou: EU = PAI DO BLUE𝗞𝗞𝗞𝗞𝗞𝗞🤣😂🤣😂`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!ifood") {
                room.sendAnnouncement(`${player.name} provocou: Olha o ifood! foi aqui que pediram a entrega?`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!chora") {
                room.sendAnnouncement(`${player.name} provocou: CHORA NÃO BEBÊ, SE QUISER CHORAR VAI PRA MATERNIDADE❗👶🏼🍼`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!bolso") {
                room.sendAnnouncement(`${player.name} provocou: Sai do meu bolso ai, ta incomodando.`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!seupai") {
                room.sendAnnouncement(`${player.name} provocou: Chora não!!!! Ja pode me registrar como seu pai.`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!pega") {
                room.sendAnnouncement(`${player.name} provocou: QUERO VER PEGAR ESSA PORRA!!!`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!izi") {
                room.sendAnnouncement(`${player.name} provocou: TEM COMO AUMENTAR O NÍVEL? TÁ MUITO EASY!`, null, 0x39E63C, "bold");
            }
            else if (words[0] === "!quentin") {
                room.sendAnnouncement(`${player.name} provocou: TÁ QUENTINHO AÍ? MEU BOLSO É DE VELUDO!`, null, 0x39E63C, "bold");
            }


            else if (words[0] === "!prev") {
                // Definir redTeam e blueTeam
                const redTeam = activePlayers.filter((p: { team: number; }) => p.team === 1);
                const blueTeam = activePlayers.filter((p: { team: number; }) => p.team === 2);
                // Jogadores insuficientes para previsão
                if ((redTeam.length === 0 || redTeam.length === 1) && blueTeam.length === 0) {
                    room.sendAnnouncement(`🩸 Não há jogadores suficientes para gerar uma previsão.`, player.id, 0xFF0000, "bold", 2);
                }
                // Previsão de vitória
                if (redTeam.length >= 1 && blueTeam.length >= 1) {
                    const team1EloNum = Number(team1Elo);
                    const team2EloNum = Number(team2Elo);
                    const totalElo = team1EloNum + team2EloNum;
                    const team1Chance = (team1EloNum / totalElo) * 100;
                    const team2Chance = (team2EloNum / totalElo) * 100;
                    room.sendAnnouncement(`📊 Previsão de Vitória: 🔴 ${team1Chance.toFixed(2)}% chance de vencer contra 🔵 ${team2Chance.toFixed(2)}% chance de vencer.`, player.id, 0xFFFFFF, "bold");
                }
                // Comando help
            } else if (words[0] === "!help" || words[0] === "!ajuda" || words[0] === "!comandos" || words[0] === "!commands") {
                if (words.length === 1) {
                    const commands = ["!mudarsenha", "!afk", "!listafks", "!discord", "!stats", "t", "!sequencia", "!topsequencia", "!prev", "#", "!uniformes", "!jogos", "!vitorias", "!gols", "!cs", "!assists", "!ricos", "!golscontra", "!provos", "!apostar", "!doarcoins", "!loja", "!saldo"];
                    const adminCommands = ["!ban", "!mute", "!rr2", "!setvip <1, 2 ou 3>", "!setadmin <1, 2, 3 ou 4>"]

                    room.sendAnnouncement(`📃 Comandos: ${commands.join(", ")}`, player.id, 0xFF0000, "bold");

                    if (superadmin[player.id] === 1 || gerentes[player.id] === 1 || admins[player.id] === 1 || mods[player.id] === 1) {
                        room.sendAnnouncement(`🚧 Comandos Staff: ${adminCommands.join(", ")}`, player.id, 0xFFA500, "bold");
                    }
                } else {
                    // Exibe explicação de comando
                    const command = words[1];
                    if (commandExplanations.hasOwnProperty(command)) {
                        room.sendAnnouncement(`🩸 ${command}: ${commandExplanations[command]}`, player.id, 0xFFFFFF, "bold");
                    } else {
                        room.sendAnnouncement(`🩸 Comando "${command}" não encontrado.`, player.id, 0xFF0000, "bold", 2);
                    }
                }
            } else {
                //room.sendAnnouncement(`🩸 ${player.name} esse comando não existe, digite !help para ver a lista de comandos disponíveis.`, player.id, 0xFF0000, "bold", 2);
            }
            return false; // Não enviar comandos para o chat geral.
        }


        const words = message.split(" ");
        if (teamR.length != 0 && teamB.length != 0 && inChooseMode) { //choosing management
            if (player.id == teamR[0].id || player.id == teamB[0].id) { // we care if it's one of the captains choosing
                if (teamR.length <= teamB.length && player.id == teamR[0].id) { // we care if it's red turn && red cap talking
                    if (["top", "auto"].includes(words[0].toLowerCase())) {
                        room.setPlayerTeam(teamS[0].id, Team.RED);
                        redCaptainChoice = "top";
                        clearTimeout(timeOutCap);
                        room.sendAnnouncement(player.name + " escolheu Top!", null, 0xFF0000, 'bold');
                        return false;
                    } else if (["random", "rand"].includes(words[0].toLowerCase())) {
                        var r = getRandomInt(teamS.length);
                        room.setPlayerTeam(teamS[r].id, Team.RED);
                        redCaptainChoice = "random";
                        clearTimeout(timeOutCap);
                        room.sendAnnouncement(player.name + " escolheu Random!", null, 0xFF0000, 'bold');
                        return false;
                    } else if (["bottom", "bot"].includes(words[0].toLowerCase())) {
                        room.setPlayerTeam(teamS[teamS.length - 1].id, Team.RED);
                        redCaptainChoice = "bottom";
                        clearTimeout(timeOutCap);
                        room.sendAnnouncement(player.name + " escolheu Bottom!", null, 0xFF0000, 'bold');
                        return false;
                    } else if (!Number.isNaN(Number.parseInt(words[0]))) {
                        if (Number.parseInt(words[0]) > teamS.length || Number.parseInt(words[0]) < 1) {
                            room.sendAnnouncement("O número que escolheu é inválido!", player.id, 0xFF0000, 'bold');
                            return false;
                        } else {
                            room.setPlayerTeam(teamS[Number.parseInt(words[0]) - 1].id, Team.RED);
                            room.sendAnnouncement(player.name + " escolheu " + teamS[Number.parseInt(words[0]) - 1].name + "!", null, 0xFF0000, 'bold');
                            return false;
                        }
                    }
                }
                if (teamR.length > teamB.length && player.id == teamB[0].id) { // we care if it's red turn && red cap talking
                    if (["top", "auto"].includes(words[0].toLowerCase())) {
                        room.setPlayerTeam(teamS[0].id, Team.BLUE);
                        blueCaptainChoice = "top";
                        clearTimeout(timeOutCap);
                        room.sendAnnouncement(player.name + " escolheu Top!", null, 0xFF0000, 'bold');
                        return false;
                    } else if (["random", "rand"].includes(words[0].toLowerCase())) {
                        room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE);
                        blueCaptainChoice = "random";
                        clearTimeout(timeOutCap);
                        room.sendAnnouncement(player.name + " escolheu Random!", null, 0xFF0000, 'bold');
                        return false;
                    } else if (["bottom", "bot"].includes(words[0].toLowerCase())) {
                        room.setPlayerTeam(teamS[teamS.length - 1].id, Team.BLUE);
                        blueCaptainChoice = "bottom";
                        clearTimeout(timeOutCap);
                        room.sendAnnouncement(player.name + " escolheu Bottom!", null, 0xFF0000, 'bold');
                        return false;
                    } else if (!Number.isNaN(Number.parseInt(words[0]))) {
                        if (Number.parseInt(words[0]) > teamS.length || Number.parseInt(words[0]) < 1) {
                            room.sendAnnouncement("O número que escolheu é inválido!", player.id, 0xFF0000, 'bold');
                            return false;
                        } else {
                            room.setPlayerTeam(teamS[Number.parseInt(words[0]) - 1].id, Team.BLUE);
                            room.sendAnnouncement(player.name + " escolheu " + teamS[Number.parseInt(words[0]) - 1].name + "!", null, 0xFF0000, 'bold');
                            return false;
                        }
                    }
                }
            }
        }

        // Definir a constante para os chats de equipe/staff.
        // Chat Privado
        if (message.startsWith("#")) {
            const player_id = parseInt(message.substring(1), 10);
            const recipient = room.getPlayer(player_id);
            // O usuário está mute
            if (isMuted[player.id] === true) {
                room.sendAnnouncement(`🩸 Você não pode enviar mensagens privadas, aguarde o tempo de mute acabar.`, player.id, 0xFF0000, "bold", 2); // Enviar aviso.
                return false;
                // Usuário não está logado.
            } else if (!loggedInPlayers[player.id] === true) {
                room.sendAnnouncement(`🩸 ${player.name} você precisa fazer login para enviar mensagens.`, player.id, 0xFF0000, "bold", 2);
                return false;
                // ID não inserida.
            } else if (!player_id || isNaN(player_id)) {
                room.sendAnnouncement(`🩸 Você não digitou o ID, para enviar uma msg privada digite #ID <mensagem>`, player.id, 0xff0000, "bold", 2);
                return false;
                // ID não está associada a nenhum jogador.
            } else if (!recipient) {
                room.sendAnnouncement(`🩸 A ID inserida não está associada a nenhum jogador!`, player.id, 0xFF0000, "bold", 2);
                return false;
                // Não permitir enviar mensagem a si mesmo.
            } else if (recipient.id === player.id) {
                room.sendAnnouncement("🩸 Você não pode enviar mensagens para você mesmo!", player.id, 0xFF0000, "bold", 2);
                return false;
                // Tudo bate certo, enviar a DM.
            } else if (recipient) {
                const sender = player.name;
                const formatted_message = `[📩 DM de ${sender}]: ${message.substring(message.indexOf(" ") + 1)}`;
                // Mensagem que o jogador que envia recebe
                room.sendAnnouncement(`[✉️ DM Enviada para ${recipient.name}]: ${message.substring(message.indexOf(" ") + 1)}`, player.id, 0xFFFF00, "bold", 1);
                // Mensagem que o jogador para quem a mensagem foi enviada recebe
                room.sendAnnouncement(formatted_message, recipient.id, 0xFFFF00, "bold", 2);
                return false;
            }
        }
        // Chat staff
        if (words[0] === ".") {
            if (!loggedInPlayers[player.id] === true) {
                room.sendAnnouncement(`🩸 ${player.name} Você precisa fazer login para enviar mensagens.`, player.id, 0xFF0000, "bold", 2);
                return false;
                // É um staff = sim
            } else if (superadmin[player.id] === 1 || gerentes[player.id] === 1 || admins[player.id] === 1 || mods[player.id] === 1) {
                // Sacar a mensagem
                const message = words.slice(1).join(" ");
                // Atualizar quem está na staff
                const playersInStaff = room.getPlayerList().filter((p: { id: string | number; }) => superadmin[p.id] || gerentes[p.id] || admins[p.id] || mods[p.id] === 1 && loggedInPlayers[player.id] === true);
                for (var index = 0; index < playersInStaff.length; index++) {
                    const p = playersInStaff[index];
                    // Enviar a mensagem para todos os usuários da staff.
                    room.sendAnnouncement(`[Chat Staff] ${player.name}: ${message}`, p.id, 0xFFB515, "bold");
                }
                return false; // Não enviar mensagem normal.
                // Se não for staff.
            } else {
                room.sendAnnouncement("🩸 Você não tem permissão para usar esse comando!", player.id, 0xFF0000, "bold", 2);
                return false; // Não enviar mensagem normal.
            }
        }
        // Chat de equipe
        if (words[0] === "t") {
            // Checkar se o usuário está na Equipe 1 ou 2 ou se está mute.
            // O usuário está mute
            if (isMuted[player.id] === true) {
                room.sendAnnouncement(`🩸 Você não pode falar no chat da equipe, aguarde o tempo de mute acabar.`, player.id, 0xFF0000, "bold", 2); // Enviar aviso.
                return false; // Não enviar msg.
            } /* else if (!loggedInPlayers[player.id] === true) {
                room.sendAnnouncement(`🩸 ${player.name} Você precisa fazer login para enviar mensagens.`, player.id, 0xFF0000, "bold", 2);
                return false;
                // Equipe Red
            } */ else if (player.team === 1) {
                // Sacar a mensagem
                const message = words.slice(1).join(" ");
                // Atualizar quem está na equipe RED
                for (var index = 0; index < room.getPlayerList().filter((p: { team: number; }) => p.team == 1).length; index++)
                    if (superadmin[player.id] === 1) {
                        room.sendAnnouncement(
                            `[Equipe Red] ${CeoTag} ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 1)[index].id,
                            0xE56E56,
                            "bold"
                        );
                    } else if (gerentes[player.id] === 1) {
                        room.sendAnnouncement(
                            `[Equipe Red] ${gerentesTag} ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 1)[index].id,
                            0xE56E56,
                            "bold"
                        );
                    } else if (admins[player.id] === 1) {
                        room.sendAnnouncement(
                            `[Equipe Red] ${adminsTag} ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 1)[index].id,
                            0xE56E56,
                            "bold"
                        );
                    } else if (mods[player.id] === 1) {
                        room.sendAnnouncement(
                            `[Equipe Red] ${modsTag} ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 1)[index].id,
                            0xE56E56,
                            "bold"
                        );
                    } else {
                        room.sendAnnouncement(
                            `[Equipe Red] ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 1)[index].id,
                            0xE56E56,
                            "bold"
                        );
                    }

                // Sistema normal
                //room.sendAnnouncement(`[Equipe Red] ${player.name}: ${message}`, room.getPlayerList().filter((p: { team: number; }) => p.team == 1)[index].id, 0xE56E56, "bold");
                return false; // Não enviar mensagem normal.

                // Equipe Blue
            } else if (player.team === 2) {
                // Sacar a mensagem
                const message = words.slice(1).join(" ");
                // Atualizar quem está na equipe BLUE
                for (var index = 0; index < room.getPlayerList().filter((p: { team: number; }) => p.team == 2).length; index++)
                    if (superadmin[player.id] === 1) {
                        room.sendAnnouncement(
                            `[Equipe Blue] ${CeoTag} ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 2)[index].id,
                            0x5689E5,
                            "bold"
                        );
                    } else if (gerentes[player.id] === 1) {
                        room.sendAnnouncement(
                            `[Equipe Blue] ${gerentesTag} ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 2)[index].id,
                            0x5689E5,
                            "bold"
                        );
                    } else if (admins[player.id] === 1) {
                        room.sendAnnouncement(
                            `[Equipe Blue] ${adminsTag} ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 2)[index].id,
                            0x5689E5,
                            "bold"
                        );
                    } else if (mods[player.id] === 1) {
                        room.sendAnnouncement(
                            `[Equipe Blue] ${modsTag} ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 2)[index].id,
                            0x5689E5,
                            "bold"
                        );
                    } else {
                        room.sendAnnouncement(
                            `[Equipe Blue] ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 2)[index].id,
                            0x5689E5,
                            "bold"
                        );
                    }
                // Enviar a mensagem para todos os usuários da equipe do jogador que enviou a mensagem.
                //room.sendAnnouncement(`[Equipe Blue] ${player.name}: ${message}`, room.getPlayerList().filter((p: { team: number; }) => p.team == 2)[index].id, 0x5689E5, "bold");
                return false; // Não enviar mensagem normal.
                // Equipe Spectators
            } else if (player.team === 0) {
                // Sacar a mensagem
                const message = words.slice(1).join(" ");
                // Atualizar quem está na equipe SPECTATORS
                for (var index = 0; index < room.getPlayerList().filter((p: { team: number; }) => p.team == 0).length; index++)
                    if (superadmin[player.id] === 1) {
                        room.sendAnnouncement(
                            `[Espectador] ${CeoTag} ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 0)[index].id,
                            0xF5F5F5,
                            "bold"
                        );
                    } else if (gerentes[player.id] === 1) {
                        room.sendAnnouncement(
                            `[Espectador] ${gerentesTag} ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 0)[index].id,
                            0xF5F5F5,
                            "bold"
                        );
                    } else if (admins[player.id] === 1) {
                        room.sendAnnouncement(
                            `[Espectador] ${adminsTag} ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 0)[index].id,
                            0xF5F5F5,
                            "bold"
                        );
                    } else if (mods[player.id] === 1) {
                        room.sendAnnouncement(
                            `[Espectador] ${modsTag} ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 0)[index].id,
                            0xF5F5F5,
                            "bold"
                        );
                    } else {
                        room.sendAnnouncement(
                            `[Espectador] ${rankTag[player.id]} ${player.name}: ${message}`,
                            room.getPlayerList().filter((p: { team: number; }) => p.team == 0)[index].id,
                            0xF5F5F5,
                            "bold"
                        );
                    }
                // Enviar a mensagem para todos os usuários da equipe do jogador que enviou a mensagem.
                //room.sendAnnouncement(`[Equipe Spectators] ${player.name}: ${message}`, room.getPlayerList().filter((p: { team: number; }) => p.team == 0)[index].id, 0xF5F5F5, "bold");
                return false; // Não enviar mensagem normal
            }
        }

        // Checkar se o jogador está logado para enviar msgs.
        /* if (!loggedInPlayers[player.id] === true) {
            room.sendAnnouncement(`🩸 ${player.name} Você precisa fazer login para enviar mensagens.`, player.id, 0xFF0000, "bold", 2);
        } */
        // Tive de fazer desta maneira pq o return false; em cima n tava a funcionar sabe-se lá porque xd, eu sou nabo em typescript, não julguem...
        /* if (!loggedInPlayers[player.id] === true)
            return false; */

        // Checkar se o jogador está mute
        const conn = playerConnections.get(player.id);
        const auth = playerAuth.get(player.id);
        con.query(`SELECT * FROM mutes WHERE name = ? OR conn = ? OR auth = ?`, [player.name, conn, auth], (err: any, result: any) => {
            if (err) throw err;
            if (result.length > 0) {
                for (const mute of result) {
                    // Reduzir tamanho da data.
                    const muteEndTime = new Date(mute.time);
                    const formattedMuteEndTime = muteEndTime.toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                    });
                    const now = Date.now();
                    if (now < new Date(muteEndTime).getTime()) {
                        isMuted[player.id] = true
                        room.sendAnnouncement(`🩸 ${player.name} Você está mutado até ${formattedMuteEndTime}, motivo: ${result[0].reason}.`, player.id, 0xFF0000, "bold", 2);
                    } else {
                        isMuted[player.id] = false
                        room.sendChat(message);
                    }
                }
            }
        });

        // Se tiver mutado, não enviar mensagem.
        if (!isMuted[player.id] === false)
            return false;

        // Cor do chat.


        var staffTag: any = "";
        var staffColor: any = "";
        var staffFont: any = "";

        var userColor: any = "";
        var userFont: any = "";
        var userLogged: any = "";
        // room.sendAnnouncement(`${confirm.includes(player.id) ? "[✔️]" : "[❌]"}${tirouTagRank.includes(player.id) ? '' : rankTag} ${tirouTagVip.includes(player.id) ? '' : vipTag} ${player.name}: ${message}`, null, cordochat[player.name] ? '0x' + cordochat[player.name] : (corChat != "" ? '0x' + corChat : 0xE0E0E0), fonte != "" ? fonte : null, 1);

        if (superadmin[player.id] === 1) {
            staffTag = CeoTag;
            staffColor = config.cargos_cores.ceo;
            staffFont = "bold";
        } else if (gerentes[player.id] === 1) {
            staffTag = gerentesTag;
            staffColor = config.cargos_cores.gerente;
            staffFont = "bold";
        } else if (admins[player.id] === 1) {
            staffTag = adminsTag;
            staffColor = config.cargos_cores.admin;
            staffFont = "bold";
        } else if (mods[player.id] === 1) {
            staffTag = modsTag;
            staffColor = config.cargos_cores.mod;
            staffFont = "bold";
        } else {
            if (!loggedInPlayers[player.id] === true) {
                userColor = config.cargos_cores.membro;
                userFont = "normal";
                userLogged = "[❌]";
            } else {
                userColor = config.cargos_cores.membro;
                userFont = "normal";
                userLogged = "[✅]";
            }
        }

        room.sendAnnouncement(`${userLogged} ${rankTag[player.id]}${vips[player.id] === 1 ? " " + vipTag : ""}${premiums[player.id] === 1 ? " " + premiumTag : ""}${legends[player.id] === 1 ? " " + legendTag : ""}${staffTag !== "" ? " " + staffTag : ""} ${player.name}: ${message}`, null, staffColor === "" ? userColor : staffColor, staffFont === "" ? userFont : staffFont);
        return false;
    }

    //                 Golos, Assists, AutoGolos                //

    interface Goal {
        assist: Player | null;
        scorer: Player | null;
        reset(): void;
        setPlayer(player: Player): void;
    }

    const Goal: Goal = {
        assist: null,
        scorer: null,
        reset: function () {
            this.assist = null;
            this.scorer = null;
        },

        setPlayer: function (player: Player) {
            if (this.scorer === null || this.scorer.id != player.id) {
                this.assist = this.scorer;
                this.scorer = player;
            }
        }
    }

    function pointDistance(p1: { x: number; y: number; }, p2: { x: number; y: number; }) {
        let d1 = p1.x - p2.x;
        let d2 = p1.y - p2.y;
        return Math.sqrt(d1 * d1 + d2 * d2);
    }

    // Criar função do kickOff
    let kickOff = false;
    room.onGameTick = function () {
        // Kickoff check
        const redTeam = activePlayers.filter((p: { team: number; }) => p.team === 1);
        const blueTeam = activePlayers.filter((p: { team: number; }) => p.team === 2);
        if (redTeam.length >= 1 && blueTeam.length >= 1) {
            if (kickOff == false) {
                if (room.getScores().time != 0) {
                    kickOff = true;
                    // Calcular a chance de vitória.
                    const team1EloNum = Number(team1Elo);
                    const team2EloNum = Number(team2Elo);
                    const totalElo = team1EloNum + team2EloNum;
                    const team1Chance = (team1EloNum / totalElo) * 100;
                    const team2Chance = (team2EloNum / totalElo) * 100;
                    room.sendAnnouncement(`📊 Previsão de Vitória: 🔴 ${team1Chance.toFixed(2)}% chance de vencer contra 🔵 ${team2Chance.toFixed(2)}% chance de vencer.`, null, 0xFFFFFF, "bold", 0);
                    if (redTeam.length >= 2 && blueTeam.length >= 2) {
                        gk = isGk();
                        // Enviar a mensagem apenas para os jogadores em campo
                        let playersGaming = room.getPlayerList().filter((p: Player) => p.team > 0);
                        for (let player of playersGaming) {
                            if (player.team === 1) { // Jogador da equipe vermelha
                                room.sendAnnouncement("🔴 GK do red: " + gk[0].name + ", se for necessário trocar digite !gk", player.id, 0xFFFFFF, "bold", 0);
                            } else if (player.team === 2) { // Jogador da equipe azul
                                room.sendAnnouncement("🔵 GK do blue: " + gk[1].name + ", se for necessário trocar digite !gk", player.id, 0xFFFFFF, "bold", 0);
                            }
                        }
                    }
                }
            }
        }
        // Kick AFK players
        afkKick();
        // Assists & Golos
        handleAssistsAndGoals();
    }

    function isGk() {
        let players = room.getPlayerList();
        if (!players.length) return [];  // Retorna vazio caso não haja jogadores

        // Inicialize min e max com base no primeiro jogador com uma posição definida.
        let min = players.find((p: Player) => p.position !== null);
        let max = min;

        if (!min) return [];  // Retorna vazio se não houver posições de jogadores definidas.

        players.forEach((player: Player) => {
            if (player.position !== null) {
                if (player.position.x < min.position.x) min = player;
                if (player.position.x > max.position.x) max = player;
            }
        });

        return [min, max];  // Retorna os jogadores mais à esquerda e à direita
    }


    function handleAssistsAndGoals() {
        let players = room.getPlayerList();
        let ballPosition = room.getBallPosition();
        let ballRadius = 6.4;
        let playerRadius = 15;
        let triggerDistance = ballRadius + playerRadius + 0.01;
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (player.position == null) continue;
            let distanceToBall = pointDistance(player.position, ballPosition);
            if (distanceToBall < triggerDistance) {
                Goal.setPlayer(player);
            }
        }
    }

    room.onPlayerBallKick = function (player: Player) {
        Goal.setPlayer(player);
    }


    function updatePlayerStatistic(statName: keyof PlayerStatistics[string], playerId: string, value: number) {
        if (!playerStatistics[playerId]) {
            playerStatistics[playerId] = {
                goals: 0,
                assists: 0,
                ag: 0
            }
        }
        playerStatistics[playerId][statName] += value;
    }

    room.onTeamGoal = function (team: any) {
        let OG = Goal.scorer?.team != team; // OG = true if it’s an own goal.
        // Define ActivePlayers
        let activePlayers = room.getPlayerList().filter((p: Player) => {
            return !afkStatus[p.id];
        });

        // Random celebration message for goals
        const frasesGOL = [
            "BALAÇO COSMICO! De que planeta veio? Gol de",
            "GOOOOOOOOOOL! APARECENDO QUANDO MAIS SE NECESSITA!!! EU AMO ESSE CARA! Gol de",
            "BALAÇO COSMICO! De que planeta veio? joga y joga",
            "GOOOOOOOOOOOLLLLLLLLLLLLLLL! TOCA A MUSICA QUE FOI GOL DA LENDA! Gol de",
            "Que loucura de gol acaba de fazer o",
            "GOOOOOOOOOOL! APARECENDO QUANDO MAIS SE NECESSITA",
            "MINHA NOSSA SENHORA!!!! O IMPOSSÍVEL ACONTECEU MEU DEUS DO CÉU!!! Gol de",
            "QUE GOLAÇOOOOO de",
            "IMPRESSIONANTE O CHUTE DO",
            "🔥🔥🔥 TÁ ON FIRE O"
        ];

        // Random celebration message for assists
        const frasesASS = [
            "E QUEM BOTOU A BOLA NO PÉ DELE FOI O",
            "EU AMO ESSE CARA!",
            "PASSE COM A MÃO DE",
            "Assistência fenomenal de"
        ];

        const golcontra = [
            "TROLA Y TROLLA",
            "Pette faz pior...",
            "Animal demais o",
            "INCRIVEL O QUE ESSA LENDA FAZ, MAS SERIA MELHOR SE FOSSE PARA O OUTRO LADO NÉ",
            "PARABÉNS!! AGORA TENTA DO OUTRO LADO...",
            "ERROU O LADO! RUIM DEMAIS,"
        ]

        let randomPhraseGol = frasesGOL[Math.floor(Math.random() * frasesGOL.length)];
        let randomPhraseAss = frasesASS[Math.floor(Math.random() * frasesASS.length)];
        let randomOwnGoalPhrase = golcontra[Math.floor(Math.random() * golcontra.length)];

        if (activePlayers.length >= 2) {
            var ballSpeed = getBallSpeed();
            let color = team === 1 ? 0xEE3A3A : 0x035FFF; // Red for team 1, blue for team 2

            if (OG && Goal.scorer !== null) {
                updatePlayerStatistic("ag", Goal.scorer.id.toString(), 1);
                room.sendAnnouncement(`⚽ ${randomOwnGoalPhrase} ${Goal.scorer.name}!!`, null, color, "bold");
                console.log(`${Goal.scorer.name}, scored an own goal.`);
            } else if (Goal.scorer !== null) {
                updatePlayerStatistic("goals", Goal.scorer.id.toString(), 1);
                if (Goal.assist !== null && Goal.assist.team == team) {
                    updatePlayerStatistic("assists", Goal.assist.id.toString(), 1);
                    room.sendAnnouncement(`⚽ ${randomPhraseGol} ${Goal.scorer.name}!! ${randomPhraseAss} ${Goal.assist.name}!`, null, color, "bold");
                    console.log(`${Goal.scorer.name} scored a goal with assistance from ${Goal.assist.name}.`);
                } else {
                    room.sendAnnouncement(`⚽ ${randomPhraseGol} ${Goal.scorer.name} (${ballSpeed.toPrecision(4).toString()} km/h)!`, null, color, "bold");
                    console.log(`${Goal.scorer.name} scored a goal.`);
                }
            }
        }

        // Additional game logic here
        // Reset goals
        Goal.reset();
    }




    function getBallSpeed() {
        var ballProp = room.getDiscProperties(0);
        return Math.sqrt(ballProp.xspeed ** 2 + ballProp.yspeed ** 2) * speedCoefficient;
    }
    var speedCoefficient = 100 / (5 * (0.99 ** 60 + 1));

    // Função para resetar estátisticas locais.
    function resetPlayerStatistics() {
        for (const playerId in playerStatistics) {
            playerStatistics[playerId].goals = 0;
            playerStatistics[playerId].assists = 0;
            playerStatistics[playerId].ag = 0;
        }
    }

    //                      Quando o jogo começa                    //

    room.onGameStart = () => {
        // Verifique se há 3 jogadores em cada time
        const team1Players = room.getPlayerList().filter((p: any) => p.team === 1);
        const team2Players = room.getPlayerList().filter((p: any) => p.team === 2);

        if (team1Players.length === 3 && team2Players.length === 3) {
            matchStartTime = new Date();

            room.pauseGame(true);
            room.sendAnnouncement(`💰 Jogo pausado por 5 segundos para as apostas.`, null, 0x10F200, "bold", 2);

            setTimeout(function () {
                room.pauseGame(false);
            }, 5000);
            room.sendAnnouncement("💰 Para apostar digite !bet [red/blue] [valor]", null, 0x10F200, "bold", 0);
            room.sendAnnouncement("💰 Após iniciada a partida, você tem 15 segundos para apostar", null, 0x10F200, "bold", 0);

            // Agendar o envio da mensagem após 15 segundos
            setTimeout(() => {
                room.sendAnnouncement("💰 Apostas encerradas!", null, 0x10F200, 'bold');
            }, 15000);  // 15000 milissegundos equivalem a 15 segundos
        }

        endGameVariable = false;
        gameState = State.PLAY

        // Atividade
        team1Players.forEach((p: Player) => {
            activities[p.id] = Date.now();
        });
        team2Players.forEach((p: Player) => {
            activities[p.id] = Date.now();
        });

        // Se estiverem 6 jogadores em jogo (3 em cada equipe mandar esta mensagem)
        if (team1Players.length === getMaxTeamSize() && team2Players.length === getMaxTeamSize()) {
            // room.sendAnnouncement(`📊 Tem ${getMaxTeamSize() * 2} jogadores em campo, o resultado irá contar para as estatísticas/status!`, null, 0x00FF00, "bold", 0);
            room.pauseGame(true);
            setTimeout(() => { //Só pra garantir
                room.pauseGame(false);
            }, 10);
        }

        room.startRecording();
        atualizaElosTimes();
    }

    function consultaElo(player: any) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT elo FROM stats WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?`,
                [player.name, process.env.room_id], (err: any, result: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].elo);
                    }
                });
        });
    }

    async function atualizaElosTimes() {
        const team1Players = room.getPlayerList().filter((p: any) => p.team === 1);
        const team2Players = room.getPlayerList().filter((p: any) => p.team === 2);

        if (team1Players.length >= 1 && team2Players.length >= 1) {
            for (const player of team1Players) {
                try {
                    var elo: any = await consultaElo(player);
                    team1Elo += elo;
                } catch (err) {
                    console.error(err);
                }
            }

            for (const player of team2Players) {
                try {
                    var elo: any = await consultaElo(player);
                    team2Elo += elo;
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }

    function getRoomCode() {
        if (roomName == null) return 'SALA';
        let parts = roomName.split("|");
        if (parts.length > 2) {
            let namePart = parts[2].split(" ")[1]; // Supondo que "x3" esteja sempre seguido por um espaço
            return namePart;
        } else {
            return 'SALA';
        }
    }

    function sendRecordToDiscord(recording: any) {
        const channel = client.channels.cache.get(roomReplaysChannel);

        if (!channel) {
            console.error('Canal não encontrado!');
            return;
        }

        const recordingBuffer = Buffer.from(recording);
        const fileName = `${getRoomCode()}-${getDate()}.hbr2`;

        channel.send({
            files: [{
                attachment: recordingBuffer,
                name: fileName
            }]
        })
            .catch(console.error);
    }

    room.onGameStop = () => {
        handleEndOfGame(winningTeam);
        sendRecordToDiscord(room.stopRecording());
        // Limpar GK's
        gk = [null, null];
        executed = false;
        // Limpar o kickoff
        kickOff = false;
        endGameVariable = true;

        gameState = State.STOP;

        const players = room.getPlayerList();
        for (const player of players) {
            handleRanks(player); // Definir avatares.
        }
        // Resetar as estatiscas locais
        resetPlayerStatistics();
        eloPointsWin = 0;
        eloPointsLost = 0;
        team1Elo = 0;
        team2Elo = 0;
        players.length >= 2 * getMaxTeamSize() - 1 ? activateChooseMode() : null;
        updateTeams();
        if (inChooseMode) {
            allowAFK = false
            setTimeout(() => {
                allowAFK = true
            }, 2000)
            if (players.length == 2 * getMaxTeamSize()) {
                inChooseMode = false;
                resetBtn();
                for (var i = 0; i < getMaxTeamSize(); i++) {
                    setTimeout(() => {
                        randomBtn();
                    }, 400 * i);
                }
                setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else {
                if (winningTeam == Team.RED) {
                    blueToSpecBtn();
                } else if (winningTeam == Team.BLUE) {
                    redToSpecBtn();
                    blueToRedBtn();
                } else {
                    resetBtn();
                }
                setTimeout(() => {
                    topBtn();
                }, 1000);
            }
        } else {
            if (players.length == 2) {
                if (winningTeam == Team.BLUE) {
                    room.setPlayerTeam(teamB[0].id, Team.RED);
                    room.setPlayerTeam(teamR[0].id, Team.BLUE);
                    // swapUniform();
                }
                setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else if (players.length == 3 || players.length >= 2 * getMaxTeamSize() + 1) {
                if (winningTeam == Team.RED) {
                    blueToSpecBtn();
                } else {
                    redToSpecBtn();
                    blueToRedBtn();
                }
                setTimeout(() => {
                    topBtn();
                }, 200);
                setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else if (players.length == 4) {
                resetBtn();
                setTimeout(() => {
                    randomBtn();
                    setTimeout(() => {
                        randomBtn();
                    }, 500);
                }, 500);
                setTimeout(() => {
                    room.startGame();
                }, 2000);
            } else if (players.length == 5 || players.length >= 2 * getMaxTeamSize() + 1) {
                if (winningTeam == Team.RED) {
                    blueToSpecBtn();
                } else {
                    redToSpecBtn();
                    blueToRedBtn();
                }
                setTimeout(() => {
                    topBtn();
                }, 200);
                activateChooseMode();
            } else if (players.length == 6) {
                resetBtn();
                setTimeout(() => {
                    randomBtn();
                    setTimeout(() => {
                        randomBtn();
                        setTimeout(() => {
                            randomBtn();
                        }, 500);
                    }, 500);
                }, 500);
                setTimeout(() => {
                    room.startGame();
                }, 2000);
            }
        }
    }

    // Função para atualizar o saldo do jogador caso tenha apostado no time vencedor.
    function handleEndOfGame(winningTeam: number) {
        con.query(`SELECT * FROM bets WHERE room_id = ?`, [process.env.room_id], (err: any, bets: any) => {
            if (err) throw err;

            bets.forEach((bet: any) => {
                if ((winningTeam === 1 && bet.team === 'red') || (winningTeam === 2 && bet.team === 'blue')) {
                    // Jogador ganhou a bet
                    const winningAmount = bet.value * 2; // Ganha o dobro do que apostou
                    console.log(`Player ID ${bet.player_id} ganhou ${winningAmount}`);

                    con.query(`UPDATE players SET balance = balance + ? WHERE id = ?`, [winningAmount, bet.player_id], (err: any) => {
                        if (err) throw err;

                        // Notify the player
                        con.query(`SELECT name FROM players WHERE id = ?`, [bet.player_id], (err: any, result: any) => {
                            if (err) throw err;
                            const playerName = result[0].name;
                            room.sendAnnouncement(`🎉 ${playerName} ganhou ${winningAmount} atacoins por apostar no time ${winningTeam === 1 ? "RED" : "BLUE"}!`, null, 0x00FF00, "bold", 2);
                        });
                    });
                }
            });

            // Limpa a tabela de bets
            con.query(`DELETE FROM bets WHERE room_id = ?`, [process.env.room_id], (err: any) => {
                if (err) throw err;
            });
        });
    }

    //                                                            //
    //                                                            //
    //                Quando equipe ganha                         //
    //                                                            //
    //                                                            //

    room.onTeamVictory = (scores: any) => {
        // Sacar winningTeam & losingTeam
        trackWinningTeam();
        // Definir ActivePlayers
        activePlayers = room.getPlayerList().filter((p: Player) => {
            return !afkStatus[p.id];
        });

        const playersOnTeam = activePlayers.filter((p: { team: number; }) => p.team === 1 || p.team === 2);
        if (playersOnTeam.length >= getMaxTeamSize() * 2) { // Número de jogadores necessários nas equipes para contar para as stats.
            distribuirStats(playerStatistics);

            // WinStreak
            con.query('SELECT games FROM streak', (err: any, result: string | any[]) => {
                if (err) {
                    console.error(err);
                    return;
                }

                if (result.length === 0) {
                    console.error("Tabela streak sem resultado.");
                    return;
                }
                const games = result[0].games;
                // Comparar streak atual com o recorde.
                if (winstreak > games) {
                    // Dar update da tabela.
                    const playersOnTeam1 = activePlayers.filter((p: { team: number; }) => p.team === 1);
                    const player1 = playersOnTeam1[0].name;
                    const player2 = playersOnTeam1[1].name;
                    const player3 = playersOnTeam1[2].name;
                    const sql = `UPDATE streak SET games = ?, player1 = ?, player2 = ?, player3 = ?`;
                    con.query(sql, [winstreak, player1, player2, player3], (err: any, result: any) => {
                        if (err) {
                            console.error(err);
                        } else if (!TopStreakBatida) {
                            TopStreakBatida = true;
                            room.sendAnnouncement(`🏆 O recorde de streak da sala foi batido! Parabéns a equipe 🔴!`, null, 0xFF0000, "bold", 2);
                            console.log("Um novo recorde foi batido, tabela Streak atualizada.");
                        }
                    });
                }
            });

            if (winningTeam === 1) {
                winstreak++;
            } else if (winningTeam === 2) {
                winstreak = 1;
                TopStreakBatida = false;
            }

            // Adicionar atacoins para o time vencedor
            for (let player of activePlayers.filter((p: { team: number; }) => p.team === winningTeam)) {
                con.query(`UPDATE players SET balance = balance + 50 WHERE name = ?`, [player.name], (err: any, result: any) => {
                    if (err) throw err;
                });
            }
        }
        // Terminar jogo.
        room.stopGame();

        // Distribuição de jogadores por equipe
        // const losingTeamPlayers = activePlayers.filter((p: { team: number; }) => p.team === losingTeam);
        // const winningTeamPlayers = activePlayers.filter((p: { team: number; }) => p.team === winningTeam);
        // const spectatorPlayers = activePlayers.filter((p: { team: number; }) => p.team === 0);
        // const numberOfPlayersToMove = Math.min(losingTeamPlayers.length, spectatorPlayers.length);
        // const numberOfPlayersToMove2 = Math.min(winningTeamPlayers.length, losingTeamPlayers.length);
        // const numberOfPlayersToMove3 = Math.min(losingTeamPlayers.length, spectatorPlayers.length);

        // Se ganhar a BLUE
        // if (playersOnTeam.length >= 2 && winningTeam === 2) {
        //     for (let w = 0; w < numberOfPlayersToMove2; w++) {
        //         room.setPlayerTeam(losingTeamPlayers[w].id, winningTeam);
        //         room.setPlayerTeam(winningTeamPlayers[w].id, losingTeam);
        //     }
        //     if (spectatorPlayers.length > 0) {
        //         for (let i = 0; i < numberOfPlayersToMove3; i++) {
        //             if (losingTeamPlayers[i]) {
        //                 room.setPlayerTeam(losingTeamPlayers[i].id, 0);
        //             }
        //             if (spectatorPlayers[i]) {
        //                 room.setPlayerTeam(spectatorPlayers[i].id, 2)
        //             }
        //         }
        //     }
        //     // Se ganhar a RED
        // } else {
        //     for (let i = 0; i < numberOfPlayersToMove; i++) {
        //         if (losingTeamPlayers[i]) {
        //             room.setPlayerTeam(losingTeamPlayers[i].id, 0);
        //         }
        //         if (spectatorPlayers[i]) {
        //             room.setPlayerTeam(spectatorPlayers[i].id, losingTeam);
        //         }
        //     }
        // }
        // // Iniciar Jogo.
        // room.startGame();
    }

    room.onPlayerTeamChange = (player: any, byPlayer: any) => {
        // Atividade
        if (player != null) {
            activities[player.id] = Date.now();
        }
        // Se mudarem o jogador de equipe e o jogador estiver AFK, volta para os spectators.
        if (player.team === 1 || player.team === 2) {
            if (afkStatus[player.id] === 1) {
                room.setPlayerTeam(player.id, 0);
            }
        }
        // Se o jogador for movido e não tiver login, volta para os spectators.
        // if (!loggedInPlayers[player.id] === true) {
        //     room.setPlayerTeam(player.id, 0);
        // }
        // Atualizar esta merda xd
        activePlayers = room.getPlayerList().filter((p: Player) => {
            return !afkStatus[p.id];
        });
        updateTeams();
        if (inChooseMode && resettingTeams == false && !byPlayer) {
            if (Math.abs(teamR.length - teamB.length) == teamS.length) {
                deactivateChooseMode();
                resumeGame();
                var b = teamS.length;
                if (teamR.length > teamB.length) {
                    for (var i = 0; i < b; i++) {
                        setTimeout(() => {
                            if (teamS[0]) {
                                room.setPlayerTeam(teamS[0].id, Team.BLUE);
                            }
                        }, 200 * i);
                    }
                } else {
                    for (var i = 0; i < b; i++) {
                        setTimeout(() => {
                            if (teamS[0]) {
                                room.setPlayerTeam(teamS[0].id, Team.RED);
                            }
                        }, 200 * i);
                    }
                }
                return;
            } else if ((teamR.length == getMaxTeamSize() && teamB.length == getMaxTeamSize()) || (teamR.length == teamB.length && teamS.length < 2)) {
                deactivateChooseMode();
                resumeGame();
            } else if (teamR.length <= teamB.length && redCaptainChoice != "") { // choice remembered
                redCaptainChoice == "top" ? room.setPlayerTeam(teamS[0].id, Team.RED) : redCaptainChoice == "random" ? room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.RED) : room.setPlayerTeam(teamS[teamS.length - 1].id, Team.RED);
                return;
            } else if (teamB.length < teamR.length && blueCaptainChoice != "") {
                blueCaptainChoice == "top" ? room.setPlayerTeam(teamS[0].id, Team.BLUE) : blueCaptainChoice == "random" ? room.setPlayerTeam(teamS[getRandomInt(teamS.length)].id, Team.BLUE) : room.setPlayerTeam(teamS[teamS.length - 1].id, Team.BLUE);
                return;
            } else {
                choosePlayer();
            }
        } else if (byPlayer) {
            updateRoleOnPlayerIn();
        }
        if (!endGameVariable) {
            atualizaElosTimes();
        }
    }

    function resumeGame() {
        setTimeout(() => {
            room.startGame();
        }, 2000);
        setTimeout(() => {
            room.pauseGame(false);
        }, 1000);
    }

    //                         Função quando o player saí da room                       //
    var capLeft: boolean = false;
    room.onPlayerLeave = (player: any, scores: any) => {
        delete rankTag[player.id];
        if (teamR.findIndex((red) => red.id == player.id) == 0 && inChooseMode && teamR.length <= teamB.length) {
            choosePlayer();
            capLeft = true;
            setTimeout(() => {
                capLeft = false;
            }, 10);
        }
        if (teamB.findIndex((blue) => blue.id == player.id) == 0 && inChooseMode && teamB.length < teamR.length) {
            choosePlayer();
            capLeft = true;
            setTimeout(() => {
                capLeft = false;
            }, 10);
        }

        const playerList = room.getPlayerList();
        updateNumberOfPlayers(playerList);

        // Checkar a database se o jogador está logado
        const sql = `SELECT * FROM players WHERE name = ?`;
        const values = [player.name];
        con.query(sql, values, (err: any, result: any) => {
            if (err) throw err;

            if (result.length > 0) {
                if (result[0].loggedIn === 1) {
                    activePlayers = room.getPlayerList().filter((p: Player) => {
                        return !afkStatus[p.id];
                    });

                    const redTeam = activePlayers.filter((p: { team: number; }) => p.team === 1);
                    const blueTeam = activePlayers.filter((p: { team: number; }) => p.team === 2);
                    /* if (redTeam.length >= 2 && blueTeam.length >= 2) {
                        // Aplicar o ban
                        if (player.team !== 0) {
                            // Adicionar 1 minuto de ban.
                            const sql = `INSERT INTO bans (name, time, reason, banned_by) VALUES (?, DATE_ADD(NOW(), INTERVAL 1 MINUTE), ?, ?)`;
                            const values = [player.name, "🩸 Abandonou no meio do jogo (1m)", "Sistema"];
                            con.query(sql, values, (err: any, result: any) => {
                                if (err) {
                                    console.log(err);
                                    throw err;
                                }
                            });
                        }
                    } */

                    // Remover jogador da variável local.
                    delete activities[player.id];
                    // Quando um jogador sai tirar o login.
                    const sql = `SELECT game_id FROM players WHERE LOWER(name) = LOWER(?)`;
                    const values = [player.name];
                    con.query(sql, values, (err: any, result: { game_id: any; }[]) => {
                        if (err) throw err;
                        if (result[0] && result[0].game_id === player.id) { // Resolvido o problema do jogo crashar.
                            const sql = `UPDATE players SET game_id = 0, loggedIn = 0 WHERE LOWER(name) = LOWER(?)`;
                            const values = [player.name];
                            con.query(sql, values, (err: any) => {
                                if (err) throw err;
                                console.log(`${player.name} saiu da sala.`);
                            });
                        }
                    });

                    // Limpar player.auth / player.conn / player.ipv4
                    playerAuth.delete(player.id);
                    playerConnections.delete(player.id);
                    playerIpv4.delete(player.id);
                    // Resetar os valores das variáveis locais. (Não é necessário pois a id é sempre diferente, mas eu gosto de limpar td)
                    afkStatus[player.id] = 0;
                    // Aqui é necessário
                    loggedInPlayers[player.id] = false;

                    // Verifica se o jogador que saiu fez uma aposta
                    con.query(`SELECT * FROM bets WHERE player_id = ? AND room_id = ?`, [player.id, process.env.room_id], (err: any, existingBets: string | any[]) => {
                        if (err) throw err;
                        if (existingBets.length > 0) {
                            // Cancela a aposta e reembolsa o jogador
                            con.query(`DELETE FROM bets WHERE player_id = ? AND room_id = ?`, [player.id, process.env.room_id], (err: any) => {
                                if (err) throw err;
                                con.query(`UPDATE players SET balance = balance + ? WHERE id = ?`, [existingBets[0].value, player.id], (err: any) => {
                                    if (err) throw err;
                                    room.sendAnnouncement(`💰 A aposta de ${player.name} foi cancelada e ${existingBets[0].value} atacoins foram reembolsados.`, null, 0x00FF00, "bold", 2);
                                });
                            });
                        }
                    });
                }
            }
        });
        updateRoleOnPlayerOut();
    }
});

export { room };
