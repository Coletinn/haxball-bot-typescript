"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.room = exports.updateNumberOfPlayers = exports.numberOfPlayers = exports.passwordLegend = exports.passwordPremium = exports.passwordVip = exports.playerIpv4 = exports.playerAuth = exports.playerConnections = exports.buscarUsuarioPorNome = exports.registroDiscord = exports.unsavedUsers = exports.createChannelMessage = exports.setRoomStatusChannel = exports.setRoomEntradasChannel = exports.setRoomErrorsChannel = exports.setRoomReplayChannel = exports.setRoomLogChannel = exports.roomStatusChannel = exports.roomEntradasChannel = exports.roomErrorsChannel = exports.roomReplaysChannel = exports.roomLogChannel = exports.teamS = exports.teamB = exports.teamR = exports.roomName = exports.discord = exports.passName = exports.goalName = void 0;
require('dotenv').config();
if (Number(process.env.maxTeamSize) == 0 || Number(process.env.maxGoals) == 0 || Number(process.env.timeLimit) == 0 || process.env.room_id == undefined) {
    console.error("Necessário as variáveis de ambiente 'maxTeamSize', 'maxGoals' e 'room_id'.");
    process.exit(1);
}
var dbConnection_1 = require("./src/Room/Config/dbConnection");
var HaxballJS = require("haxball.js");
var bcrypt = require('bcrypt');
var fs = require("fs");
var NoGoal = fs.readFileSync('./stadiums/nogoal.hbs', 'utf8'); // Mapa 1
var Aquecimento = fs.readFileSync('./stadiums/Aquecimento.hbs', 'utf8'); // Mapa 2
var nomeMapa = (_a = process.env.mapa) !== null && _a !== void 0 ? _a : 'x3';
var Mapa = fs.readFileSync("./stadiums/".concat(nomeMapa, ".hbs"), 'utf8'); // Mapa 3
var readline = require('readline');
var config = require('./config.json');
var FormData = require('form-data');
var axios = require('axios');
var discord_js_1 = require("discord.js");
var client_1 = require("./src/Client/client");
require("./src/Client/Modals");
require("./src/Discord/Commands/SlashCommands/Membros/registrar");
require("./src/Discord/Commands/SlashCommands/ceo/clear-bans");
require("./src/Discord/Commands/SlashCommands/ceo/config");
require("./src/Discord/Commands/SlashCommands/admins/send");
require("./src/Discord/Commands/SlashCommands/admins/resetball");
require("./src/Room/Functions/getStaffOnline");
require("./src/Discord/Commands/SlashCommands/Membros/players");
require("./src/Discord/Config/images");
require("./src/Discord/Commands/SlashCommands/admins/kick");
// import { roomLogChannel, roomReplaysChannel } from './src/Client/Modals';
var errors_1 = require("./src/Room/Config/errors");
var cores_1 = require("./src/Room/Config/cores");
var entrada_1 = require("./src/Room/Functions/entrada");
var calladmin_1 = require("./src/Room/Commands/calladmin");
var ChooseUni_1 = require("./src/Room/Functions/ChooseUni");
exports.goalName = null;
exports.passName = null;
exports.discord = config.discord;
exports.roomName = (_b = process.env.SERVERNAME) !== null && _b !== void 0 ? _b : '🩸 BORE ARENE 🩸 | X3 | FUTSAL'; // Dps tu altera o nome da sala
exports.teamR = [];
exports.teamB = [];
exports.teamS = [];
exports.roomLogChannel = null;
exports.roomReplaysChannel = null;
exports.roomErrorsChannel = null;
exports.roomEntradasChannel = null;
exports.roomStatusChannel = null;
//Tudo que precisar de conexão com a database deve ser colocado abaixo desta linha.
//TODO: Mover tudo de DB para outro lugar futuramente
var uniformes_1 = require("./src/Room/Config/uniformes");
function loadConfig() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, dbConnection_1.getConexaoEstabelecida)()];
                case 1:
                    _a.sent();
                    dbConnection_1.con.query("SELECT * FROM rooms WHERE id = ?", [process.env.room_id], function (err, result) {
                        if (err)
                            throw err;
                        if (result.length > 0) {
                            exports.roomLogChannel = result[0].log;
                            exports.roomReplaysChannel = result[0].replay;
                            exports.roomErrorsChannel = result[0].error;
                            exports.roomEntradasChannel = result[0].join;
                            exports.roomStatusChannel = result[0].status;
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
loadConfig();
var setRoomLogChannel = function (log) {
    dbConnection_1.con.query("UPDATE rooms SET log = ? WHERE id = ?", [log, process.env.room_id], function (err, result) {
        if (err)
            throw err;
        exports.roomLogChannel = log;
    });
};
exports.setRoomLogChannel = setRoomLogChannel;
var setRoomReplayChannel = function (replay) {
    dbConnection_1.con.query("UPDATE rooms SET replay = ? WHERE id = ?", [replay, process.env.room_id], function (err, result) {
        if (err)
            throw err;
        exports.roomReplaysChannel = replay;
    });
};
exports.setRoomReplayChannel = setRoomReplayChannel;
var setRoomErrorsChannel = function (error) {
    dbConnection_1.con.query("UPDATE rooms SET error = ? WHERE id = ?", [error, process.env.room_id], function (err, result) {
        if (err)
            throw err;
        exports.roomErrorsChannel = error;
    });
};
exports.setRoomErrorsChannel = setRoomErrorsChannel;
var setRoomEntradasChannel = function (join) {
    dbConnection_1.con.query('UPDATE rooms SET `join` = ? WHERE id = ?', [join, process.env.room_id], function (err, result) {
        if (err)
            throw err;
        exports.roomEntradasChannel = join;
    });
};
exports.setRoomEntradasChannel = setRoomEntradasChannel;
var setRoomStatusChannel = function (status) {
    dbConnection_1.con.query("UPDATE rooms SET status = ? WHERE id = ?", [status, process.env.room_id], function (err, result) {
        if (err)
            throw err;
        exports.roomStatusChannel = status;
    });
};
exports.setRoomStatusChannel = setRoomStatusChannel;
function createChannelMessage(channelName, channelId) {
    return channelId ?
        "\uD83E\uDE78 - Canal de ".concat(channelName, " **(<#").concat(channelId, ">)**\n") :
        "\u274C - Canal de ".concat(channelName, "\n");
}
exports.createChannelMessage = createChannelMessage;
// Abrir variavel para timeout do jogador.
var timeoutIds = {};
// Definir player
var player;
var playerStatistics = {};
// Definir AFK
var afkStatus = {};
var loggedInPlayers = {};
var isMuted = {};
// Definir equipe que ganha perde
var winningTeam;
var losingTeam;
// Definir elo ganho
var eloPointsWin = 0;
var eloPointsLost = 0;
// Variáveis da previsão de vitória
var team1Elo = 0;
var team2Elo = 0;
// Variável WinStreak.
var winstreak = 0;
// Variável dos GK
var gk = Array(2); // Array de 2, 1 GK red / 1 GK blue
// Assuming you have a variable to track match start time
var matchStartTime;
exports.unsavedUsers = {};
var nextUserId = 1;
function registroDiscord(nomeDele, senhaDele) {
    var userId = nextUserId;
    nextUserId++;
    if (!exports.unsavedUsers[userId]) {
        exports.unsavedUsers[userId] = {};
    }
    var randomString = generateRandomString();
    exports.unsavedUsers[userId].nick = nomeDele;
    exports.unsavedUsers[userId].senha = senhaDele;
    exports.unsavedUsers[userId].generatedPassword = randomString;
    var returnContent = {
        id: userId,
        name: nomeDele,
        password: senhaDele,
        generated: "".concat(randomString) // Invoca a função aqui
    };
    return returnContent;
}
exports.registroDiscord = registroDiscord;
function buscarUsuarioPorNome(nome) {
    for (var userId in exports.unsavedUsers) {
        if (exports.unsavedUsers.hasOwnProperty(userId)) {
            if (exports.unsavedUsers[userId].nick === nome) {
                return exports.unsavedUsers[userId];
            }
        }
    }
    return undefined; // Retorna undefined se nenhum usuário for encontrado com o nome fornecido
}
exports.buscarUsuarioPorNome = buscarUsuarioPorNome;
function generateRandomString() {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < 20; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}
function decryptHex(conn) {
    var matches = conn.match(/.{1,2}/g);
    if (matches === null) {
        return '';
    }
    return matches.map(function (v) {
        return String.fromCharCode(parseInt(v, 16));
    }).join('');
}
// Variável da Staff
var superadmin = {};
var gerentes = {};
var admins = {};
var mods = {};
var vips = {};
var premiums = {};
var legends = {};
// Preciso disto para o Ban ser mais fidedigno
exports.playerConnections = new Map();
exports.playerAuth = new Map();
exports.playerIpv4 = new Map();
// Para não executar o CS + que 1 vez.
var executed = false;
// Variável de quando a topstreak é batida enviar apenas o announcement 1x.
var TopStreakBatida = false;
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
var palavrasRacismo = ["macaco", "primata", "negrinho", "negrinha", "mascaico", "makako", "makaka", "makakinho", "makakinha"], regexRacismo = new RegExp(palavrasRacismo.join("|"), 'gi');
var palavrasSuicidio = ["se suicida", "se corta"], regexSuicidio = new RegExp(palavrasSuicidio.join("|"), 'gi');
exports.passwordVip = getRandomInt2(10000, 97999);
exports.passwordPremium = getRandomInt2(10000, 98999);
exports.passwordLegend = getRandomInt2(10000, 99999);
function getRandomInt2(min, max) {
    return Math.floor(Math.random() * (max - min) + 1);
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
// Explicações do que cada comando faz.
var commandExplanations = {
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
var room;
exports.numberOfPlayers = 0;
function updateNumberOfPlayers(playerList) {
    exports.numberOfPlayers = playerList.length;
}
exports.updateNumberOfPlayers = updateNumberOfPlayers;
var rl = readline.createInterface({
    input: process.stdin,
    // output: process.stdout,
});
// Lidar com entrada de comando do usuário
rl.on("line", function (input) {
    if (input === "exit") {
        rl.close();
        process.exit(0);
    }
    else if (input == "players") {
        console.log(room.getPlayerList());
        console.log("N\u00FAmero de jogadores: ".concat(exports.numberOfPlayers));
    }
    else if (input.startsWith("eval ")) {
        var codeToEvaluate = input.slice(5);
        try {
            var result = eval(codeToEvaluate);
            console.log("Resultado da avaliação:", result);
        }
        catch (error) {
            console.error("Erro na avaliação:", error);
        }
    }
    rl.prompt();
});
rl.on("close", function () {
    console.log("Encerrando servidor.");
    process.exit(0);
});
process.on('SIGINT', function () {
    console.log('Encerrando a sala...');
    process.exit(0);
});
client_1.default.login(process.env.DISCORDTOKEN);
HaxballJS.then(function (HBInit) {
    exports.room = room = HBInit({
        roomName: exports.roomName, // Nome da Sala
        maxPlayers: 16,
        public: ['true', '1'].includes(process.env.public || '0'),
        noPlayer: true,
        geo: { "lat": -19.90, "lon": -43.95, "code": "br" },
        token: String(process.env.TOKEN), // Colocar a token que se adquire aqui: https://www.haxball.com/headlesstoken
    });
    // Enviar o link da sala para a consola.
    room.onRoomLink = function (link) {
        dbConnection_1.con.query("UPDATE players SET game_id = 0, loggedIn = 0 WHERE loggedIn = 1 OR game_id <> 0;", [], function (err) {
            if (err)
                throw err;
        });
        console.log(link);
        room.setCustomStadium(Mapa); // Carregar estádio.
        console.log("Sala iniciada com sucesso, se quiser encerrar a sala digite: Ctrl + C");
        if (exports.roomStatusChannel !== null) {
            var responseMessage = "Dados da sala:\n".concat(link, "\n");
            responseMessage += createChannelMessage('logs', exports.roomLogChannel);
            responseMessage += createChannelMessage('replays', exports.roomReplaysChannel);
            responseMessage += createChannelMessage('errors', exports.roomErrorsChannel);
            responseMessage += createChannelMessage('entradas/saídas', exports.roomEntradasChannel);
            responseMessage += createChannelMessage('status', exports.roomStatusChannel);
            var embed = new discord_js_1.EmbedBuilder()
                .setTitle("".concat(exports.roomName, " online."))
                .setDescription(responseMessage)
                .setColor('Random');
            client_1.default.send(exports.roomStatusChannel, [embed], true);
        }
    };
    var rankTag = [];
    var vipPausou = [];
    var ranks = config.rankings;
    function organizeRanks(ranks) {
        var organizedRanks = [];
        var points = 0;
        for (var i = 0; i < ranks.length; i++) {
            var rank = ranks[i];
            var pointsText = "".concat(points, " pts");
            organizedRanks.push("".concat(pointsText, ":").concat(rank));
            points += 200;
        }
        return organizedRanks.join(" | ");
    }
    // Vou definir aqui em cima caso necessite de usar em alguma merda em principio não mas mais vale :D
    var activePlayers = room.getPlayerList().filter(function (p) {
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
        }
        else if (room.getScores().blue > room.getScores().red) {
            winningTeam = 2;
            losingTeam = 1;
        }
    }
    function distribuirStats(playerStatistics) {
        var playersOnTeam = activePlayers.filter(function (p) { return p.team === 1 || p.team === 2; });
        for (var _i = 0, playersOnTeam_1 = playersOnTeam; _i < playersOnTeam_1.length; _i++) {
            var player_1 = playersOnTeam_1[_i];
            if (playerStatistics[player_1.id]) {
                for (var stat in playerStatistics[player_1.id]) {
                    if (stat === "goals") {
                        var sql = "UPDATE stats SET goals = goals + ? WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?";
                        var values = [playerStatistics[player_1.id][stat], player_1.name, process.env.room_id];
                        dbConnection_1.con.query(sql, values, function (err, result) {
                            if (err)
                                throw err;
                        });
                    }
                    else if (stat === "assists") {
                        var sql = "UPDATE stats SET assists = assists + ? WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?";
                        var values = [playerStatistics[player_1.id][stat], player_1.name, process.env.room_id];
                        dbConnection_1.con.query(sql, values, function (err, result) {
                            if (err)
                                throw err;
                        });
                    }
                    else if (stat === "ag") {
                        var sql = "UPDATE stats SET ag = ag + ? WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?";
                        var values = [playerStatistics[player_1.id][stat], player_1.name, process.env.room_id];
                        dbConnection_1.con.query(sql, values, function (err, result) {
                            if (err)
                                throw err;
                        });
                    }
                }
            }
            // Sistema de Elo
            // Equipe vermelha
            if (winningTeam === 1) {
                eloPointsWin = 5 + (6 * room.getScores().red) - (4 * room.getScores().blue);
            }
            else if (losingTeam === 1) {
                eloPointsLost = -6 + (4 * room.getScores().red) - (6 * room.getScores().blue);
            }
            // Equipe azul
            if (winningTeam === 2) {
                eloPointsWin = 5 + (6 * room.getScores().blue) - (4 * room.getScores().red);
            }
            else if (losingTeam === 2) {
                eloPointsLost = -6 + (4 * room.getScores().blue) - (6 * room.getScores().red);
            } // Sistema de Elo
            if (player_1.team === winningTeam) {
                if (room.getScores().blue === 0) {
                    if (gk[0].position != null && gk[0].name && !executed) {
                        var sql_1 = "UPDATE stats SET cs = cs + 1, elo = elo + 2 WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?";
                        var values_1 = [gk[0].name, process.env.room_id];
                        dbConnection_1.con.query(sql_1, values_1, function (err, result) {
                            if (err)
                                throw err;
                        });
                        executed = true;
                        room.sendAnnouncement("\uD83C\uDFC6 O GK ".concat(gk[0].name, " n\u00E3o tomou nenhum gol, parab\u00E9ns!"), null, 0xFFFFFF, "bold", 0);
                    }
                }
                else if (room.getScores().red === 0) {
                    if (gk[1].position != null && gk[1].name && !executed) {
                        var sql_2 = "UPDATE stats SET cs = cs + 1, elo = elo + 2 WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?";
                        var values_2 = [gk[1].name, process.env.room_id];
                        dbConnection_1.con.query(sql_2, values_2, function (err, result) {
                            if (err)
                                throw err;
                        });
                        executed = true;
                        room.sendAnnouncement("\uD83C\uDFC6 O GK ".concat(gk[1].name, " n\u00E3o tomou nenhum gol, parab\u00E9ns!"), null, 0xFFFFFF, "bold", 0);
                    }
                }
                // Ganhar
                var sql = "UPDATE stats SET wins = wins + 1, games = games + 1, elo = elo + ? WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?";
                var values = [eloPointsWin, player_1.name, process.env.room_id];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                });
            }
            else {
                // Perder
                var sql = "UPDATE stats SET losses = losses + 1, games = games + 1, elo = GREATEST(0, elo + ?) WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?";
                var values = [eloPointsLost, player_1.name, process.env.room_id];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                });
            }
        }
        // Um bocado óbvio o que isto faz :)
        if (room.getScores().red > room.getScores().blue) {
            room.sendAnnouncement("\uD83D\uDD34 Equipe vermelha ganhou por ".concat(room.getScores().red, " a ").concat(room.getScores().blue, "!"), null, 0xFF0000, "bold");
            console.log("Equipe vermelha ganhou por ".concat(room.getScores().red, " a ").concat(room.getScores().blue, "."));
        }
        else {
            room.sendAnnouncement("\uD83D\uDD35 Equipe azul ganhou por ".concat(room.getScores().blue, " a ").concat(room.getScores().red, "!"), null, 0x3385FF, "bold");
            console.log("Equipe azul ganhou por ".concat(room.getScores().blue, " a ").concat(room.getScores().red, "."));
        }
    }
    function prejudicarJogador(player) {
        if (!player) { // Proteger contra crash.
            return;
        }
        // Prejudicar o jogador que saiu.
        var sql = "UPDATE stats SET elo = GREATEST(0, elo - 50), games = games + 1, losses = losses + 1 WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?";
        var values = [player.name, process.env.room_id];
        dbConnection_1.con.query(sql, values, function (err) {
            if (err)
                throw err;
            console.log("".concat(player.name, " Foi prejudicado por sair no meio do jogo."));
        });
    }
    // Mensagem de 5 em 5 minutos
    setInterval(function () {
        room.sendAnnouncement("\uD83D\uDCE2 Fa\u00E7a parte da nossa comunidade no discord: ".concat(exports.discord, "\n\uD83D\uDCE2 Nosso website est\u00E1 em constru\u00E7\u00E3o!"), null, 0xbbb7fc, "bold", 0);
    }, 300000); // 5 minutos
    function handleRanks(player) {
        if (!player) { // Proteger contra crash.
            return;
        }
        // Checkar a database por alguém com o mesmo nome.
        var sql = "SELECT * FROM stats WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?";
        var values = [player.name, process.env.room_id];
        dbConnection_1.con.query(sql, values, function (err, result) {
            if (err)
                throw err;
            if (result.length > 0) {
                if (result && result[0] && result[0].games < 5) {
                    // room.setPlayerAvatar(player.id, "🌱");
                    rankTag[player.id] = ranks[0];
                }
                else {
                    if (result && result[0]) {
                        if (result[0].elo >= 6200) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[32];
                        }
                        else if (result[0].elo >= 6000) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[31];
                        }
                        else if (result[0].elo >= 5800) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[30];
                        }
                        else if (result[0].elo >= 5600) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[29];
                        }
                        else if (result[0].elo >= 5400) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[28];
                        }
                        else if (result[0].elo >= 5200) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[27];
                        }
                        else if (result[0].elo >= 5000) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[26];
                        }
                        else if (result[0].elo >= 4800) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[25];
                        }
                        else if (result[0].elo >= 4600) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[24];
                        }
                        else if (result[0].elo >= 4400) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[23];
                        }
                        else if (result[0].elo >= 4200) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[22];
                        }
                        else if (result[0].elo >= 4000) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[21];
                        }
                        else if (result[0].elo >= 3800) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[20];
                        }
                        else if (result[0].elo >= 3600) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[19];
                        }
                        else if (result[0].elo >= 3400) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[18];
                        }
                        else if (result[0].elo >= 3200) {
                            // room.setPlayerAvatar(player.id, "🐐");
                            rankTag[player.id] = ranks[17];
                        }
                        else if (result[0].elo >= 3000) {
                            // room.setPlayerAvatar(player.id, "👑");
                            rankTag[player.id] = ranks[16];
                        }
                        else if (result[0].elo >= 2800) {
                            // room.setPlayerAvatar(player.id, "🏆");
                            rankTag[player.id] = ranks[15];
                        }
                        else if (result[0].elo >= 2600) {
                            // room.setPlayerAvatar(player.id, "🌟");
                            rankTag[player.id] = ranks[14];
                        }
                        else if (result[0].elo >= 2400) {
                            // room.setPlayerAvatar(player.id, "⭐");
                            rankTag[player.id] = ranks[13];
                        }
                        else if (result[0].elo >= 2200) {
                            // room.setPlayerAvatar(player.id, "🏅");
                            rankTag[player.id] = ranks[12];
                        }
                        else if (result[0].elo >= 2000) {
                            // room.setPlayerAvatar(player.id, "🥇");
                            rankTag[player.id] = ranks[11];
                        }
                        else if (result[0].elo >= 1800) {
                            // room.setPlayerAvatar(player.id, "🥈");
                            rankTag[player.id] = ranks[10];
                        }
                        else if (result[0].elo >= 1600) {
                            // room.setPlayerAvatar(player.id, "🥉");
                            rankTag[player.id] = ranks[9];
                        }
                        else if (result[0].elo >= 1400) {
                            // room.setPlayerAvatar(player.id, "🐓");
                            rankTag[player.id] = ranks[8];
                        }
                        else if (result[0].elo >= 1200) {
                            // room.setPlayerAvatar(player.id, "🐥");
                            rankTag[player.id] = ranks[7];
                        }
                        else if (result[0].elo >= 1000) {
                            // room.setPlayerAvatar(player.id, "🐣");
                            rankTag[player.id] = ranks[6];
                        }
                        else if (result[0].elo >= 800) {
                            // room.setPlayerAvatar(player.id, "🥚");
                            rankTag[player.id] = ranks[5];
                        }
                        else if (result[0].elo >= 600) {
                            // room.setPlayerAvatar(player.id, "🕳️");
                            rankTag[player.id] = ranks[4];
                        }
                        else if (result[0].elo >= 400) {
                            // room.setPlayerAvatar(player.id, "💀");
                            rankTag[player.id] = ranks[3];
                        }
                        else if (result[0].elo >= 200) {
                            // room.setPlayerAvatar(player.id, "☠️");
                            rankTag[player.id] = ranks[2];
                        }
                        else {
                            // room.setPlayerAvatar(player.id, "⚰️");
                            rankTag[player.id] = ranks[1];
                        }
                    }
                }
            }
        });
    }
    //                          Quando o player entra                        //
    room.onPlayerJoin = function (player) {
        // Log Entradas
        (0, entrada_1.entrada)(player);
        var conn = player.conn;
        var ipv4 = decryptHex(conn);
        var playerList = room.getPlayerList();
        updateNumberOfPlayers(playerList);
        // Guardar variáveis locais.
        exports.playerConnections.set(player.id, player.conn);
        exports.playerAuth.set(player.id, player.auth);
        exports.playerIpv4.set(player.id, ipv4);
        superadmin[player.id] = 0;
        gerentes[player.id] = 0;
        admins[player.id] = 0;
        mods[player.id] = 0;
        vips[player.id] = 0;
        premiums[player.id] = 0;
        legends[player.id] = 0;
        console.log("".concat(player.name, " entrou na sala."));
        setTimeout(function () {
            // Checkar nomes, conn e auth por ban.
            dbConnection_1.con.query("SELECT * FROM bans WHERE name = ? OR conn = ? OR auth = ? OR ipv4 = ?", [player.name, player.conn, player.auth, ipv4], function (err, result) {
                if (err)
                    throw err;
                if (result.length > 0) {
                    for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                        var ban = result_1[_i];
                        // Reduzir tamanho da data.
                        var banEndTime = new Date(ban.time);
                        var formattedBanEndTime = banEndTime.toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                        });
                        var now = Date.now();
                        if (now < new Date(banEndTime).getTime()) {
                            room.kickPlayer(player.id, "\uD83E\uDE78 Voc\u00EA est\u00E1 banido at\u00E9 ".concat(formattedBanEndTime, ". Motivo: ").concat(ban.reason));
                            console.log("".concat(player.name, " Levou kick porque est\u00E1 banido."));
                            break;
                        }
                    }
                }
            });
        }, 15); // 15 ms para não bugar login automático, otherwise fica com o login na db.
        // Checkar se o jogador está mute pelo nome, conn ou auth, se sim, definir na variável local :)
        dbConnection_1.con.query("SELECT * FROM mutes WHERE name = ? OR conn = ? OR auth = ?", [player.name, player.conn, player.auth], function (err, result) {
            if (err)
                throw err;
            if (result.length > 0) {
                for (var _i = 0, result_2 = result; _i < result_2.length; _i++) {
                    var mute = result_2[_i];
                    var muteEndTime = new Date(mute.time).getTime();
                    var now = Date.now();
                    if (now < muteEndTime) {
                        isMuted[player.id] = true;
                        break;
                    }
                }
            }
        });
        // Evitar double login.
        // Checkar o nome na DB.
        var conn = exports.playerConnections.get(player.id);
        var ipv4 = decryptHex(conn);
        activePlayers = room.getPlayerList().filter(function (p) {
            return !afkStatus[p.id];
        });
        loggedInPlayers[player.id] = false;
        dbConnection_1.con.query("SELECT * FROM players WHERE name = ?", [player.name], function (err, result) {
            if (err)
                throw err;
            if (result.length > 0) {
                if (result[0].password) {
                    // Timer para kick se não fizer login.
                    timeoutIds[player.id] = setTimeout(function () {
                        // Se o timer acabar leva kick.
                        room.kickPlayer(player.id, "🩸 Tempo esgotado para login.");
                        // Mostrar a razão na consola.
                        // console.log(`${player.name} Foi expulso da sala porque excedeu o limite de tempo para registro/login.`); // Isto por vezes aparece erróneamente porém eu não tenho pachorra para limpar este cadito de código :)
                    }, 45000); // 45 segundos
                }
                else { //Caso exista player mas não tenha senha
                    room.sendAnnouncement("\uD83E\uDE78 Bem-vindo, ".concat(player.name, "! Se registre usando o seguinte comando: !registrar <senha>"), player.id, 0xFF0000, "bold");
                    room.sendAnnouncement("\uD83E\uDE78 Digite !help para ver todos os comandos dispon\u00EDveis na sala, em caso de d\u00FAvida digite: !help <comando>", player.id, 0xFFFFFF, "bold");
                    room.sendAnnouncement("\uD83D\uDC65 N\u00E3o se esque\u00E7a de entrar no nosso discord: ".concat(exports.discord), player.id, 0xFFFFFF, "bold");
                }
                var playerId = player.id;
                var sql = "UPDATE players SET game_id = ?, conn = ?, ipv4 = ?, loggedIn = 1 WHERE LOWER(name) = LOWER(?)";
                var values = [playerId, conn, ipv4, player.name];
                dbConnection_1.con.query(sql, values, function (err) {
                    if (err)
                        throw err;
                    handleRanks(player); // Definir avatar.
                    if (result[0].password && result[0].auth === player.auth) {
                        loggedInPlayers[player.id] = true;
                        if (result[0].ceo === 1) {
                            room.setPlayerAdmin(player.id, true);
                            room.sendAnnouncement("\uD83D\uDC51 ".concat(player.name, " Voc\u00EA recebeu o cargo de CEO automaticamente."), player.id, 0xFFA500, "bold");
                            superadmin[player.id] = 1;
                        }
                        if (result[0].gerente === 1) {
                            room.setPlayerAdmin(player.id, true);
                            room.sendAnnouncement("\uD83D\uDD25 ".concat(player.name, " Voc\u00EA recebeu o cargo de Gerente automaticamente."), player.id, 0xFFA500, "bold");
                            gerentes[player.id] = 1;
                        }
                        if (result[0].admin === 1) {
                            room.setPlayerAdmin(player.id, true);
                            room.sendAnnouncement("\uD83D\uDEA7 ".concat(player.name, " Voc\u00EA recebeu o cargo de administrador automaticamente."), player.id, 0xFFA500, "bold");
                            admins[player.id] = 1;
                        }
                        if (result[0].mod === 1) {
                            room.setPlayerAdmin(player.id, true);
                            room.sendAnnouncement("\uD83D\uDEA7 ".concat(player.name, " Voc\u00EA recebeu o cargo de moderador automaticamente."), player.id, 0xFFA500, "bold");
                            mods[player.id] = 1;
                        }
                        if (result[0].vip === 1) {
                            room.sendAnnouncement("\uD83D\uDC8E ".concat(player.name, ", seja bem vindo Vip!"), player.id, cores_1.cores.ciano, "bold");
                            vips[player.id] = 1;
                        }
                        if (result[0].vip === 2) {
                            room.sendAnnouncement("\uD83D\uDD30 ".concat(player.name, ", seja bem vindo Premium!"), player.id, cores_1.cores.coral, "bold");
                            premiums[player.id] = 1;
                        }
                        if (result[0].vip === 3) {
                            room.sendAnnouncement("\uD83C\uDF0B ".concat(player.name, ", seja bem vindo Legend!"), player.id, cores_1.cores.violeta, "bold");
                            legends[player.id] = 1;
                        }
                        console.log("".concat(player.name, " logou automaticamente."));
                        room.sendAnnouncement("\uD83E\uDE78 Voc\u00EA logou automaticamente. Bem-vindo(a) de volta ".concat(player.name, "!"), player.id, 0xFF0000, "bold");
                        room.sendAnnouncement("\uD83E\uDE78 Digite !help para ver todos os comandos dispon\u00EDveis na sala, em caso de d\u00FAvida digite: !help <comando>", player.id, 0xFFFFFF, "bold");
                        room.sendAnnouncement("\uD83D\uDC65 N\u00E3o se esque\u00E7a de entrar no nosso discord: ".concat(exports.discord), player.id, 0xFFFFFF, "bold");
                        // Limpar timeout.
                        if (timeoutIds[player.id]) {
                            clearTimeout(timeoutIds[player.id]);
                            delete timeoutIds[player.id];
                        }
                    }
                    else {
                        if (result[0].password) {
                            room.sendAnnouncement("\uD83E\uDE78 Ol\u00E1 ".concat(player.name, ", para ter acesso aos outros comandos digite: !login seguido pela sua senha (Ex: !login 1234)."), player.id, 0xFF0000, "bold");
                            room.sendAnnouncement("\uD83E\uDE78 Digite !help para ver todos os comandos dispon\u00EDveis na sala, em caso de d\u00FAvida digite: !help <comando>", player.id, 0xFFFFFF, "bold");
                            room.sendAnnouncement("\uD83D\uDC65 N\u00E3o se esque\u00E7a de entrar no nosso discord: ".concat(exports.discord), player.id, 0xFFFFFF, "bold");
                        }
                    }
                });
            }
            else {
                // O nome não está registado, pedir ao usuário para se registar.
                room.sendAnnouncement("\uD83E\uDE78 Bem-vindo, ".concat(player.name, "! Se registre usando o seguinte comando: !registrar <senha>"), player.id, 0xFF0000, "bold");
                room.sendAnnouncement("\uD83E\uDE78 Digite !help para ver todos os comandos dispon\u00EDveis na sala, em caso de d\u00FAvida digite: !help <comando>", player.id, 0xFFFFFF, "bold");
                room.sendAnnouncement("\uD83D\uDC65 N\u00E3o se esque\u00E7a de entrar no nosso discord: ".concat(exports.discord), player.id, 0xFFFFFF, "bold");
                var auth = exports.playerAuth.get(player.id);
                var sql = "INSERT INTO players (game_id, name, password, loggedIn, conn, ipv4, auth) VALUES (?,?,?,?,?,?,?)";
                var values = [player.id, player.name, null, 1, conn, ipv4, auth];
                dbConnection_1.con.query(sql, values, function (err) {
                    if (err)
                        throw err;
                    handleRanks(player); // Definir avatar.
                });
            }
        });
        // Proteção do double login :D
        var sql2 = "SELECT game_id FROM players WHERE LOWER(name) = LOWER(?) OR ipv4 = ?";
        var values2 = [player.name, ipv4];
        dbConnection_1.con.query(sql2, values2, function (err, result) {
            if (err)
                throw err;
            if (result.length === 0) {
                // Usuário não registado, deixar entrar, pois é impossível estar com login feito, se o mesmo não existe.
            }
            // else if (result[0].game_id !== 0 && !process.env.debug) {
            //     room.kickPlayer(player.id, "🩸 Você já está conectado em outra conta.");
            // }
        });
        var sql3 = "SELECT * FROM stats WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?";
        dbConnection_1.con.query(sql3, [player.name, process.env.room_id], function (err, result) {
            if (err)
                throw err;
            if (result.length === 0) {
                var sql4 = "INSERT INTO stats (player_id, room_id) VALUES ((SELECT id FROM players WHERE LOWER(name) = LOWER(?)), ?)";
                dbConnection_1.con.query(sql4, [player.name, process.env.room_id], function (err) {
                    if (err)
                        throw err;
                });
            }
        });
        setTimeout(function () {
            updateRoleOnPlayerIn();
        }, 30);
    };
    var Team = {
        SPECTATORS: 0,
        RED: 1,
        BLUE: 2
    };
    var State = { PLAY: 0, PAUSE: 1, STOP: 2 };
    var gameState = State.STOP;
    var unpauseTimeout;
    var allowAFK = true;
    var resettingTeams = false;
    var inChooseMode = false;
    var endGameVariable = false;
    var players;
    var slowMode = 0;
    var timeOutCap;
    var redCaptainChoice = "";
    var blueCaptainChoice = "";
    var chooseTime = 12;
    function updateRoleOnPlayerIn() {
        updateTeams();
        if (inChooseMode) {
            getSpecList(exports.teamR.length <= exports.teamB.length ? exports.teamR[0] : exports.teamB[0]);
        }
        balanceTeams();
    }
    function updateRoleOnPlayerOut() {
        updateTeams();
        if (inChooseMode) {
            if ((exports.teamR.length == 0 || exports.teamB.length == 0) && exports.teamS.length > 0) {
                exports.teamR.length == 0 ? room.setPlayerTeam(exports.teamS[0].id, Team.RED) : room.setPlayerTeam(exports.teamS[0].id, Team.BLUE);
                return;
            }
            if (exports.teamS.length > 0 && Math.abs(exports.teamR.length - exports.teamB.length) == exports.teamS.length) {
                room.sendAnnouncement("Sem opções restantes, deixa que eu escolho...", 0xFF0000, 'bold');
                deactivateChooseMode();
                resumeGame();
                var b = exports.teamS.length;
                if (exports.teamR.length > exports.teamB.length) {
                    for (var i = 0; i < b; i++) {
                        setTimeout(function () {
                            room.setPlayerTeam(exports.teamS[0].id, Team.BLUE);
                        }, 5 * i);
                    }
                }
                else {
                    for (var i = 0; i < b; i++) {
                        setTimeout(function () {
                            room.setPlayerTeam(exports.teamS[0].id, Team.RED);
                        }, 5 * i);
                    }
                }
                return;
            }
            if (winstreak == 0 && room.getScores() == null) {
                if (Math.abs(exports.teamR.length - exports.teamB.length) == 2) { //se alguém saiu de um time com 2 jogadores a mais que o outro, coloca o último jogador de volta em seu lugar para que seja justo
                    room.sendAnnouncement("Equilibrando times...", null, 0xFF0000, 'bold');
                    exports.teamR.length > exports.teamB.length ? room.setPlayerTeam(exports.teamR[exports.teamR.length - 1].id, Team.SPECTATORS) : room.setPlayerTeam(exports.teamB[exports.teamB.length - 1].id, Team.SPECTATORS);
                }
            }
            if (exports.teamR.length == exports.teamB.length && exports.teamS.length < 2) {
                deactivateChooseMode();
                resumeGame();
                return;
            }
            capLeft ? choosePlayer() : getSpecList(exports.teamR.length <= exports.teamB.length ? exports.teamR[0] : exports.teamB[0]);
        }
        balanceTeams();
    }
    function updateTeams() {
        players = room.getPlayerList().filter(function (player) { return player.id != 0 && !afkStatus[player.id]; });
        exports.teamR = players.filter(function (p) { return p.team === Team.RED; });
        exports.teamB = players.filter(function (p) { return p.team === Team.BLUE; });
        exports.teamS = players.filter(function (p) { return p.team === Team.SPECTATORS; });
    }
    function getSpecList(player) {
        if (exports.teamB.length == 0) {
            if (!endGameVariable) {
                room.setPlayerTeam(exports.teamS[0].id, Team.BLUE);
            }
            gambiarrabug(1);
            return;
        }
        if (exports.teamR.length == 0) {
            if (!endGameVariable) {
                room.setPlayerTeam(exports.teamS[0].id, Team.RED);
            }
            gambiarrabug(2);
            return;
        }
        var cstm = "Jogadores: ";
        for (var i = 0; i < exports.teamS.length; i++) {
            if (140 - cstm.length < (exports.teamS[i].name + "[" + (i + 1) + "], ").length) {
                room.sendAnnouncement(cstm, player.id, 0xFFFFFF, 'bold');
                cstm = "... ";
            }
            cstm += exports.teamS[i].name + "[" + (i + 1) + "], ";
        }
        cstm = cstm.substring(0, cstm.length - 2);
        cstm += ".";
        room.sendAnnouncement(cstm, player.id, 0xFFFFFF, 'bold');
    }
    function balanceTeams() {
        if (!inChooseMode) {
            if (players.length == 1 && exports.teamR.length == 0) { // 1 player
                quickRestart();
                room.setPlayerTeam(players[0].id, Team.RED);
            }
            else if (Math.abs(exports.teamR.length - exports.teamB.length) == exports.teamS.length && exports.teamS.length > 0) { // spec players supply required players
                var n = Math.abs(exports.teamR.length - exports.teamB.length);
                if (exports.teamR.length > exports.teamB.length) {
                    for (var i = 0; i < n; i++) {
                        room.setPlayerTeam(exports.teamS[i].id, Team.BLUE);
                    }
                }
                else {
                    for (var i = 0; i < n; i++) {
                        room.setPlayerTeam(exports.teamS[i].id, Team.RED);
                    }
                }
            }
            else if (Math.abs(exports.teamR.length - exports.teamB.length) > exports.teamS.length && players.length > 1) { //no sufficient players
                var n = Math.abs(exports.teamR.length - exports.teamB.length);
                if (players.length == 1) {
                    quickRestart();
                    room.setPlayerTeam(players[0].id, Team.RED);
                    return;
                }
                else if (players.length == 6) {
                    quickRestart();
                }
                // if (players.length == getMaxTeamSize() * 2 - 1) {
                //     allReds = [];
                //     allBlues = [];
                // }
                if (exports.teamR.length > exports.teamB.length) {
                    for (var i = 0; i < n; i++) {
                        room.setPlayerTeam(exports.teamR[exports.teamR.length - 1 - i].id, Team.SPECTATORS);
                    }
                }
                else {
                    for (var i = 0; i < n; i++) {
                        room.setPlayerTeam(exports.teamB[exports.teamB.length - 1 - i].id, Team.SPECTATORS);
                    }
                }
            }
            else if (Math.abs(exports.teamR.length - exports.teamB.length) < exports.teamS.length && exports.teamR.length != exports.teamB.length) { //choose mode
                room.pauseGame(true);
                activateChooseMode();
                choosePlayer();
            }
            else if (exports.teamS.length >= 2 && exports.teamR.length == exports.teamB.length && exports.teamR.length < getMaxTeamSize()) { //2 in red 2 in blue and 2 or more spec
                if (exports.teamR.length == 2) {
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
        if (exports.teamR.length <= exports.teamB.length && exports.teamR.length != 0) {
            refundBet(exports.teamR[0], "pois você foi escolhido para entrar em campo"); // Passa a razão do reembolso para a função refundBet
            room.sendAnnouncement("Para escolher um player, insira seu número da lista ou use 'top', 'random' ou 'bottom'.", exports.teamR[0].id, 0xFF0000, 'bold');
            timeOutCap = setTimeout(function (player) {
                room.sendAnnouncement("Vai rápido @" + player.name + ", apenas " + chooseTime / 2 + " segundos restantes para escolher!", player.id, 0xFFA500, 'bold');
                timeOutCap = setTimeout(function (player) {
                    room.kickPlayer(player.id, "Você não escolheu a tempo!", false);
                }, chooseTime * 500, exports.teamR[0]);
            }, chooseTime * 1000, exports.teamR[0]);
        }
        else if (exports.teamB.length < exports.teamR.length && exports.teamB.length != 0) {
            refundBet(exports.teamB[0], "pois você foi escolhido para entrar em campo"); // Passa a razão do reembolso para a função refundBet
            room.sendAnnouncement("Para escolher um jogador, insira seu número da lista ou use 'top', 'random' ou 'bottom'.", exports.teamB[0].id, 0xFF0000, 'bold');
            timeOutCap = setTimeout(function (player) {
                room.sendAnnouncement("Vai rápido @" + player.name + ", apenas " + chooseTime / 2 + " segundos restantes para escolher!", player.id, 0xFFA500, 'bold');
                timeOutCap = setTimeout(function (player) {
                    room.kickPlayer(player.id, "Você não escolheu a tempo!", false);
                }, chooseTime * 500, exports.teamB[0]);
            }, chooseTime * 1000, exports.teamB[0]);
        }
        if (exports.teamR.length != 0 && exports.teamB.length != 0)
            getSpecList(exports.teamR.length <= exports.teamB.length ? exports.teamR[0] : exports.teamB[0]);
    }
    function refundBet(player, reason) {
        // Consulta a tabela betplayer
        dbConnection_1.con.query("SELECT * FROM betplayer WHERE player_id = ? AND room_id = ?", [player.id, process.env.room_id], function (err, existingBets) {
            if (err)
                throw err;
            if (existingBets.length > 0) {
                // O jogador que saiu tinha uma aposta nele, então reembolse o apostador
                dbConnection_1.con.query("UPDATE players SET balance = balance + ? WHERE id = ?", [existingBets[0].value, player.id], function (err) {
                    if (err)
                        throw err;
                    room.sendAnnouncement("\uD83D\uDCB0 Sua aposta foi cancelada e seus ".concat(existingBets[0].value, " atacoins foram reembolsados ").concat(reason, "."), player.id, 0x00FF00, "bold", 2);
                });
                // Remove a aposta da tabela betplayer
                dbConnection_1.con.query("DELETE FROM betplayer WHERE player_id = ? AND room_id = ?", [player.id, process.env.room_id], function (err) {
                    if (err)
                        throw err;
                });
            }
        });
        // Consulta a tabela betteam
        dbConnection_1.con.query("SELECT * FROM betteam WHERE player_id = ? AND room_id = ?", [player.id, process.env.room_id], function (err, existingBets) {
            if (err)
                throw err;
            if (existingBets.length > 0) {
                // O jogador que saiu tinha uma aposta nele, então reembolse o apostador
                dbConnection_1.con.query("UPDATE players SET balance = balance + ? WHERE id = ?", [existingBets[0].value, player.id], function (err) {
                    if (err)
                        throw err;
                    room.sendAnnouncement("\uD83D\uDCB0 Sua aposta foi cancelada e seus ".concat(existingBets[0].value, " atacoins foram reembolsados ").concat(reason, "."), player.id, 0x00FF00, "bold", 2);
                });
                // Remove a aposta da tabela betteam
                dbConnection_1.con.query("DELETE FROM betteam WHERE player_id = ? AND room_id = ?", [player.id, process.env.room_id], function (err) {
                    if (err)
                        throw err;
                });
            }
        });
    }
    function topBtn() {
        if (exports.teamS.length == 0) {
            return;
        }
        else {
            if (exports.teamR.length == exports.teamB.length) {
                if (exports.teamS.length > 1) {
                    room.setPlayerTeam(exports.teamS[0].id, Team.RED);
                    room.setPlayerTeam(exports.teamS[1].id, Team.BLUE);
                }
                return;
            }
            else if (exports.teamR.length < exports.teamB.length) {
                room.setPlayerTeam(exports.teamS[0].id, Team.RED);
            }
            else {
                room.setPlayerTeam(exports.teamS[0].id, Team.BLUE);
            }
        }
    }
    function randomBtn() {
        if (exports.teamS.length == 0) {
            return;
        }
        else {
            if (exports.teamR.length == exports.teamB.length) {
                if (exports.teamS.length > 1) {
                    var r = getRandomInt(exports.teamS.length);
                    room.setPlayerTeam(exports.teamS[r].id, Team.RED);
                    exports.teamS = exports.teamS.filter(function (spec) { return spec.id != exports.teamS[r].id; });
                    room.setPlayerTeam(exports.teamS[getRandomInt(exports.teamS.length)].id, Team.BLUE);
                }
                return;
            }
            else if (exports.teamR.length < exports.teamB.length) {
                room.setPlayerTeam(exports.teamS[getRandomInt(exports.teamS.length)].id, Team.RED);
            }
            else {
                room.setPlayerTeam(exports.teamS[getRandomInt(exports.teamS.length)].id, Team.BLUE);
            }
        }
    }
    function blueToSpecBtn() {
        resettingTeams = true;
        setTimeout(function () {
            resettingTeams = false;
        }, 100);
        for (var i = 0; i < exports.teamB.length; i++) {
            room.setPlayerTeam(exports.teamB[exports.teamB.length - 1 - i].id, Team.SPECTATORS);
        }
    }
    function redToSpecBtn() {
        resettingTeams = true;
        setTimeout(function () {
            resettingTeams = false;
        }, 100);
        for (var i = 0; i < exports.teamR.length; i++) {
            room.setPlayerTeam(exports.teamR[exports.teamR.length - 1 - i].id, Team.SPECTATORS);
        }
    }
    function resetBtn() {
        resettingTeams = true;
        setTimeout(function () {
            resettingTeams = false;
        }, 100);
        if (exports.teamR.length <= exports.teamB.length) {
            for (var i = 0; i < exports.teamR.length; i++) {
                room.setPlayerTeam(exports.teamB[exports.teamB.length - 1 - i].id, Team.SPECTATORS);
                room.setPlayerTeam(exports.teamR[exports.teamR.length - 1 - i].id, Team.SPECTATORS);
            }
            for (var i = exports.teamR.length; i < exports.teamB.length; i++) {
                room.setPlayerTeam(exports.teamB[exports.teamB.length - 1 - i].id, Team.SPECTATORS);
            }
        }
        else {
            for (var i = 0; i < exports.teamB.length; i++) {
                room.setPlayerTeam(exports.teamB[exports.teamB.length - 1 - i].id, Team.SPECTATORS);
                room.setPlayerTeam(exports.teamR[exports.teamR.length - 1 - i].id, Team.SPECTATORS);
            }
            for (var i = exports.teamB.length; i < exports.teamR.length; i++) {
                room.setPlayerTeam(exports.teamR[exports.teamR.length - 1 - i].id, Team.SPECTATORS);
            }
        }
    }
    function blueToRedBtn() {
        resettingTeams = true;
        setTimeout(function () {
            resettingTeams = false;
        }, 100);
        for (var i = 0; i < exports.teamB.length; i++) {
            room.setPlayerTeam(exports.teamB[i].id, Team.RED);
        }
        // swapUniform();
    }
    function getMaxTeamSize() {
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
        setTimeout(function () {
            room.startGame();
        }, 2000);
    }
    function gambiarrabug(num) {
        if (num == 1) {
            setTimeout(function () {
                getSpecList(exports.teamB[0]);
            }, 100);
            return;
        }
        if (num == 2) {
            setTimeout(function () {
                getSpecList(exports.teamR[0]);
            }, 100);
            return;
        }
    }
    //             Função AFK a meio do jogo            //
    var activities = {}; // Verificar quando foi a última atividade.
    var AFKTimeout = 12000; // 10 segundos afk = kick
    var lastWarningTime = 0; // Mandar avisos de kick
    function afkKick() {
        activePlayers = room.getPlayerList().filter(function (p) {
            return !afkStatus[p.id] && p.team > 0;
        });
        var redTeam = activePlayers.filter(function (p) { return p.team === 1; });
        var blueTeam = activePlayers.filter(function (p) { return p.team === 2; });
        if (redTeam.length >= 2 && blueTeam.length >= 2) { // Levar kick caso estejam X jogadores em cada equipe.
            for (var _i = 0, activePlayers_1 = activePlayers; _i < activePlayers_1.length; _i++) {
                var p = activePlayers_1[_i];
                if (p.team !== 0) {
                    if (Date.now() - activities[p.id] > AFKTimeout) {
                        room.kickPlayer(p.id, "🩸 Inatividade detectada!");
                    }
                    else if (Date.now() - activities[p.id] > AFKTimeout - 6000) {
                        if (Date.now() - lastWarningTime > 2000) {
                            room.sendAnnouncement("🩸 Você vai ser kickado por inatividade, se mova ou escreva algo para evitar ser kickado.", p.id, 0xFFA500, "bold", 2);
                            lastWarningTime = Date.now();
                        }
                    }
                }
            }
        }
    }
    room.onGamePause = function (player) {
        // Atividades
        if (player != null) {
            activities[player.id] = Date.now();
        }
        // Não permitir pausar o jogo.
        // room.pauseGame(false);
        gameState = State.PAUSE;
    };
    room.onGameUnpause = function (player) {
        unpauseTimeout = setTimeout(function () {
            gameState = State.PLAY;
        }, 2000);
        // Atividade
        var playersGaming = room.getPlayerList().filter(function (p) { return p.team > 0; });
        playersGaming.forEach(function (p) {
            activities[p.id] = Date.now();
        });
    };
    room.onPositionsReset = function () {
        // Atividade
        for (var i = 0; i < activePlayers.length; i++) {
            activities[activePlayers[i].id] = Date.now();
        }
    };
    room.onPlayerActivity = function (player) {
        // Atividade
        activities[player.id] = Date.now();
    };
    // Remover ban automaticamente.
    room.onPlayerKicked = function () {
        // room.clearBans();
    };
    //                                    CHAT                                      //
    var lastCallAdminTime = 0;
    var callCount = 0;
    var bloquear_comando = [];
    function getDate() {
        var data = new Date(), dia = data.getDate().toString().padStart(2, '0'), mes = (data.getMonth() + 1).toString().padStart(2, '0'), ano = data.getFullYear(), horas = data.getHours().toString().padStart(2, '0'), minutos = data.getMinutes().toString().padStart(2, '0');
        return "".concat(dia, "-").concat(mes, "-").concat(ano, "-").concat(horas, "h").concat(minutos, "m");
    }
    function automod(player, response) {
        return __awaiter(this, void 0, void 0, function () {
            var motivo, autoModBot, sql2, values2;
            return __generator(this, function (_a) {
                try {
                    motivo = "";
                    autoModBot = "AUTOMOD";
                    if (response === 1) {
                        motivo = "Racismo";
                    }
                    else if (response === 2) {
                        motivo = "Apologia ao suicídio";
                    }
                    sql2 = "SELECT * FROM players WHERE LOWER(name) = LOWER(?)";
                    values2 = [player.name];
                    dbConnection_1.con.query(sql2, values2, function (err, result) {
                        if (err)
                            throw err;
                        if (result.length > 0) {
                            if (loggedInPlayers[player.id] && result[0].ceo === 1) {
                                var name_1 = player.name;
                                var timeStr;
                                if (response === 1) {
                                    timeStr = '9999d';
                                }
                                else if (response === 2) {
                                    timeStr = '7d';
                                }
                                var timeRegex = /^(\d+)([a-zA-Z]+)$/;
                                if (!timeStr) {
                                    return;
                                }
                                var match = timeStr.match(timeRegex);
                                if (match) {
                                    var duration = parseInt(match[1]);
                                    var unit = match[2];
                                    var banDuration = 0;
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
                                    var banEndTime = new Date(Date.now() + banDuration);
                                    var banEndTimeFormatted = banEndTime.toISOString().slice(0, 19).replace('T', ' '); // Dar replace da data para um valor readable
                                    var formattedBanEndTime_1 = banEndTime.toLocaleDateString('pt-BR', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric'
                                    });
                                    var targetPlayer_1 = room.getPlayerList().find(function (p) { return p.name === name_1; });
                                    var conn = targetPlayer_1 && exports.playerConnections.get(targetPlayer_1.id);
                                    var auth = targetPlayer_1 && exports.playerAuth.get(targetPlayer_1.id);
                                    var ipv4 = targetPlayer_1 && exports.playerIpv4.get(targetPlayer_1.id);
                                    var conn2 = player.conn;
                                    var auth2 = player.auth;
                                    // Se o jogador estiver On.
                                    if (targetPlayer_1) {
                                        // Inserir a informação do ban na database.
                                        var sql = "INSERT INTO bans (name, time, reason, banned_by, conn, ipv4, auth) VALUES (?, ?, ?, ?, ?, ?, ?)";
                                        var values = [name_1, banEndTimeFormatted, motivo, autoModBot, conn, ipv4, auth];
                                        dbConnection_1.con.query(sql, values, function (err, result) {
                                            if (err)
                                                throw err;
                                            room.kickPlayer(targetPlayer_1.id, "\uD83E\uDE78 Voc\u00EA foi banido. Motivo: ".concat(motivo, " at\u00E9 ").concat(formattedBanEndTime_1, "."));
                                            room.sendAnnouncement("[\uD83E\uDD16 AUTOMOD] ".concat(player.name, " Foi banido!"), null, cores_1.cores.vermelho, "bold", 2);
                                        });
                                        if (config.canais.punicoes && config.canais.punicoes !== "") {
                                            var embedPunicao = new discord_js_1.EmbedBuilder()
                                                .setTitle("O jogador **".concat(player.name, " foi banido!**"))
                                                .setDescription("\uD83D\uDEA7 Informa\u00E7\u00F5es do banimento:")
                                                .addFields({ name: 'Banido por', value: "[\uD83E\uDD16 AUTOMOD]" }, { name: 'Nick/ID', value: "".concat(player.name, "#").concat(player.id) }, { name: 'Motivo', value: "".concat(motivo) }, { name: 'Tempo de banimento', value: "At\u00E9 ".concat(formattedBanEndTime_1) })
                                                .setColor('Red')
                                                .setFooter({ text: "Data & Hora: ".concat(getDate()) });
                                            client_1.default.send(config.canais.punicoes, [embedPunicao], true);
                                        }
                                        // Se não estiver on.
                                    }
                                    else {
                                        var sql = "INSERT INTO bans (name, time, reason, banned_by, conn, ipv4, auth) VALUES (?, ?, ?, ?, ?, ?, ?)";
                                        var values = [name_1, banEndTimeFormatted, motivo, autoModBot, conn2, ipv4, auth2];
                                        dbConnection_1.con.query(sql, values, function (err, result) {
                                            if (err)
                                                throw err;
                                            room.sendAnnouncement("[\uD83E\uDD16 AUTOMOD] ".concat(player.name, " Foi banido!"), null, cores_1.cores.vermelho, "bold", 2);
                                            if (config.canais.punicoes && config.canais.punicoes !== "") {
                                                var embedPunicao = new discord_js_1.EmbedBuilder()
                                                    .setTitle("O jogador **".concat(player.name, " foi banido!**"))
                                                    .setDescription("\uD83D\uDEA7 Informa\u00E7\u00F5es do banimento:")
                                                    .addFields({ name: 'Banido por', value: "[\uD83E\uDD16 AUTOMOD]" }, { name: 'Nick/ID', value: "".concat(player.name, "#").concat(player.id) }, { name: 'Motivo', value: "".concat(motivo) }, { name: 'Tempo de banimento', value: "At\u00E9 ".concat(formattedBanEndTime_1) })
                                                    .setColor('Red')
                                                    .setFooter({ text: "Data & Hora: ".concat(getDate()) });
                                                client_1.default.send(config.canais.punicoes, [embedPunicao], true);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    });
                }
                catch (err) {
                    (0, errors_1.error)("Erro no automod: ", err);
                }
                return [2 /*return*/];
            });
        });
    }
    room.onPlayerChat = function (player, message) {
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
            if (exports.roomLogChannel != null) {
                try {
                    client_1.default.send(exports.roomLogChannel, "> ||".concat(HoraFormatada, "|| ").concat(player.name, " (#").concat(player.id, "): ").concat(message));
                }
                catch (err) {
                    (0, errors_1.error)("LogChat", errors_1.error);
                }
            }
        }
        // Jogador escreveu, adicionar atividade recente.
        activities[player.id] = Date.now();
        // Comandos
        if (message.startsWith("!")) {
            var words_1 = message.split(" ");
            /* const comando = words[0].toLowerCase();

            const equipe = uniformes.find((equipe: EquipeUniforme) => equipe.shortName.toLowerCase() === comando || equipe.longName.toLowerCase() === comando);

            if (equipe) {
                const uniform = equipe.uniform;
                room.setTeamColors(player.team, ...uniform);
                return false;
            } */
            // Comando de registro
            if (words_1[0] === "!registrar" || words_1[0] === "!register") {
                if (loggedInPlayers[player.id]) { //Não tem porque executar selects se a variável indica que ele esta logado é porque tem registro.
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA j\u00E1 est\u00E1 logado."), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                var password_1 = words_1[1];
                if (!password_1) {
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, ", voc\u00EA precisa colocar uma senha depois do !registrar. (Ex: !registrar 1234)"), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                if (password_1.length < 3) {
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " A senha deve ter pelo menos 3 caracteres."), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                var conn_1 = exports.playerConnections.get(player.id);
                var auth_1 = exports.playerAuth.get(player.id);
                /*
                    Se essa validação for realmente ficar: removi o ipv4 pois é o mesmo que a conn só que desencriptado
                    Validei o auth também já que o ip do jogador pode mudar, o auth também pode mas provvelmente não se estiver do mesmo app.
                    Também adicionei para validar se tem senha para saber se esses nicks são registrados
                */
                var sql = "SELECT COUNT(*) as count FROM players WHERE (conn = ? OR auth = ?) AND password IS NOT NULL";
                var values = [conn_1, auth_1];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result[0].count >= 1) {
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA j\u00E1 tem uma conta registrada."), player.id, 0xFF0000, "bold", 2);
                        console.log("O usu\u00E1rio ".concat(player.name, " tentou se registrar, por\u00E9m j\u00E1 tem 2 contas. CONN: ").concat(conn_1));
                    }
                    else {
                        var sql_3 = "SELECT * FROM players WHERE LOWER(name) = LOWER(?) AND password IS NOT NULL";
                        var values_3 = [player.name];
                        dbConnection_1.con.query(sql_3, values_3, function (err, result) {
                            if (err)
                                throw err;
                            if (result.length > 0) {
                                // Nome do jogador já está na database :(
                                room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " J\u00E1 existe uma conta com este nome registrada. Por favor troque o seu nome no haxball ou fa\u00E7a login com o seguinte comando: !login seguido pela sua senha."), player.id, 0xFF0000, "bold", 2);
                            }
                            else {
                                // O nome do jogador não está na database, siga siga registar :D
                                bcrypt.hash(password_1, 10, function (err, hashedPassword) {
                                    if (err)
                                        throw err;
                                    var sql = "UPDATE players SET password = ?, loggedIn = 1 WHERE LOWER(name) = LOWER(?)";
                                    var values = [hashedPassword, player.name];
                                    dbConnection_1.con.query(sql, values, function (err) {
                                        if (err)
                                            throw err;
                                        console.log("Novo registro: ".concat(player.name));
                                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " o seu registro foi conclu\u00EDdo com sucesso!"), player.id, 0xFF0000, "bold");
                                        room.sendAnnouncement("\uD83E\uDE78 Digite !help para ver os comandos dispon\u00EDveis na sala, em caso de d\u00FAvida com algum comando digite: !help <comando>", player.id, 0xFFFFFF, "bold");
                                        room.sendAnnouncement("\uD83D\uDC65 N\u00E3o se esque\u00E7a de entrar no nosso discord: ".concat(exports.discord), player.id, 0xFFFFFF, "bold");
                                        loggedInPlayers[player.id] = true;
                                    });
                                });
                            }
                        });
                    }
                });
                // Comando de Login
            }
            else if (words_1[0] === "!furar") {
                if (vips[player.id] === 1 || premiums[player.id] === 1 || legends[player.id] === 1) {
                    if (player.team == 0) {
                        if (gameState == State.PLAY) {
                            dbConnection_1.con.query("SELECT * FROM players WHERE name = ?", [player.name], function (err, result) {
                                if (err)
                                    throw err;
                                if (result.length > 0) {
                                    var tipoVip = result[0].vip;
                                    if (result[0].furar === 0) {
                                        dbConnection_1.con.query("UPDATE players SET furar = 1 WHERE name = ?", [player.name], function (err2, result2) {
                                            if (err2) {
                                                console.error(err2);
                                                return false;
                                            }
                                        });
                                        var tagFurar = "";
                                        if (result[0].vip === 1)
                                            tagFurar = "Vip";
                                        if (result[0].vip === 2)
                                            tagFurar = "Premium";
                                        if (result[0].vip === 3)
                                            tagFurar = "Legend";
                                        room.reorderPlayers([player.id], true);
                                        room.sendAnnouncement("O jogador ".concat(tagFurar, " ").concat(player.name, " furou a fila!"), null, 0xFFA500, 'bold', 2);
                                        var x = tipoVip == 1 ? 30 : tipoVip == 2 ? 20 : 10;
                                        setTimeout(function () {
                                            dbConnection_1.con.query("UPDATE players SET furar = 0 WHERE name = ?", [player.name], function (err2, result2) {
                                                if (err2) {
                                                    console.error(err2);
                                                    return false;
                                                }
                                            });
                                        }, x * 60 * 1000);
                                        return false;
                                    }
                                    else {
                                        var msgErro = tipoVip == 1 ? '30' : tipoVip == 2 ? '20' : '10';
                                        room.sendAnnouncement("Voc\u00EA s\u00F3 pode pular a fila a cada ".concat(msgErro, " minutos!"), player.id, cores_1.cores.vermelho, 'bold', 2);
                                        return false;
                                    }
                                }
                                else {
                                    room.sendAnnouncement("Ocorreu um erro ao tentar furar a fila, se o erro persistir contate algum administrador!", player.id, cores_1.cores.vermelho, "bold", 2);
                                    return false;
                                }
                            });
                        }
                        else {
                            room.sendAnnouncement("Voc\u00EA s\u00F3 pode pular a fila com o jogo em andamento!", player.id, cores_1.cores.vermelho, 'bold', 2);
                            return false;
                        }
                    }
                    else {
                        room.sendAnnouncement("Voc\u00EA precisa estar na fila de espectador para usar este comando!", player.id, cores_1.cores.vermelho, 'bold', 2);
                        return false;
                    }
                }
                else {
                    room.sendAnnouncement("Voc\u00EA precisa ser um vip para usar esse comando", player.id, cores_1.cores.vermelho, "bold", 2);
                    return false;
                }
            }
            else if (words_1[0] === "!p") {
                if (vips[player.id] === 1 || premiums[player.id] === 1 || legends[player.id] === 1) {
                    dbConnection_1.con.query("SELECT * FROM players WHERE name = ?", [player.name], function (err, result) {
                        if (err)
                            throw err;
                        if (result.length > 0) {
                            if (player.team != 0) {
                                if (gameState == State.PLAY) {
                                    if (result[0].pause === 0) {
                                        var tipoVip = result[0].vip;
                                        var tagPause = "";
                                        if (result[0].vip === 1)
                                            tagPause = "Vip";
                                        if (result[0].vip === 2)
                                            tagPause = "Premium";
                                        if (result[0].vip === 3)
                                            tagPause = "Legend";
                                        vipPausou.push(player.name);
                                        dbConnection_1.con.query("UPDATE players SET pause = 1 WHERE name = ?", [player.name], function (err2, result2) {
                                            if (err2) {
                                                console.error(err2);
                                                return false;
                                            }
                                        });
                                        room.pauseGame(true);
                                        setTimeout(function () {
                                            if (State.PAUSE) {
                                                room.pauseGame(false);
                                                room.sendAnnouncement("Jogo despausado!", null, 0xFF0000, 'bold', 2);
                                            }
                                            vipPausou.splice(vipPausou.indexOf(player.name), 1);
                                        }, tipoVip == 1 ? 10000 : (tipoVip == 2 ? 15000 : 30000));
                                        setTimeout(function () {
                                            dbConnection_1.con.query("UPDATE players SET pause = 0 WHERE name = ?", [player.name], function (err2, result2) {
                                                if (err2) {
                                                    console.error(err2);
                                                    return false;
                                                }
                                            });
                                        }, tipoVip == 1 ? 30 * 60 * 1000 : 5 * 60 * 1000);
                                        if (tipoVip == 3) {
                                            room.sendAnnouncement("Jogo pausado 30 segundos pelo ".concat(tagPause, ": ").concat(player.name), null, 0xFF0000, 'bold', 2);
                                            return false;
                                        }
                                        room.sendAnnouncement("Jogo pausado por 15 segundos pelo ".concat(tagPause, ": ").concat(player.name), null, 0xFF0000, 'bold', 2);
                                        return false;
                                    }
                                    else {
                                        if (tipoVip == 1) {
                                            room.sendAnnouncement("Voc\u00EA s\u00F3 pode usar o comando pause a cada 30 minutos. Aguarde...", player.id, cores_1.cores.vermelho, 'bold', 2);
                                            return false;
                                        }
                                        else if (tipoVip == 2) {
                                            room.sendAnnouncement("Voc\u00EA s\u00F3 pode usar o comando pause a cada 15 minutos. Aguarde...", player.id, cores_1.cores.vermelho, 'bold', 2);
                                            return false;
                                        }
                                        else {
                                            room.sendAnnouncement("Voc\u00EA s\u00F3 pode usar o comando pause a cada 5 minutos. Aguarde...", player.id, cores_1.cores.vermelho, 'bold', 2);
                                            return false;
                                        }
                                    }
                                }
                                else if (gameState == State.STOP) {
                                    room.sendAnnouncement("\uD83E\uDD16 Voc\u00EA s\u00F3 pode pausar enquanto o jogo est\u00E1 em andamento.", player.id, cores_1.cores.vermelho, 'bold', 2);
                                    return false;
                                }
                                else {
                                    room.sendAnnouncement("\uD83E\uDD16 O jogo j\u00E1 est\u00E1 pausado.", player.id, cores_1.cores.vermelho, 'bold', 2);
                                    return false;
                                }
                            }
                            else {
                                room.sendAnnouncement("Voc\u00EA precisa estar jogando para pausar o jogo", player.id, cores_1.cores.vermelho, 'bold', 2);
                                return false;
                            }
                        }
                        else {
                            room.sendAnnouncement("Ocorreu um erro ao tentar pausar a partida, se o erro persistir contate algum administrador!", player.id, cores_1.cores.vermelho, "bold", 2);
                            return false;
                        }
                    });
                }
                else {
                    room.sendAnnouncement("Voc\u00EA precisa ser um vip para usar esse comando", player.id, cores_1.cores.vermelho, "bold", 2);
                    return false;
                }
            }
            else if (words_1[0] === "!pp") {
                if (vips[player.id] === 1 || premiums[player.id] === 1 || legends[player.id] === 1) {
                    dbConnection_1.con.query("SELECT * FROM players WHERE name = ?", [player.name], function (err, result) {
                        if (err)
                            throw err;
                        if (result.length > 0) {
                            if (player.team != 0) {
                                if (gameState == State.PAUSE) {
                                    var tagUnPause = "";
                                    if (result[0].vip === 1)
                                        tagUnPause = "Vip";
                                    if (result[0].vip === 2)
                                        tagUnPause = "Premium";
                                    if (result[0].vip === 3)
                                        tagUnPause = "Legend";
                                    //if (pausarJogoOFF) {
                                    vipPausou.splice(vipPausou.indexOf(player.name), 1);
                                    room.pauseGame(false);
                                    room.sendAnnouncement("Jogo despausado pelo ".concat(tagUnPause, ": ").concat(player.name), null, 0xFF0000, 'bold', 2);
                                    return false;
                                    //}
                                }
                                else if (gameState == State.STOP) {
                                    room.sendAnnouncement("Voc\u00EA s\u00F3 pode despausar quando o jogo estiver em andamento.", player.id, cores_1.cores.vermelho, 'bold', 2);
                                    return false;
                                }
                            }
                            else {
                                room.sendAnnouncement("Voc\u00EA precisa estar jogando para despausar o jogo", player.id, cores_1.cores.vermelho, 'bold', 2);
                                return false;
                            }
                        }
                    });
                }
            }
            else if (words_1[0] === "!login") {
                if (loggedInPlayers[player.id]) { //Não tem porque executar selects se a variável indica que ele esta logado é porque tem registro.
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA j\u00E1 est\u00E1 logado."), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                var password_2 = words_1[1];
                if (!password_2) {
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA n\u00E3o digitou a senha corretamente."), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                if (password_2.length < 1) {
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA precisa colocar a senha depois do !login."), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                // Checkar a database por alguém com o mesmo nome da pessoa em questão.
                var sql = "SELECT * FROM players WHERE LOWER(name) = LOWER(?) AND password IS NOT NULL";
                var values = [player.name];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length > 0) { // Um jogador com o mesmo nome foi encontrado.
                        if (false /*result[0].loggedIn === 1*/) { // O jogador já está logado.
                            room.sendAnnouncement("\uD83E\uDE78 Voc\u00EA j\u00E1 est\u00E1 logado.", player.id, 0xFF0000, "bold", 2);
                        }
                        else {
                            // O jogador não está logado ainda, então prosseguir.
                            bcrypt.compare(password_2, result[0].password, function (err, isMatch) {
                                if (err)
                                    throw err;
                                if (isMatch) { // Password correta, permitir o login e associar game_id à conta em questão.
                                    var playerId = player.id;
                                    var conn_2 = exports.playerConnections.get(player.id);
                                    var auth_2 = exports.playerAuth.get(player.id);
                                    var sql_4 = "UPDATE players SET game_id = ?, conn = ? , auth = ?, loggedIn = 1 WHERE LOWER(name) = LOWER(?)";
                                    var values_4 = [playerId, conn_2, auth_2, player.name];
                                    dbConnection_1.con.query(sql_4, values_4, function (err) {
                                        if (err)
                                            throw err;
                                        handleRanks(player); // Definir avatar.
                                        loggedInPlayers[player.id] = true;
                                        activePlayers = room.getPlayerList().filter(function (p) {
                                            return !afkStatus[p.id];
                                        });
                                        if (result[0].ceo === 1) { // O usuário é super admin como tal dar admin ao mesmo.
                                            room.setPlayerAdmin(player.id, true);
                                            room.sendAnnouncement("\uD83D\uDC51 ".concat(player.name, ", voc\u00EA entrou logado como CEO automaticamente."), player.id, 0xFFA500, "bold");
                                            superadmin[player.id] = 1;
                                        }
                                        if (result[0].gerente === 1) {
                                            room.setPlayerAdmin(player.id, true);
                                            room.sendAnnouncement("\uD83D\uDD25 ".concat(player.name, ", voc\u00EA entrou logado como Gerente automaticamente."), player.id, 0xFFA500, "bold");
                                            gerentes[player.id] = 1;
                                        }
                                        if (result[0].admin === 1) {
                                            room.setPlayerAdmin(player.id, true);
                                            room.sendAnnouncement("\uD83D\uDEA7 ".concat(player.name, ", voc\u00EA entrou logado como Administrator automaticamente."), player.id, 0xFFA500, "bold");
                                            admins[player.id] = 1;
                                        }
                                        if (result[0].mod === 1) {
                                            room.setPlayerAdmin(player.id, true);
                                            room.sendAnnouncement("\uD83D\uDEA7 ".concat(player.name, ", voc\u00EA entrou logado como Moderador automaticamente."), player.id, 0xFFA500, "bold");
                                            mods[player.id] = 1;
                                        }
                                        console.log("".concat(player.name, " logou."));
                                        room.sendAnnouncement("\uD83E\uDE78 Bem-vindo de volta ".concat(player.name, "!"), player.id, 0xFF0000, "bold");
                                        room.sendAnnouncement("\uD83E\uDE78 Digite !help para ver os comandos dispon\u00EDveis na sala, em caso de d\u00FAvida com algum comando digite: !help <comando>", player.id, 0xFFFFFF, "bold");
                                        room.sendAnnouncement("\uD83D\uDC65 N\u00E3o se esque\u00E7a de entrar no nosso discord: ".concat(exports.discord), player.id, 0xFFFFFF, "bold");
                                        // room.sendAnnouncement(`🚧 Faça !login para poder jogar as partidas!`, player.id, 0xFFFFFF, "bold");
                                        // Limpar timeout.
                                        if (timeoutIds[player.id]) {
                                            clearTimeout(timeoutIds[player.id]);
                                            delete timeoutIds[player.id];
                                        }
                                    });
                                }
                                else {
                                    // Password errada e kick no homem, lá pra fora!
                                    room.kickPlayer(player.id, "\uD83E\uDE78 ".concat(player.name, " Senha incorreta!"));
                                    console.log("".concat(player.name, " foi expulso por digitar a senha errada ao tentar fazer login."));
                                }
                            });
                        }
                    }
                    else { // Não foi encontrada uma conta o jogador tem de se registar primeiro.
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA ainda n\u00E3o se registrou. Por favor, digite: !registrar seguido pela sua senha."), player.id, 0xFF0000, "bold", 2);
                    }
                });
                // CallAdmin:
            }
            else if (words_1[0] === "!calladmin") {
                (0, calladmin_1.calladmin)(player, message);
                return false;
                // Fundador:
            }
            else if (words_1[0] === "!rr2") {
                if (superadmin[player.id] === 1 || gerentes[player.id] === 1 || admins[player.id] === 1 || mods[player.id] === 1) {
                    room.pauseGame(true);
                    for (var i_1 = 0; i_1 < exports.teamR.length; i_1++) {
                        var playerId = exports.teamR[i_1].id;
                        var newPosition = { x: -350, y: 0 };
                        room.setPlayerDiscProperties(playerId, newPosition);
                    }
                    room.setDiscProperties(0, { x: 0, y: 0 });
                    for (var i_2 = 0; i_2 < exports.teamB.length; i_2++) {
                        var playerId = exports.teamB[i_2].id;
                        var newPosition = { x: 350, y: 0 };
                        room.setPlayerDiscProperties(playerId, newPosition);
                    }
                    room.pauseGame(false);
                    room.sendAnnouncement("\uD83D\uDEA7 ".concat(player.name, " resetou a localiza\u00E7\u00E3o da bola!"), null, 0xFFA500, 'bold', 2);
                    return false;
                }
            }
            else if (words_1[0] === "!uni" || words_1[0] === "!uniforme" || words_1[0] === "!camisetas") {
                (0, ChooseUni_1.chooseUni)(player, words_1);
                return false;
            }
            else if (words_1[0] == "!uniformes" || words_1[0] == "!unis") {
                if (words_1[1]) {
                    // Listar uniformes de um país específico
                    var country_1 = words_1[1];
                    var uniformesPorPais = uniformes_1.uniformes.filter(function (u) { return u.country.toLowerCase() === country_1.toLowerCase(); });
                    if (uniformesPorPais.length > 0) {
                        var listaUniformes = uniformesPorPais.map(function (u) { return "".concat(u.shortName, " (").concat(u.longName, ")"); }).join(', ');
                        room.sendAnnouncement("Uniformes ".concat(country_1, ":"), player.id, 0xFF0000, "bold");
                        room.sendAnnouncement("".concat(listaUniformes), player.id, 0xFFFFFF, "bold");
                        room.sendAnnouncement("Para usar um uniforme digite !uni [codigo]", player.id, 0xFF0000, "bold");
                    }
                    else {
                        room.sendAnnouncement("N\u00E3o foram encontrados uniformes ".concat(country_1, "."), player.id, cores_1.cores.vermelho, "bold", 2);
                    }
                }
                else {
                    // Listar todos os países
                    var paises = __spreadArray([], new Set(uniformes_1.uniformes.map(function (u) { return u.country; })), true).join(', ');
                    room.sendAnnouncement("Pa\u00EDses dispon\u00EDveis:", player.id, 0xFF0000, "bold");
                    room.sendAnnouncement("".concat(paises), player.id, 0xFFFFFF, "bold");
                    room.sendAnnouncement("Para ver os uniformes do pa\u00EDs digite !uniformes [pais]", player.id, 0xFF0000, "bold");
                }
                return false;
            }
            else if (words_1[0] === "!setvip") {
                if (superadmin[player.id] === 1 || gerentes[player.id] === 1) {
                    var input = words_1;
                    var jogador = input[1];
                    var vipType = input[2];
                    var userId;
                    var userName;
                    if (jogador.startsWith("#")) {
                        var id = jogador.substring(1);
                        var playerSet = room.getPlayerList().filter(function (p) { return p.id === parseInt(id); });
                        if (playerSet) {
                            userId = playerSet[0].id;
                            userName = playerSet[0].name;
                        }
                        else {
                            room.sendAnnouncement("\uD83E\uDE78 N\u00E3o consegui encontrar nenhum jogador com o ID ".concat(id, "!"), player.id, cores_1.cores.vermelho, "bold", 2);
                            return false;
                        }
                    }
                    else {
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " voc\u00EA n\u00E3o digitou o comando corretamente. (Ex: !setvip #id 1-3)"), player.id, 0xFF0000, "bold", 2);
                        return false;
                    }
                    if (!userId || !userName) {
                        room.sendAnnouncement("\uD83E\uDE78 N\u00E3o consegui encontrar nenhum jogador com esse ID!", player.id, cores_1.cores.vermelho, "bold", 2);
                        return false;
                    }
                    if (!vipType || isNaN(vipType) || vipType > 3 || vipType < 1) {
                        room.sendAnnouncement("\uD83E\uDE78 Voc\u00EA n\u00E3o digitou o vip corretamente. (Ex: !setvip #id 1-3)", player.id, cores_1.cores.vermelho, "bold", 2);
                        return false;
                    }
                    dbConnection_1.con.query("SELECT * FROM players WHERE name = ?", [userName], function (err, result) {
                        if (err)
                            throw err;
                        if (result.length > 0) {
                            if (vipType === '1') {
                                if (result[0].vip === 0) {
                                    dbConnection_1.con.query("UPDATE players SET vip = 1 WHERE name = ?", [userName], function (err, result) {
                                        if (err) {
                                            console.error(err);
                                            return false;
                                        }
                                        if (result.affectedRows > 0) {
                                            room.sendAnnouncement("\uD83D\uDC8E O ".concat(player.name, " concedeu o cargo de VIP para o ").concat(userName, "!"), null, 0xFFA500, "bold", 2);
                                            room.sendAnnouncement("Parab\u00E9ns ".concat(userName, "! Voc\u00EA recebeu o cargo \"Vip\" pelo Admin ").concat(player.name), userId, cores_1.cores.cinza, "bold", 2);
                                            vips[userId] = 1;
                                        }
                                        else {
                                            return false;
                                        }
                                    });
                                }
                                else {
                                    room.sendAnnouncement("O ".concat(userName, " j\u00E1 \u00E9 um jogador Vip!"), player.id, cores_1.cores.vermelho, "bold", 2);
                                    return false;
                                }
                            }
                            if (vipType === '2') {
                                if (result[0].vip === 0) {
                                    dbConnection_1.con.query("UPDATE players SET vip = 2 WHERE name = ?", [userName], function (err, result) {
                                        if (err) {
                                            console.error(err);
                                            return false;
                                        }
                                        if (result.affectedRows > 0) {
                                            room.sendAnnouncement("O ".concat(player.name, " concedeu o cargo de PREMIUM para o ").concat(userName, "!"), null, 0xFFA500, "bold", 2);
                                            room.sendAnnouncement("Parab\u00E9ns ".concat(userName, "! Voc\u00EA recebeu o cargo \"Premium\" pelo Admin ").concat(player.name), userId, cores_1.cores.cinza, "bold", 2);
                                            premiums[userId] = 1;
                                        }
                                        else {
                                            return false;
                                        }
                                    });
                                }
                                else {
                                    room.sendAnnouncement("O ".concat(userName, " j\u00E1 \u00E9 um jogador Premium!"), player.id, cores_1.cores.vermelho, "bold", 2);
                                    return false;
                                }
                            }
                            if (vipType === '3') {
                                if (result[0].vip === 0) {
                                    dbConnection_1.con.query("UPDATE players SET vip = 3 WHERE name = ?", [userName], function (err, result) {
                                        if (err) {
                                            console.error(err);
                                            return false;
                                        }
                                        if (result.affectedRows > 0) {
                                            room.sendAnnouncement("\uD83C\uDF0B O ".concat(player.name, " concedeu o cargo de LEGEND para o ").concat(userName, "!"), null, 0xFFA500, "bold", 2);
                                            room.sendAnnouncement("Parab\u00E9ns ".concat(userName, "! Voc\u00EA recebeu o cargo \"Legend\" pelo Admin ").concat(player.name), userId, cores_1.cores.cinza, "bold", 2);
                                            legends[userId] = 1;
                                        }
                                        else {
                                            return false;
                                        }
                                    });
                                }
                                else {
                                    room.sendAnnouncement("O ".concat(userName, " j\u00E1 \u00E9 um jogador Legend!"), player.id, cores_1.cores.vermelho, "bold", 2);
                                    return false;
                                }
                            }
                        }
                        else {
                            room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " N\u00E3o encontrei um jogador com esse nome/id."), player.id, 0xFF0000, "bold", 2);
                            return false;
                        }
                    });
                }
                //SETAR ADMIN
            }
            else if (words_1[0] === "!setadmin") {
                if (words_1.length < 3) {
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA n\u00E3o digitou o comando corretamente. (Ex: !setadmin #id 1-4)"), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                var input_1 = words_1;
                var jogador_1 = input_1[1];
                var adminType_1 = input_1[2];
                var userId;
                var userName;
                if (jogador_1.startsWith("#")) {
                    id = parseInt(jogador_1.substring(1), 10); // Aqui está a correção
                    var playerSet = room.getPlayer(id);
                    if (playerSet) {
                        userId = playerSet.id;
                        userName = playerSet.name;
                    }
                    else {
                        room.sendAnnouncement("\uD83E\uDE78 N\u00E3o consegui encontrar nenhum jogador com o ID ".concat(id, "!"), player.id, cores_1.cores.vermelho, "bold", 2);
                        return false;
                    }
                }
                else {
                    return false;
                }
                if (!userId || !userName) {
                    room.sendAnnouncement("\uD83E\uDE78 N\u00E3o consegui encontrar nenhum jogador com esse ID!", player.id, cores_1.cores.vermelho, "bold", 2);
                    return false;
                }
                if (userId === player.id) {
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " voc\u00EA n\u00E3o pode se auto-promover."), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                if (!adminType_1 || isNaN(adminType_1)) {
                    room.sendAnnouncement("\uD83E\uDE78 Voc\u00EA n\u00E3o digitou o cargo corretamente. (Ex: !setadmin #id 1-4)", player.id, cores_1.cores.vermelho, "bold", 2);
                    return false;
                }
                // Verifica se o jogador que está tentando usar o comando é um CEO
                dbConnection_1.con.query("SELECT * FROM players WHERE name = ? AND ceo = 1", [player.name], function (err, result) {
                    if (err)
                        throw err;
                    if (result.length > 0) {
                        var adminColumn = '';
                        if (adminType_1 === '1') {
                            adminColumn = '`ceo`';
                        }
                        else if (adminType_1 === '2') {
                            adminColumn = '`gerente`';
                        }
                        else if (adminType_1 === '3') {
                            adminColumn = '`admin`';
                        }
                        else if (adminType_1 === '4') {
                            adminColumn = '`mod`';
                        }
                        else {
                            room.sendAnnouncement("\uD83E\uDE78 Voc\u00EA n\u00E3o digitou o cargo corretamente. (Ex: !setadmin #id 1-4)", player.id, cores_1.cores.vermelho, "bold", 2);
                            return false;
                        }
                        dbConnection_1.con.query("UPDATE players SET ".concat(adminColumn, " = 1 WHERE name = ?"), [userName], function (err, result) {
                            if (err)
                                throw err;
                            if (result.affectedRows > 0) {
                                room.sendAnnouncement("\uD83D\uDC51 ".concat(userName, " Agora \u00E9 um ").concat(adminColumn.replace(/`/g, ''), "!"), null, 0xFFA500, "bold", 2);
                                room.sendAnnouncement("\uD83D\uDC51 ".concat(userName, " Por favor, saia e entre na sala novamente para que o cargo seja atualizado."), userId, 0xFF0000, "bold", 2);
                                superadmin[userId] = parseInt(adminType_1);
                            }
                            else {
                                return false;
                            }
                        });
                    }
                    else {
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(userName, " voc\u00EA n\u00E3o tem permiss\u00E3o para usar este comando."), player.id, 0xFF0000, "bold", 2);
                        return false;
                    }
                });
                //MUDAR SENHA
            }
            else if (words_1[0] === "!mudarsenha") {
                var input_2 = words_1;
                if (input_2.length < 3) {
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " utilize o seguinte formato: !mudarsenha antiga_senha nova_senha"), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                var oldPassword_1 = input_2[1];
                var newPassword_1 = input_2[2];
                if (!oldPassword_1 || !newPassword_1) {
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " voc\u00EA precisa colocar uma senha antiga e uma nova senha depois do comando !mudarsenha"), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                if (oldPassword_1.length < 3 || newPassword_1.length < 3) {
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " a senha deve ter pelo menos 3 caracteres."), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                var sql = "SELECT * FROM players WHERE LOWER(name) = LOWER(?)";
                var values = [player.name];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length > 0) {
                        var hashedPassword = result[0].password;
                        bcrypt.compare(oldPassword_1, hashedPassword, function (err, match) {
                            if (err)
                                throw err;
                            if (match) {
                                bcrypt.hash(newPassword_1, 10, function (err, newHashedPassword) {
                                    if (err)
                                        throw err;
                                    var sql = "UPDATE players SET password = ? WHERE LOWER(name) = LOWER(?)";
                                    var values = [newHashedPassword, player.name];
                                    dbConnection_1.con.query(sql, values, function (err) {
                                        if (err)
                                            throw err;
                                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " A sua senha foi alterada com sucesso!"), player.id, 0xFFFFFF, "bold");
                                        console.log("".concat(player.name, " alterou a senha."));
                                    });
                                });
                            }
                            else {
                                room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " A sua senha antiga est\u00E1 incorreta."), player.id, 0xFF0000, "bold", 2);
                                console.log("".concat(player.name, " tentou mudar a senha mas errou a senha antiga."));
                            }
                        });
                    }
                    else {
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " A sua conta n\u00E3o est\u00E1 registrada."), player.id, 0xFF0000, "bold", 2);
                    }
                });
                // Comando AFK
            }
            else if (message === "!afk" && allowAFK) {
                if (loggedInPlayers[player.id]) {
                    var playersGaming = room.getPlayerList().filter(function (p) { return p.team > 0; });
                    if (playersGaming.length >= getMaxTeamSize() * 2 && (player.team === 1 || player.team === 2)) {
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA n\u00E3o pode ficar AFK pois est\u00E1 no meio de uma partida."), player.id, 0xFF0000, "bold", 2);
                    }
                    // Está logado, logo proceder com o comando.
                    else if (afkStatus[player.id] === 1) {
                        afkStatus[player.id] = 0;
                        room.sendAnnouncement("\uD83D\uDCA4 ".concat(player.name, " n\u00E3o est\u00E1 mais AFK!"), null, 0xFFA500, "bold", 0);
                        if (timeoutIds[player.id]) {
                            clearTimeout(timeoutIds[player.id]);
                            delete timeoutIds[player.id];
                        }
                        loggedInPlayers[player.id] = true;
                    }
                    else {
                        room.setPlayerTeam(player.id, Team.SPECTATORS);
                        afkStatus[player.id] = 1;
                        room.sendAnnouncement("\uD83D\uDCA4 ".concat(player.name, " agora est\u00E1 AFK!"), null, 0xFFA500, "bold", 0);
                        // Levar kick por AFK +10 minutos se não for superAdmin
                        if (superadmin[player.id] !== 1 || gerentes[player.id] !== 1 || admins[player.id] !== 1 || mods[player.id] !== 1) {
                            setTimeout(function () {
                                if (afkStatus[player.id] === 1) {
                                    afkStatus[player.id] = 0;
                                    // room.kickPlayer(player.id, `🩸 ${player.name} Você ficou AFK por muito tempo.`);
                                }
                            }, 10 * 60 * 1000); // 10 minutos = 600000 ms
                        }
                    }
                    activePlayers = room.getPlayerList().filter(function (p) {
                        return !afkStatus[p.id];
                    });
                    afkStatus[player.id] ? updateRoleOnPlayerOut() : updateRoleOnPlayerIn();
                }
                else {
                    // Jogador não está logado, logo não pode ir AFK
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " voc\u00EA precisa estar logado para usar este comando."), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
            }
            else if (words_1[0] === "!listafks") {
                var afkPlayers = room.getPlayerList().filter(function (p) { return afkStatus[p.id] === 1; });
                var playerNames = afkPlayers.map(function (p) {
                    return room.getPlayer(p.id).name;
                });
                if (playerNames.length > 0) {
                    room.sendAnnouncement("\uD83D\uDCA4 Lista de jogadores AFK: ".concat(playerNames.join(", ")), player.id, 0xFFFFFF, "bold");
                }
                else {
                    room.sendAnnouncement("\uD83E\uDE78 N\u00E3o h\u00E1 jogadores AFK no momento.", player.id, 0xFF0000, "bold");
                }
                // Comando Streak
            }
            else if (words_1[0] === "!sequencia") {
                room.sendAnnouncement("\uD83C\uDFC6 ".concat(player.name, " a sequ\u00EAncia atual da sala \u00E9 de ").concat(winstreak, " jogos para a equipe \uD83D\uDD34!"), player.id, 0xFFFFFF, "bold");
                // Comando Top Streak
            }
            else if (words_1[0] === "!topsequencia") {
                var sql = "SELECT * FROM streak ORDER BY games DESC LIMIT 1";
                dbConnection_1.con.query(sql, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length == 0) {
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " n\u00E3o h\u00E1 nenhuma streak registrada."), player.id, 0xFF0000, "bold", 2);
                        return false;
                    }
                    room.sendAnnouncement("\uD83C\uDFC6 ".concat(player.name, " a top sequ\u00EAncia atual \u00E9 de ").concat(result[0].games, " jogos e foi conquistada pelos jogadores ").concat(result[0].player1, ", ").concat(result[0].player2, " e ").concat(result[0].player3, "!"), player.id, 0xFFFFFF, "bold");
                });
                // Logout bem básico.
            }
            else if (words_1[0] === "!bb") {
                room.kickPlayer(player.id, "\uD83D\uDC4B Adeus ".concat(player.name, ", at\u00E9 a pr\u00F3xima!"));
                // Comando para mostrar o link do meu discord.
            }
            else if (words_1[0] === "!discord" || words_1[0] === "!disc") {
                room.sendAnnouncement("\uD83D\uDC65 Discord: ".concat(exports.discord), player.id, 0x094480, "bold");
                // Comando das estatísticas
            }
            else if (words_1[0] === "!stats" || words_1[0] === "!me" || words_1[0] === "!status") {
                var sql = "SELECT * FROM players WHERE LOWER(name) = LOWER(?)";
                var values = [player.name];
                dbConnection_1.con.query(sql, values, function (err, playersResult) {
                    if (err)
                        throw err;
                    if (playersResult.length === 0) {
                        room.sendAnnouncement("Voc\u00EA n\u00E3o est\u00E1 registrado! Digite: !registrar <senha> para se registrar.", player.id, 0xFF0000, "bold", 2);
                    }
                    else {
                        var playerID = playersResult[0].id;
                        var sqlStats = "SELECT * FROM stats WHERE player_id = ? AND room_id = ?";
                        var statsValues = [playerID, process.env.room_id];
                        dbConnection_1.con.query(sqlStats, statsValues, function (err, statsResult) {
                            if (err)
                                throw err;
                            if (statsResult.length === 0) {
                                room.sendAnnouncement("N\u00E3o h\u00E1 estat\u00EDsticas dispon\u00EDveis para voc\u00EA.", player.id, 0xFF0000, "bold", 2);
                            }
                            else {
                                var stats = statsResult[0];
                                var totalGoals = Number(stats.goals) || 0;
                                var totalAssists = Number(stats.assists) || 0;
                                var totalGames = Number(stats.games) || 0;
                                var totalWins = Number(stats.wins) || 0;
                                var averageGoalsPerGame = 0;
                                var averageAssistsPerGame = 0;
                                var winRate = 0;
                                if (totalGames > 0) {
                                    averageGoalsPerGame = totalGoals / totalGames;
                                    averageAssistsPerGame = totalAssists / totalGames;
                                    winRate = (totalWins / totalGames) * 100;
                                }
                                room.sendAnnouncement("\uD83D\uDCCA Voc\u00EA tem uma m\u00E9dia de ".concat(averageGoalsPerGame.toFixed(2), " gols e ").concat(averageAssistsPerGame.toFixed(2), " assist\u00EAncias por jogo e um percentual de vit\u00F3ria de ").concat(winRate.toFixed(2), "%."), player.id, 0xFFFFFF, "bold", 0);
                                room.sendAnnouncement("\uD83D\uDCCA O seu ELO: ".concat(stats.elo), player.id, 0xFF0000, "bold");
                                room.sendAnnouncement("\uD83D\uDCCA As suas estat\u00EDsticas: Jogos: ".concat(stats.games, ", Vit\u00F3rias: ").concat(stats.wins, ", Derrotas: ").concat(stats.losses, ", Gols: ").concat(stats.goals, ", Assist\u00EAncias: ").concat(stats.assists, ", Gols contras: ").concat(stats.ag, ", CS: ").concat(stats.cs), player.id, 0xFFFFFF, "bold", 0);
                            }
                        });
                    }
                });
            }
            else if (words_1[0] === "!gols" || words_1[0] === "!goals") {
                // Retrieve the top 10 goal scorers in the room
                var sql = "SELECT p.name, s.goals FROM stats s JOIN players p ON s.player_id = p.id WHERE s.room_id = ? ORDER BY s.goals DESC LIMIT 10";
                var values = [process.env.room_id];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement("\uD83E\uDE78 N\u00E3o h\u00E1 dados suficientes para exibir os artilheiros.", player.id, 0xFF0000, "bold", 2);
                    }
                    else {
                        // Displaying the top scorers on one line
                        var announcement_1 = "\uD83C\uDFC6\u26BD Top 10 Artilheiros: ";
                        result.forEach(function (player, index) {
                            announcement_1 += "#".concat(index + 1, " ").concat(player.name, ": ").concat(player.goals, "; ");
                        });
                        room.sendAnnouncement(announcement_1, player.id, 0xFFFFFF, "bold");
                    }
                });
            }
            else if (words_1[0] === "!assists" || words_1[0] === "!assistencias") {
                // Retrieve the top 10 goal scorers in the room
                var sql = "SELECT p.name, s.assists FROM stats s JOIN players p ON s.player_id = p.id WHERE s.room_id = ? ORDER BY s.assists DESC LIMIT 10";
                var values = [process.env.room_id];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement("\uD83E\uDE78 N\u00E3o h\u00E1 dados suficientes para exibir os assistentes.", player.id, 0xFF0000, "bold", 2);
                    }
                    else {
                        // Displaying the top scorers on one line
                        var announcement_2 = "\uD83C\uDFC6\uD83C\uDD70\uFE0F Top 10 em Assist\u00EAncias: ";
                        result.forEach(function (player, index) {
                            announcement_2 += "#".concat(index + 1, " ").concat(player.name, ": ").concat(player.assists, "; ");
                        });
                        room.sendAnnouncement(announcement_2, player.id, 0xFFFFFF, "bold");
                    }
                });
            }
            else if (words_1[0] === "!golscontra" || words_1[0] === "!owngoals") {
                // Retrieve the top 10 players with most own goals in the room
                var sql = "SELECT p.name, s.ag FROM stats s JOIN players p ON s.player_id = p.id WHERE s.room_id = ? ORDER BY s.ag DESC LIMIT 10";
                var values = [process.env.room_id];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement("\uD83E\uDE78 N\u00E3o h\u00E1 dados suficientes para exibir os jogadores com mais gols contra.", player.id, 0xFF0000, "bold", 2);
                    }
                    else {
                        // Displaying the top players with most own goals on one line
                        var announcement_3 = "\uD83E\uDD45\uD83C\uDFC6 Top 10 Jogadores com Mais Gols Contra: ";
                        result.forEach(function (player, index) {
                            announcement_3 += "#".concat(index + 1, " ").concat(player.name, ": ").concat(player.ag, "; ");
                        });
                        room.sendAnnouncement(announcement_3, player.id, 0xFFFFFF, "bold");
                    }
                });
            }
            else if (words_1[0] === "!ricos" || words_1[0] === "!rich") {
                // Retrieve the top 10 richest players
                var sql = "SELECT p.name, p.balance FROM players p ORDER BY p.balance DESC LIMIT 10";
                dbConnection_1.con.query(sql, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement("\uD83E\uDE78 N\u00E3o h\u00E1 dados suficientes para exibir os jogadores mais ricos.", player.id, 0xFF0000, "bold", 2);
                    }
                    else {
                        // Displaying the top richest players on one line
                        var announcement_4 = "\uD83D\uDCB0\uD83C\uDFC6 Top 10 Jogadores Mais Ricos: ";
                        result.forEach(function (player, index) {
                            // Format the balance to remove decimals and add thousand separators
                            var formattedBalance = Number(player.balance).toLocaleString('pt-BR');
                            announcement_4 += "#".concat(index + 1, " ").concat(player.name, ": ").concat(formattedBalance, "; ");
                        });
                        // Remove the last semicolon
                        announcement_4 = announcement_4.slice(0, -2);
                        room.sendAnnouncement(announcement_4.trim(), player.id, 0xFFFFFF, "bold");
                    }
                });
            }
            else if (words_1[0] === "!jogos" || words_1[0] === "!games") {
                // Retrieve the top 10 goal scorers in the room
                var sql = "SELECT p.name, s.games FROM stats s JOIN players p ON s.player_id = p.id WHERE s.room_id = ? ORDER BY s.games DESC LIMIT 10";
                var values = [process.env.room_id];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement("\uD83E\uDE78 N\u00E3o h\u00E1 dados suficientes para exibir os jogos.", player.id, 0xFF0000, "bold", 2);
                    }
                    else {
                        // Displaying the top scorers on one line
                        var announcement_5 = "\uD83C\uDFC6\uD83C\uDFDF\uFE0F Top 10 em Jogos: ";
                        result.forEach(function (player, index) {
                            announcement_5 += "#".concat(index + 1, " ").concat(player.name, ": ").concat(player.games, "; ");
                        });
                        room.sendAnnouncement(announcement_5, player.id, 0xFFFFFF, "bold");
                    }
                });
            }
            else if (words_1[0] === "!vitorias" || words_1[0] === "!wins") {
                // Retrieve the top 10 goal scorers in the room
                var sql = "SELECT p.name, s.wins FROM stats s JOIN players p ON s.player_id = p.id WHERE s.room_id = ? ORDER BY s.wins DESC LIMIT 10";
                var values = [process.env.room_id];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement("\uD83E\uDE78 N\u00E3o h\u00E1 dados suficientes para exibir as vit\u00F3rias.", player.id, 0xFF0000, "bold", 2);
                    }
                    else {
                        // Displaying the top scorers on one line
                        var announcement_6 = "\uD83C\uDFC6\u2705 Top 10 em Vit\u00F3rias: ";
                        result.forEach(function (player, index) {
                            announcement_6 += "#".concat(index + 1, " ").concat(player.name, ": ").concat(player.wins, "; ");
                        });
                        room.sendAnnouncement(announcement_6, player.id, 0xFFFFFF, "bold");
                    }
                });
            }
            else if (words_1[0] === "!cs") {
                // Retrieve the top 10 goal scorers in the room
                var sql = "SELECT p.name, s.cs FROM stats s JOIN players p ON s.player_id = p.id WHERE s.room_id = ? ORDER BY s.cs DESC LIMIT 10";
                var values = [process.env.room_id];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement("\uD83E\uDE78 N\u00E3o h\u00E1 dados suficientes para exibir os dados de CS.", player.id, 0xFF0000, "bold", 2);
                    }
                    else {
                        // Displaying the top scorers on one line
                        var announcement_7 = "\uD83C\uDFC6\uD83D\uDC4B Top 10 em CS: ";
                        result.forEach(function (player, index) {
                            announcement_7 += "#".concat(index + 1, " ").concat(player.name, ": ").concat(player.cs, "; ");
                        });
                        room.sendAnnouncement(announcement_7, player.id, 0xFFFFFF, "bold");
                    }
                });
            }
            else if (words_1[0] === "!gk") {
                // Coloca status de GK no jogador que digitou o comando
                if (player.team === 1) { // Equipe RED
                    gk[0] = player; // Atualiza o GK do Red
                    var redTeamPlayers = room.getPlayerList().filter(function (p) { return p.team === 1; }); // Obtém a lista de jogadores da equipe RED
                    redTeamPlayers.forEach(function (p) {
                        room.sendAnnouncement("\uD83D\uDD34 ".concat(player.name, " \u00E9 agora o GK do Red!"), p.id, 0xFFFFFF, "bold", 0); // Envia o anúncio apenas para os jogadores da equipe RED
                    });
                }
                else if (player.team === 2) { // Equipe BLUE
                    gk[1] = player; // Atualiza o GK do Blue
                    var blueTeamPlayers = room.getPlayerList().filter(function (p) { return p.team === 2; }); // Obtém a lista de jogadores da equipe BLUE
                    blueTeamPlayers.forEach(function (p) {
                        room.sendAnnouncement("\uD83D\uDD35 ".concat(player.name, " \u00E9 agora o GK do Blue!"), p.id, 0xFFFFFF, "bold", 0); // Envia o anúncio apenas para os jogadores da equipe BLUE
                    });
                }
                else {
                    // Se o jogador não está em uma equipe, envia uma mensagem de erro
                    room.sendAnnouncement("Voc\u00EA precisa estar em uma equipe para ser o GK.", player.id, 0xFF0000, "bold", 0);
                }
                return false;
            }
            else if (words_1[0] === "!unmute") {
                // Verifica se o jogador tem permissão para usar o comando
                var sql = "SELECT * FROM players WHERE LOWER(name) = LOWER(?)";
                var values = [player.name];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err) {
                        room.sendAnnouncement("\uD83E\uDE78 Erro no banco de dados: ".concat(err.message), player.id, 0xFF0000, "bold", 2);
                        console.error(err);
                        return;
                    }
                    if (result.length === 0 || !loggedInPlayers[player.id] || !(result[0].ceo || result[0].gerente || result[0].admin || result[0].mod)) {
                        room.sendAnnouncement("🩸 Você não tem autorização para usar este comando!", player.id, 0xFF0000, "bold", 2);
                        return;
                    }
                    // Espera uma menção com "@" e manipulação de formato incorreto
                    if (words_1.length < 2 || !words_1[1].startsWith('@')) {
                        room.sendAnnouncement("🩸 Por favor, mencione um jogador com '@nomeDoJogador' para desmutar.", player.id, 0xFF0000, "bold", 2);
                        return;
                    }
                    // Parseia o nome do jogador mencionado removendo o prefixo "@" e substituindo underscores por espaços
                    var targetPlayerName = words_1[1].substring(1).replace(/_/g, ' ').toLowerCase(); // Transforma para minúsculo
                    console.log("Attempting to unmute: ".concat(targetPlayerName)); // Debug: Mostra o nome do jogador mencionado
                    // Find the mentioned player in the room.
                    var targetPlayer = room.getPlayerList().find(function (p) { return p.name.toLowerCase() === targetPlayerName; });
                    if (!targetPlayer) {
                        room.sendAnnouncement("🩸 Jogador não encontrado.", player.id, 0xFF0000, "bold", 2);
                        return;
                    }
                    // Query para verificar se um mute está ativo e ainda não expirou
                    dbConnection_1.con.query("SELECT * FROM mutes WHERE LOWER(name) = LOWER(?)", [targetPlayer.name], function (err, result) {
                        if (err) {
                            room.sendAnnouncement("\uD83E\uDE78 Erro ao acessar registros de mute: ".concat(err.message), player.id, 0xFF0000, "bold", 2);
                            console.error(err);
                            return;
                        }
                        if (result.length === 0) {
                            room.sendAnnouncement("\uD83E\uDE78 O jogador n\u00E3o est\u00E1 mutado ou o mute j\u00E1 expirou.", player.id, 0xFF0000, "bold", 2);
                            console.log('No mute records found'); // Debug: Confirma que não há registros de mute
                        }
                        else {
                            var muteRecord = result[0];
                            console.log("Found mute record expiring at ".concat(muteRecord.time));
                            // Checa se o mute ainda está ativo
                            var muteExpiration = new Date(muteRecord.time);
                            var currentTime = new Date();
                            if (currentTime < muteExpiration) {
                                // Se o mute ainda está ativo, deleta o registro de mute
                                dbConnection_1.con.query("DELETE FROM mutes WHERE id = ?", [muteRecord.id], function (err, result) {
                                    if (err) {
                                        room.sendAnnouncement("\uD83E\uDE78 Erro ao desmutar: ".concat(err.message), player.id, 0xFF0000, "bold", 2);
                                        console.error(err);
                                        return;
                                    }
                                    if (result.affectedRows > 0) {
                                        room.sendAnnouncement("\uD83E\uDE78 ".concat(targetPlayer.name, " desmutado com sucesso!"), null, 0xFFA500, "bold");
                                        isMuted[targetPlayer.id] = false;
                                    }
                                    else {
                                        room.sendAnnouncement("\uD83E\uDE78 Falha ao desmutar, por favor tente novamente.", player.id, 0xFF0000, "bold", 2);
                                    }
                                });
                            }
                            else {
                                room.sendAnnouncement("\uD83E\uDE78 O mute para ".concat(targetPlayer.name, " j\u00E1 expirou."), player.id, 0xFFA500, "bold");
                            }
                        }
                    });
                });
            }
            else if (words_1[0] === "!unban") {
                // Checkar a database por alguém com o mesmo nome da pessoa em questão.
                var sql = "SELECT * FROM players WHERE LOWER(name) = LOWER(?)";
                var values = [player.name];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length > 0) {
                        if (!loggedInPlayers[player.id] || !(result[0].ceo || result[0].gerente || result[0].admin || result[0].mod)) {
                            room.sendAnnouncement("🩸 Você não tem autorização para usar este comando!", player.id, 0xFF0000, "bold", 2);
                        }
                        else {
                            var currentDate = new Date();
                            var name_2 = words_1.slice(1).join(" ");
                            var targetPlayer_2 = room.getPlayerList().find(function (p) { return p.name === name_2; });
                            // Remover o ban se o ban ainda estiver ativo.
                            dbConnection_1.con.query("DELETE FROM bans WHERE name = ? and time > ?", [name_2, currentDate], function (err, result) {
                                if (err)
                                    throw err;
                                if (result.affectedRows > 0) {
                                    room.sendAnnouncement("\uD83E\uDE78 Desbanido com sucesso!", null, 0xFFA500, "bold");
                                    if (targetPlayer_2) {
                                        isMuted[targetPlayer_2.id] = false;
                                    }
                                }
                                else {
                                    room.sendAnnouncement("\uD83E\uDE78 O jogador n\u00E3o est\u00E1 banido.", player.id, 0xFF0000, "bold", 2);
                                }
                            });
                        }
                    }
                });
            }
            else if (words_1[0] === "!ban") {
                var sql = "SELECT * FROM players WHERE LOWER(name) = LOWER(?)";
                var values = [player.name];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length === 0 || !loggedInPlayers[player.id] || !(result[0].ceo || result[0].gerente || result[0].admin || result[0].mod)) {
                        room.sendAnnouncement("🩸 Você não tem autorização para usar este comando!", player.id, 0xFF0000, "bold", 2);
                        return;
                    }
                    if (words_1.length < 2 || !words_1[1].startsWith('@')) {
                        room.sendAnnouncement("🩸 Por favor, mencione um jogador com '@nomeDoJogador'.", player.id, 0xFF0000, "bold", 2);
                        return;
                    }
                    var targetPlayerName = words_1[1].substring(1).replace(/_/g, ' '); // Remove '@' e substitui underscores por espaços
                    var reason = words_1.slice(2).join(" ") || "Sem motivo";
                    var timeStr = "6h"; // Padrão para 6 horas
                    var timeRegex = /^(\d+)([a-zA-Z]+)$/;
                    words_1.slice(2).some(function (word) {
                        if (word.match(timeRegex)) {
                            timeStr = word;
                            reason = words_1.slice(words_1.indexOf(word) + 1).join(" ");
                            return true;
                        }
                    });
                    var match = timeStr.match(timeRegex);
                    if (!match) {
                        room.sendAnnouncement("🩸 Formato de tempo inválido. Use um número seguido de d (Dias), h (Horas), m (Minutos), ou s (Segundos)", player.id, 0xFF0000, "bold", 2);
                        return;
                    }
                    var duration = parseInt(match[1]);
                    var unit = match[2];
                    var banDuration = 0;
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
                            room.sendAnnouncement("🩸 Formato de tempo inválido.", player.id, 0xFF0000, "bold", 2);
                            return;
                    }
                    var banEndTime = new Date(Date.now() + banDuration);
                    var timezoneOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
                    var localBanEndTime = new Date(banEndTime.getTime() - timezoneOffsetMs);
                    var banEndTimeFormatted = localBanEndTime.toISOString().slice(0, 19).replace('T', ' ');
                    // Tenta achar o jogador alvo por menção e aplicar o ban se existir
                    var targetPlayer = room.getPlayerList().find(function (p) { return p.name.toLowerCase() === targetPlayerName.toLowerCase(); });
                    if (targetPlayer) {
                        var conn_3 = exports.playerConnections.get(targetPlayer.id);
                        var auth_3 = exports.playerAuth.get(targetPlayer.id);
                        var sqlInsert = "INSERT INTO bans (name, time, reason, banned_by, conn, auth) VALUES (?, ?, ?, ?, ?, ?)";
                        var valuesInsert = [targetPlayer.name, banEndTimeFormatted, reason, player.name, conn_3, auth_3];
                        dbConnection_1.con.query(sqlInsert, valuesInsert, function (err, result) {
                            if (err)
                                throw err;
                            room.sendAnnouncement("\uD83E\uDE78 ".concat(targetPlayer.name, " banido com sucesso!"), null, 0xFFA500, "bold");
                            // Bane o jogador alvo
                            room.kickPlayer(targetPlayer.id, "\uD83E\uDE78 Voc\u00EA foi banido. Motivo: ".concat(reason, " at\u00E9 ").concat(banEndTimeFormatted, "."));
                        });
                    }
                    else {
                        room.sendAnnouncement("🩸 Jogador não encontrado.", player.id, 0xFF0000, "bold", 2);
                    }
                });
            }
            else if (words_1[0] === "!mute") {
                var sql = "SELECT * FROM players WHERE LOWER(name) = LOWER(?)";
                var values = [player.name];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length === 0 || !loggedInPlayers[player.id] || !(result[0].ceo || result[0].gerente || result[0].admin || result[0].mod)) {
                        room.sendAnnouncement("🩸 Você não tem autorização para usar este comando!", player.id, 0xFF0000, "bold", 2);
                        return;
                    }
                    if (words_1.length < 2 || !words_1[1].startsWith('@')) {
                        room.sendAnnouncement("🩸 Por favor, mencione um jogador com '@nomeDoJogador'.", player.id, 0xFF0000, "bold", 2);
                        return;
                    }
                    var targetPlayerName = words_1[1].substring(1).replace(/_/g, ' '); // Remove '@' e substitui underscores por espaços
                    var reason = words_1.slice(2).join(" ") || "Sem motivo";
                    var timeStr = "5m"; // Padrão para 5 minutos
                    var timeRegex = /^(\d+)([a-zA-Z]+)$/;
                    words_1.slice(2).some(function (word) {
                        if (word.match(timeRegex)) {
                            timeStr = word;
                            reason = words_1.slice(words_1.indexOf(word) + 1).join(" ");
                            return true;
                        }
                    });
                    var match = timeStr.match(timeRegex);
                    if (!match) {
                        room.sendAnnouncement("🩸 Formato de tempo inválido. Use um número seguido de d (Dias), h (Horas), m (Minutos), ou s (Segundos)", player.id, 0xFF0000, "bold", 2);
                        return;
                    }
                    var duration = parseInt(match[1]);
                    var unit = match[2];
                    var muteDuration = 0;
                    switch (unit) {
                        case "d":
                            muteDuration = duration * 24 * 60 * 60 * 1000;
                            break;
                        case "h":
                            muteDuration = duration * 60 * 60 * 1000;
                            break;
                        case "m":
                            muteDuration = duration * 60 * 1000;
                            break;
                        case "s":
                            muteDuration = duration * 1000;
                            break;
                        default:
                            room.sendAnnouncement("🩸 Formato de tempo inválido.", player.id, 0xFF0000, "bold", 2);
                            return;
                    }
                    var muteEndTime = new Date(Date.now() + muteDuration);
                    var timezoneOffsetMs = new Date().getTimezoneOffset() * 60 * 1000;
                    var localMuteEndTime = new Date(muteEndTime.getTime() - timezoneOffsetMs);
                    var muteEndTimeFormatted = localMuteEndTime.toISOString().slice(0, 19).replace('T', ' ');
                    // Tenta achar o jogador alvo por menção e aplicar o mute se existir
                    var targetPlayer = room.getPlayerList().find(function (p) { return p.name.toLowerCase() === targetPlayerName.toLowerCase(); });
                    if (targetPlayer) {
                        var conn_4 = exports.playerConnections.get(targetPlayer.id);
                        var auth_4 = exports.playerAuth.get(targetPlayer.id);
                        var sqlInsert = "INSERT INTO mutes (name, time, reason, muted_by, conn, auth) VALUES (?, ?, ?, ?, ?, ?)";
                        var valuesInsert = [targetPlayer.name, muteEndTimeFormatted, reason, player.name, conn_4, auth_4];
                        dbConnection_1.con.query(sqlInsert, valuesInsert, function (err, result) {
                            if (err)
                                throw err;
                            room.sendAnnouncement("\uD83E\uDE78 ".concat(targetPlayer.name, " mutado com sucesso!"), null, 0xFFA500, "bold");
                            isMuted[targetPlayer.id] = true;
                        });
                    }
                    else {
                        room.sendAnnouncement("🩸 Jogador não encontrado.", null, 0xFF0000, "bold", 2);
                    }
                });
            }
            else if (words_1[0] === "!clearmutes") {
                var sql = "SELECT * FROM players WHERE LOWER(name) = LOWER(?)";
                var values = [player.name];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length === 0 || !loggedInPlayers[player.id] || !(result[0].ceo || result[0].gerente || result[0].admin || result[0].mod)) {
                        room.sendAnnouncement("🩸 Você não tem autorização para usar este comando!", player.id, 0xFF0000, "bold", 2);
                        return;
                    }
                    // Execute o comando para limpar a tabela de mutes
                    dbConnection_1.con.query("DELETE FROM mutes", function (err, result) {
                        if (err)
                            throw err;
                        room.sendAnnouncement("\uD83E\uDE78 Todos os mutes foram limpos com sucesso!", null, 0xFFA500, "bold");
                    });
                });
            }
            else if (words_1[0] === "!clearbans") {
                var sql = "SELECT * FROM players WHERE LOWER(name) = LOWER(?)";
                var values = [player.name];
                dbConnection_1.con.query(sql, values, function (err, result) {
                    if (err)
                        throw err;
                    if (result.length === 0 || !loggedInPlayers[player.id] || !(result[0].ceo || result[0].gerente || result[0].admin || result[0].mod)) {
                        room.sendAnnouncement("🩸 Você não tem autorização para usar este comando!", player.id, 0xFF0000, "bold", 2);
                        return;
                    }
                    // Executa o comando para limpar a tabela de bans
                    dbConnection_1.con.query("DELETE FROM bans", function (err, result) {
                        if (err)
                            throw err;
                        room.sendAnnouncement("\uD83E\uDE78 Todos os bans foram limpos com sucesso!", player.id, 0xFFA500, "bold");
                    });
                });
            }
            //APOSTAR
            if (words_1[0] === "!bet" || words_1[0] === "!apostar") {
                console.log(`Comando de aposta recebido de ${player.name}`);
            
                var betTarget_1 = words_1[1];
                var betValue_1 = parseInt(words_1[2]);
                var betGoals_1 = parseInt(words_1[3]);
            
                var betType_1;
                var betOn_1;
                if (betTarget_1 === "red" || betTarget_1 === "blue") {
                    betType_1 = "team";
                    betOn_1 = betTarget_1;
                    betGoals_1 = null; // Ignora o número de gols para apostas em times
                } else {
                    betType_1 = "player";
                    betOn_1 = betTarget_1.slice(1); // Remove o '@' do início do nome do jogador
                }
            
                dbConnection_1.con.query("SELECT id, balance FROM players WHERE name = ?", [player.name], function (err, result) {
                    if (err) throw err;
            
                    if (result.length === 0) {
                        console.log(`Jogador ${player.name} não está registrado`);
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA precisa registrar para poder apostar."), player.id, 0xFF0000, "bold", 2);
                        return false;
                    }
            
                    var playerId = result[0].id;
                    var playerBalance = result[0].balance;
            
                    // Verifica se o jogador tem saldo suficiente para apostar
                    if (playerBalance < betValue_1) {
                        console.log(`Jogador ${player.name} não tem saldo suficiente para apostar`);
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA n\u00E3o tem dinheiro suficiente para apostar."), player.id, 0xFF0000, "bold", 2);
                        return false;
                    }
            
                    // Deduz o valor da aposta do saldo do jogador
                    dbConnection_1.con.query("UPDATE players SET balance = balance - ? WHERE id = ?", [betValue_1, playerId], function (err) {
                        if (err) throw err;
            
                        // Adiciona a aposta à tabela de apostas
                        var query;
                        var params;
                        if (betType_1 === "team") {
                            query = "INSERT INTO betteam (player_id, value, room_id, team) VALUES (?, ?, ?, ?)";
                            params = [playerId, betValue_1, process.env.room_id, betOn_1];
                        } else {
                            query = "INSERT INTO betplayer (player_id, value, room_id, bet_type, bet_on, goals) VALUES (?, ?, ?, ?, ?, ?)";
                            params = [playerId, betValue_1, process.env.room_id, betType_1, betOn_1, betGoals_1];
                        }
            
                        dbConnection_1.con.query(query, params, function (err) {
                            if (err) throw err;
            
                            var announcement = betType_1 === "team"
                                ? "\uD83D\uDCB0 ".concat(player.name, " voc\u00EA apostou ").concat(betValue_1, " atacoins no time ").concat(betTarget_1.toUpperCase())
                                : "\uD83D\uDCB0 ".concat(player.name, " voc\u00EA apostou ").concat(betValue_1, " atacoins que o jogador ").concat(betOn_1, " vai marcar ").concat(betGoals_1, " gol(s)");
            
                            console.log(announcement);
                            room.sendAnnouncement(announcement, player.id, 0x00FF00, "bold", 2);
                        });
                    });
                });
            
                return false;
            }
                                     
            //DOAÇÃO
            if (words_1[0] === "!doarcoins") {
                if (!words_1[1] || !words_1[2] || isNaN(parseInt(words_1[1].substring(1), 10)) || isNaN(parseInt(words_1[2], 10))) {
                    room.sendAnnouncement("\uD83E\uDE78 Use: !doarcoins [#ID] [quantidade]. Exemplo: !doarcoins #2 50", player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                var recipient_id = parseInt(words_1[1].substring(1), 10); // Aqui usamos substring(1) para remover o '#'
                var amount_1 = parseInt(words_1[2], 10);
                if (amount_1 < 50 || amount_1 > 1000) {
                    room.sendAnnouncement("\uD83D\uDCB0 ".concat(player.name, ", a quantidade de atacoins para doa\u00E7\u00E3o deve ser entre 50 e 1000."), player.id, 0x10F200, "bold", 2);
                    return false;
                }
                var recipient_1 = room.getPlayer(recipient_id);
                if (!recipient_1) {
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, ", o ID do jogador que voc\u00EA forneceu n\u00E3o \u00E9 v\u00E1lido."), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                if (recipient_1.id === player.id) {
                    room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, ", voc\u00EA n\u00E3o pode doar atacoins para si mesmo."), player.id, 0xFF0000, "bold", 2);
                    return false;
                }
                var currentTime_1 = Date.now();
                dbConnection_1.con.query("SELECT balance, last_donation_time FROM players WHERE name = ?", [player.name], function (err, result) {
                    if (err) {
                        room.sendAnnouncement("Erro ao acessar o banco de dados. Tente novamente mais tarde.", player.id, 0xFF0000, "bold", 2);
                        throw err;
                    }
                    if (result.length === 0) {
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, ", voc\u00EA precisa se registrar para doar atacoins."), player.id, 0xFF0000, "bold", 2);
                        return false;
                    }
                    var playerBalance = result[0].balance;
                    var lastDonationTime = result[0].last_donation_time;
                    var timeSinceLastDonation = currentTime_1 - lastDonationTime;
                    if (timeSinceLastDonation >= 5 * 60 * 1000) {
                        if (playerBalance < 50) {
                            room.sendAnnouncement("\uD83D\uDCB0 ".concat(player.name, ", voc\u00EA precisa ter pelo menos 50 atacoins para fazer uma doa\u00E7\u00E3o."), player.id, 0x10F200, "bold", 2);
                            return false;
                        }
                        else if (playerBalance < amount_1) {
                            room.sendAnnouncement("\uD83D\uDCB0 ".concat(player.name, ", voc\u00EA n\u00E3o tem atacoins suficientes para doar."), player.id, 0x10F200, "bold", 2);
                            return false;
                        }
                        dbConnection_1.con.query("UPDATE players SET balance = balance - ?, last_donation_time = ? WHERE name = ?", [amount_1, currentTime_1, player.name], function (err) {
                            if (err) {
                                room.sendAnnouncement("Erro ao atualizar o saldo. Tente novamente mais tarde.", player.id, 0xFF0000, "bold", 2);
                                throw err;
                            }
                            dbConnection_1.con.query("UPDATE players SET balance = balance + ? WHERE name = ?", [amount_1, recipient_1.name], function (err) {
                                if (err) {
                                    room.sendAnnouncement("Erro ao atualizar o saldo do destinat\u00E1rio. Tente novamente mais tarde.", player.id, 0xFF0000, "bold", 2);
                                    throw err;
                                }
                                room.sendAnnouncement("\uD83D\uDCB0 ".concat(player.name, ", voc\u00EA doou ").concat(amount_1, " atacoins para ").concat(recipient_1.name, "."), player.id, 0x10F200, "bold", 2);
                                room.sendAnnouncement("\uD83D\uDCB0 ".concat(recipient_1.name, ", voc\u00EA recebeu ").concat(amount_1, " atacoins de ").concat(player.name, "."), recipient_1.id, 0x10F200, "bold", 2);
                            });
                        });
                    }
                    else {
                        var remainingTime = Math.ceil((5 * 60 * 1000 - timeSinceLastDonation) / 60000);
                        room.sendAnnouncement("\uD83D\uDD52 ".concat(player.name, ", voc\u00EA precisa esperar ").concat(remainingTime, " minutos para fazer outra doa\u00E7\u00E3o."), player.id, 0xFF0000, "bold", 2);
                    }
                });
            }
            //LOJA
            if (words_1[0] === "!loja") {
                var input = words_1;
                var action = input[1];
                var itemNumber = parseInt(input[2]); // Convert to integer
                var userId = player.id;
                var userName = player.name;
                var storeItems = {
                    1: { name: 'VIP', cost: 150000 },
                    2: { name: 'PREMIUM', cost: 250000 },
                    3: { name: 'LEGEND', cost: 300000 }
                };
                if (action === 'comprar' && !isNaN(itemNumber)) {
                    var item = storeItems[itemNumber];
                    if (item) {
                        dbConnection_1.con.query("SELECT balance FROM players WHERE name = ?", [userName], function (err, result) {
                            if (err) {
                                console.error(err);
                                room.sendAnnouncement("\uD83E\uDE78 Desculpe ".concat(userName, ", ocorreu um erro ao verificar seu saldo."), userId, 0xFF0000, "bold", 2);
                                return;
                            }
                            if (result[0]) {
                                if (result[0].balance >= item.cost) {
                                    dbConnection_1.con.query("UPDATE players SET balance = balance - ?, vip = ? WHERE name = ?", [item.cost, itemNumber, userName], function (err, result) {
                                        if (err) {
                                            console.error(err);
                                            room.sendAnnouncement("\uD83E\uDE78 Desculpe ".concat(userName, ", ocorreu um erro ao atualizar seu saldo e status VIP."), userId, 0xFF0000, "bold", 2);
                                            return;
                                        }
                                        if (result.affectedRows > 0) {
                                            room.sendAnnouncement("\uD83C\uDF89 ".concat(userName, " acabou de comprar o cargo \"").concat(item.name, "\" na loja!"), null, 0xFFA500, "bold", 2);
                                            room.sendAnnouncement("\uD83E\uDE78 Para atualizar sua nova tag, por favor, saia e entre na sala novamente.", userId, 0xFF0000, "bold", 2);
                                        }
                                        else {
                                            return false;
                                        }
                                    });
                                }
                                else {
                                    room.sendAnnouncement("\uD83E\uDE78 Desculpe ".concat(userName, ", voc\u00EA n\u00E3o tem atacoins suficientes para comprar este item."), userId, 0xFF0000, "bold", 2);
                                }
                            }
                            else {
                                room.sendAnnouncement("\uD83E\uDE78 Desculpe ".concat(userName, ", n\u00E3o foi poss\u00EDvel encontrar suas informa\u00E7\u00F5es de jogador."), userId, 0xFF0000, "bold", 2);
                            }
                        });
                    }
                    else {
                        room.sendAnnouncement("\uD83E\uDE78 Desculpe ".concat(userName, ", este item n\u00E3o est\u00E1 dispon\u00EDvel na loja."), userId, 0xFF0000, "bold", 2);
                    }
                }
                else {
                    var storeMessage = '🛒 Loja de Itens: ';
                    for (var i in storeItems) {
                        storeMessage += "".concat(i, ". ").concat(storeItems[i].name, " - ").concat(storeItems[i].cost, " atacoins, ");
                    }
                    // Remove the trailing comma and space
                    storeMessage = storeMessage.slice(0, -2);
                    room.sendAnnouncement(storeMessage, userId, 0xFFFFFF, "bold", 2);
                    room.sendAnnouncement("\uD83D\uDCB0 Para comprar um item, digite \"!loja comprar <n\u00FAmero do item>\".", userId, 0xFF0000, "bold", 2);
                }
            }
            //SALDO
            else if (words_1[0] === "!meusaldo" || words_1[0] === "!saldo") {
                dbConnection_1.con.query("SELECT balance FROM players WHERE name = ?", [player.name], function (err, result) {
                    if (err)
                        throw err;
                    if (result.length === 0) {
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA precisa se registrar para ter um saldo."), player.id, 0xFF0000, "bold", 2);
                        return false;
                    }
                    var playerBalance = result[0].balance;
                    room.sendAnnouncement("\uD83D\uDCB0 ".concat(player.name, ", seu saldo \u00E9 de ").concat(playerBalance, " atacoins."), player.id, 0x10F200, "bold", 2);
                });
                return false;
            }
            else if (words_1[0] == "!provocacoes" || words_1[0] === "!provos" || words_1[0] === "!prov") {
                room.sendAnnouncement('Provocações: !oe, !izi, !red, !blue, !paired, !paiblue, !ifood, !chora, !bolso, !divisao, !seupai, !pega, !quentin, !arn, !cag, !dmr, !fran, !furo, !grl, !ini', player.id, 0xFFFFFF, "bold");
            }
            // ---------- PROVOCAÇÕES ------------//
            else if (words_1[0] === "!arn") {
                room.sendAnnouncement("".concat(player.name, " provocou: Pode isso, Arnaldo? \uD83E\uDD14"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!cag") {
                room.sendAnnouncement("".concat(player.name, " provocou: Cagada \uD83D\uDCA9"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!dmr") {
                room.sendAnnouncement("".concat(player.name, " provocou: Demora mais!!! \uD83D\uDE44"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!fran") {
                room.sendAnnouncement("".concat(player.name, " provocou: Frango! \uD83D\uDC14"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!furo") {
                room.sendAnnouncement("".concat(player.name, " provocou: Mustela putorius furo, o Fur\u00E3o! \uD83E\uDDA6"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!grl") {
                room.sendAnnouncement("".concat(player.name, " provocou: Gorila \u00E9 sinistro \uD83E\uDD8D"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!ini") {
                room.sendAnnouncement("".concat(player.name, " provocou: Inimigo do gol! \uD83D\uDC79"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!oe") {
                room.sendAnnouncement("".concat(player.name, " provocou: OEEE! Virou Space Bounce! \uD83D\uDE05\uD83D\uDE05"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!red") {
                room.sendAnnouncement("".concat(player.name, " provocou: Esse era o RED?"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!blue") {
                room.sendAnnouncement("".concat(player.name, " provocou: Esse era o BLUE?"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!divisao") {
                room.sendAnnouncement("".concat(player.name, " provocou: EU SOU O PROBLEMA DA DIVIS\u00C3O!!!"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!paired") {
                room.sendAnnouncement("".concat(player.name, " provocou: EU = PAI DO RED\uD835\uDDDE\uD835\uDDDE\uD835\uDDDE\uD835\uDDDE\uD835\uDDDE\uD835\uDDDE\uD83E\uDD23\uD83D\uDE02\uD83E\uDD23\uD83D\uDE02"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!paiblue") {
                room.sendAnnouncement("".concat(player.name, " provocou: EU = PAI DO BLUE\uD835\uDDDE\uD835\uDDDE\uD835\uDDDE\uD835\uDDDE\uD835\uDDDE\uD835\uDDDE\uD83E\uDD23\uD83D\uDE02\uD83E\uDD23\uD83D\uDE02"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!ifood") {
                room.sendAnnouncement("".concat(player.name, " provocou: Olha o ifood! foi aqui que pediram a entrega?"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!chora") {
                room.sendAnnouncement("".concat(player.name, " provocou: CHORA N\u00C3O BEB\u00CA, SE QUISER CHORAR VAI PRA MATERNIDADE\u2757\uD83D\uDC76\uD83C\uDFFC\uD83C\uDF7C"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!bolso") {
                room.sendAnnouncement("".concat(player.name, " provocou: Sai do meu bolso ai, ta incomodando."), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!seupai") {
                room.sendAnnouncement("".concat(player.name, " provocou: Chora n\u00E3o!!!! Ja pode me registrar como seu pai."), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!pega") {
                room.sendAnnouncement("".concat(player.name, " provocou: QUERO VER PEGAR ESSA PORRA!!!"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!izi") {
                room.sendAnnouncement("".concat(player.name, " provocou: TEM COMO AUMENTAR O N\u00CDVEL? T\u00C1 MUITO EASY!"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!quentin") {
                room.sendAnnouncement("".concat(player.name, " provocou: T\u00C1 QUENTINHO A\u00CD? MEU BOLSO \u00C9 DE VELUDO!"), null, 0x39E63C, "bold");
            }
            else if (words_1[0] === "!prev") {
                // Definir redTeam e blueTeam
                var redTeam = activePlayers.filter(function (p) { return p.team === 1; });
                var blueTeam = activePlayers.filter(function (p) { return p.team === 2; });
                // Jogadores insuficientes para previsão
                if ((redTeam.length === 0 || redTeam.length === 1) && blueTeam.length === 0) {
                    room.sendAnnouncement("\uD83E\uDE78 N\u00E3o h\u00E1 jogadores suficientes para gerar uma previs\u00E3o.", player.id, 0xFF0000, "bold", 2);
                }
                // Previsão de vitória
                if (redTeam.length >= 1 && blueTeam.length >= 1) {
                    var team1EloNum = Number(team1Elo);
                    var team2EloNum = Number(team2Elo);
                    var totalElo = team1EloNum + team2EloNum;
                    var team1Chance = (team1EloNum / totalElo) * 100;
                    var team2Chance = (team2EloNum / totalElo) * 100;
                    room.sendAnnouncement("\uD83D\uDCCA Previs\u00E3o de Vit\u00F3ria: \uD83D\uDD34 ".concat(team1Chance.toFixed(2), "% chance de vencer contra \uD83D\uDD35 ").concat(team2Chance.toFixed(2), "% chance de vencer."), player.id, 0xFFFFFF, "bold");
                }
                // Comando help
            }
            else if (words_1[0] === "!help" || words_1[0] === "!ajuda" || words_1[0] === "!comandos" || words_1[0] === "!commands") {
                if (words_1.length === 1) {
                    var commands = ["!mudarsenha", "!afk", "!listafks", "!discord", "!stats", "t", "!sequencia", "!topsequencia", "!prev", "#", "!uniformes", "!jogos", "!vitorias", "!gols", "!cs", "!assists", "!ricos", "!golscontra", "!provos", "!apostar", "!doarcoins", "!loja", "!saldo"];
                    var adminCommands = ["!ban", "!mute", "!rr2", "!setvip <1, 2 ou 3>", "!setadmin <1, 2, 3 ou 4>"];
                    room.sendAnnouncement("\uD83D\uDCC3 Comandos: ".concat(commands.join(", ")), player.id, 0xFF0000, "bold");
                    if (superadmin[player.id] === 1 || gerentes[player.id] === 1 || admins[player.id] === 1 || mods[player.id] === 1) {
                        room.sendAnnouncement("\uD83D\uDEA7 Comandos Staff: ".concat(adminCommands.join(", ")), player.id, 0xFFA500, "bold");
                    }
                }
                else {
                    // Exibe explicação de comando
                    var command = words_1[1];
                    if (commandExplanations.hasOwnProperty(command)) {
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(command, ": ").concat(commandExplanations[command]), player.id, 0xFFFFFF, "bold");
                    }
                    else {
                        room.sendAnnouncement("\uD83E\uDE78 Comando \"".concat(command, "\" n\u00E3o encontrado."), player.id, 0xFF0000, "bold", 2);
                    }
                }
            }
            else {
                //room.sendAnnouncement(`🩸 ${player.name} esse comando não existe, digite !help para ver a lista de comandos disponíveis.`, player.id, 0xFF0000, "bold", 2);
            }
            return false; // Não enviar comandos para o chat geral.
        }
        var words = message.split(" ");
        if (exports.teamR.length != 0 && exports.teamB.length != 0 && inChooseMode) { //choosing management
            if (player.id == exports.teamR[0].id || player.id == exports.teamB[0].id) { // we care if it's one of the captains choosing
                if (exports.teamR.length <= exports.teamB.length && player.id == exports.teamR[0].id) { // we care if it's red turn && red cap talking
                    if (["top", "auto"].includes(words[0].toLowerCase())) {
                        room.setPlayerTeam(exports.teamS[0].id, Team.RED);
                        redCaptainChoice = "top";
                        clearTimeout(timeOutCap);
                        room.sendAnnouncement(player.name + " escolheu Top!", null, 0xFF0000, 'bold');
                        return false;
                    }
                    else if (["random", "rand"].includes(words[0].toLowerCase())) {
                        var r = getRandomInt(exports.teamS.length);
                        room.setPlayerTeam(exports.teamS[r].id, Team.RED);
                        redCaptainChoice = "random";
                        clearTimeout(timeOutCap);
                        room.sendAnnouncement(player.name + " escolheu Random!", null, 0xFF0000, 'bold');
                        return false;
                    }
                    else if (["bottom", "bot"].includes(words[0].toLowerCase())) {
                        room.setPlayerTeam(exports.teamS[exports.teamS.length - 1].id, Team.RED);
                        redCaptainChoice = "bottom";
                        clearTimeout(timeOutCap);
                        room.sendAnnouncement(player.name + " escolheu Bottom!", null, 0xFF0000, 'bold');
                        return false;
                    }
                    else if (!Number.isNaN(Number.parseInt(words[0]))) {
                        if (Number.parseInt(words[0]) > exports.teamS.length || Number.parseInt(words[0]) < 1) {
                            room.sendAnnouncement("O número que escolheu é inválido!", player.id, 0xFF0000, 'bold');
                            return false;
                        }
                        else {
                            room.setPlayerTeam(exports.teamS[Number.parseInt(words[0]) - 1].id, Team.RED);
                            room.sendAnnouncement(player.name + " escolheu " + exports.teamS[Number.parseInt(words[0]) - 1].name + "!", null, 0xFF0000, 'bold');
                            return false;
                        }
                    }
                }
                if (exports.teamR.length > exports.teamB.length && player.id == exports.teamB[0].id) { // we care if it's red turn && red cap talking
                    if (["top", "auto"].includes(words[0].toLowerCase())) {
                        room.setPlayerTeam(exports.teamS[0].id, Team.BLUE);
                        blueCaptainChoice = "top";
                        clearTimeout(timeOutCap);
                        room.sendAnnouncement(player.name + " escolheu Top!", null, 0xFF0000, 'bold');
                        return false;
                    }
                    else if (["random", "rand"].includes(words[0].toLowerCase())) {
                        room.setPlayerTeam(exports.teamS[getRandomInt(exports.teamS.length)].id, Team.BLUE);
                        blueCaptainChoice = "random";
                        clearTimeout(timeOutCap);
                        room.sendAnnouncement(player.name + " escolheu Random!", null, 0xFF0000, 'bold');
                        return false;
                    }
                    else if (["bottom", "bot"].includes(words[0].toLowerCase())) {
                        room.setPlayerTeam(exports.teamS[exports.teamS.length - 1].id, Team.BLUE);
                        blueCaptainChoice = "bottom";
                        clearTimeout(timeOutCap);
                        room.sendAnnouncement(player.name + " escolheu Bottom!", null, 0xFF0000, 'bold');
                        return false;
                    }
                    else if (!Number.isNaN(Number.parseInt(words[0]))) {
                        if (Number.parseInt(words[0]) > exports.teamS.length || Number.parseInt(words[0]) < 1) {
                            room.sendAnnouncement("O número que escolheu é inválido!", player.id, 0xFF0000, 'bold');
                            return false;
                        }
                        else {
                            room.setPlayerTeam(exports.teamS[Number.parseInt(words[0]) - 1].id, Team.BLUE);
                            room.sendAnnouncement(player.name + " escolheu " + exports.teamS[Number.parseInt(words[0]) - 1].name + "!", null, 0xFF0000, 'bold');
                            return false;
                        }
                    }
                }
            }
        }
        // Definir a constante para os chats de equipe/staff.
        // Chat Privado
        if (message.startsWith("#")) {
            var player_id = parseInt(message.substring(1), 10);
            var recipient = room.getPlayer(player_id);
            // O usuário está mute
            if (isMuted[player.id] === true) {
                room.sendAnnouncement("\uD83E\uDE78 Voc\u00EA n\u00E3o pode enviar mensagens privadas, aguarde o tempo de mute acabar.", player.id, 0xFF0000, "bold", 2); // Enviar aviso.
                return false;
                // Usuário não está logado.
            }
            else if (!loggedInPlayers[player.id] === true) {
                room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " voc\u00EA precisa fazer login para enviar mensagens."), player.id, 0xFF0000, "bold", 2);
                return false;
                // ID não inserida.
            }
            else if (!player_id || isNaN(player_id)) {
                room.sendAnnouncement("\uD83E\uDE78 Voc\u00EA n\u00E3o digitou o ID, para enviar uma msg privada digite #ID <mensagem>", player.id, 0xff0000, "bold", 2);
                return false;
                // ID não está associada a nenhum jogador.
            }
            else if (!recipient) {
                room.sendAnnouncement("\uD83E\uDE78 A ID inserida n\u00E3o est\u00E1 associada a nenhum jogador!", player.id, 0xFF0000, "bold", 2);
                return false;
                // Não permitir enviar mensagem a si mesmo.
            }
            else if (recipient.id === player.id) {
                room.sendAnnouncement("🩸 Você não pode enviar mensagens para você mesmo!", player.id, 0xFF0000, "bold", 2);
                return false;
                // Tudo bate certo, enviar a DM.
            }
            else if (recipient) {
                var sender = player.name;
                var formatted_message = "[\uD83D\uDCE9 DM de ".concat(sender, "]: ").concat(message.substring(message.indexOf(" ") + 1));
                // Mensagem que o jogador que envia recebe
                room.sendAnnouncement("[\u2709\uFE0F DM Enviada para ".concat(recipient.name, "]: ").concat(message.substring(message.indexOf(" ") + 1)), player.id, 0xFFFF00, "bold", 1);
                // Mensagem que o jogador para quem a mensagem foi enviada recebe
                room.sendAnnouncement(formatted_message, recipient.id, 0xFFFF00, "bold", 2);
                return false;
            }
        }
        // Chat staff
        if (words[0] === ".") {
            if (!loggedInPlayers[player.id] === true) {
                room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA precisa fazer login para enviar mensagens."), player.id, 0xFF0000, "bold", 2);
                return false;
                // É um staff = sim
            }
            else if (superadmin[player.id] === 1 || gerentes[player.id] === 1 || admins[player.id] === 1 || mods[player.id] === 1) {
                // Sacar a mensagem
                var message_1 = words.slice(1).join(" ");
                // Atualizar quem está na staff
                var playersInStaff = room.getPlayerList().filter(function (p) { return superadmin[p.id] || gerentes[p.id] || admins[p.id] || mods[p.id] === 1 && loggedInPlayers[player.id] === true; });
                for (var index = 0; index < playersInStaff.length; index++) {
                    var p = playersInStaff[index];
                    // Enviar a mensagem para todos os usuários da staff.
                    room.sendAnnouncement("[Chat Staff] ".concat(player.name, ": ").concat(message_1), p.id, 0xFFB515, "bold");
                }
                return false; // Não enviar mensagem normal.
                // Se não for staff.
            }
            else {
                room.sendAnnouncement("🩸 Você não tem permissão para usar esse comando!", player.id, 0xFF0000, "bold", 2);
                return false; // Não enviar mensagem normal.
            }
        }
        // Chat de equipe
        if (words[0] === "t") {
            // Checkar se o usuário está na Equipe 1 ou 2 ou se está mute.
            // O usuário está mute
            if (isMuted[player.id] === true) {
                room.sendAnnouncement("\uD83E\uDE78 Voc\u00EA n\u00E3o pode falar no chat da equipe, aguarde o tempo de mute acabar.", player.id, 0xFF0000, "bold", 2); // Enviar aviso.
                return false; // Não enviar msg.
            } /* else if (!loggedInPlayers[player.id] === true) {
                room.sendAnnouncement(`🩸 ${player.name} Você precisa fazer login para enviar mensagens.`, player.id, 0xFF0000, "bold", 2);
                return false;
                // Equipe Red
            } */
            else if (player.team === 1) {
                // Sacar a mensagem
                var message_2 = words.slice(1).join(" ");
                // Atualizar quem está na equipe RED
                for (var index = 0; index < room.getPlayerList().filter(function (p) { return p.team == 1; }).length; index++)
                    if (superadmin[player.id] === 1) {
                        room.sendAnnouncement("[Equipe Red] ".concat(CeoTag, " ").concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_2), room.getPlayerList().filter(function (p) { return p.team == 1; })[index].id, 0xE56E56, "bold");
                    }
                    else if (gerentes[player.id] === 1) {
                        room.sendAnnouncement("[Equipe Red] ".concat(gerentesTag, " ").concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_2), room.getPlayerList().filter(function (p) { return p.team == 1; })[index].id, 0xE56E56, "bold");
                    }
                    else if (admins[player.id] === 1) {
                        room.sendAnnouncement("[Equipe Red] ".concat(adminsTag, " ").concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_2), room.getPlayerList().filter(function (p) { return p.team == 1; })[index].id, 0xE56E56, "bold");
                    }
                    else if (mods[player.id] === 1) {
                        room.sendAnnouncement("[Equipe Red] ".concat(modsTag, " ").concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_2), room.getPlayerList().filter(function (p) { return p.team == 1; })[index].id, 0xE56E56, "bold");
                    }
                    else {
                        room.sendAnnouncement("[Equipe Red] ".concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_2), room.getPlayerList().filter(function (p) { return p.team == 1; })[index].id, 0xE56E56, "bold");
                    }
                // Sistema normal
                //room.sendAnnouncement(`[Equipe Red] ${player.name}: ${message}`, room.getPlayerList().filter((p: { team: number; }) => p.team == 1)[index].id, 0xE56E56, "bold");
                return false; // Não enviar mensagem normal.
                // Equipe Blue
            }
            else if (player.team === 2) {
                // Sacar a mensagem
                var message_3 = words.slice(1).join(" ");
                // Atualizar quem está na equipe BLUE
                for (var index = 0; index < room.getPlayerList().filter(function (p) { return p.team == 2; }).length; index++)
                    if (superadmin[player.id] === 1) {
                        room.sendAnnouncement("[Equipe Blue] ".concat(CeoTag, " ").concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_3), room.getPlayerList().filter(function (p) { return p.team == 2; })[index].id, 0x5689E5, "bold");
                    }
                    else if (gerentes[player.id] === 1) {
                        room.sendAnnouncement("[Equipe Blue] ".concat(gerentesTag, " ").concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_3), room.getPlayerList().filter(function (p) { return p.team == 2; })[index].id, 0x5689E5, "bold");
                    }
                    else if (admins[player.id] === 1) {
                        room.sendAnnouncement("[Equipe Blue] ".concat(adminsTag, " ").concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_3), room.getPlayerList().filter(function (p) { return p.team == 2; })[index].id, 0x5689E5, "bold");
                    }
                    else if (mods[player.id] === 1) {
                        room.sendAnnouncement("[Equipe Blue] ".concat(modsTag, " ").concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_3), room.getPlayerList().filter(function (p) { return p.team == 2; })[index].id, 0x5689E5, "bold");
                    }
                    else {
                        room.sendAnnouncement("[Equipe Blue] ".concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_3), room.getPlayerList().filter(function (p) { return p.team == 2; })[index].id, 0x5689E5, "bold");
                    }
                // Enviar a mensagem para todos os usuários da equipe do jogador que enviou a mensagem.
                //room.sendAnnouncement(`[Equipe Blue] ${player.name}: ${message}`, room.getPlayerList().filter((p: { team: number; }) => p.team == 2)[index].id, 0x5689E5, "bold");
                return false; // Não enviar mensagem normal.
                // Equipe Spectators
            }
            else if (player.team === 0) {
                // Sacar a mensagem
                var message_4 = words.slice(1).join(" ");
                // Atualizar quem está na equipe SPECTATORS
                for (var index = 0; index < room.getPlayerList().filter(function (p) { return p.team == 0; }).length; index++)
                    if (superadmin[player.id] === 1) {
                        room.sendAnnouncement("[Espectador] ".concat(CeoTag, " ").concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_4), room.getPlayerList().filter(function (p) { return p.team == 0; })[index].id, 0xF5F5F5, "bold");
                    }
                    else if (gerentes[player.id] === 1) {
                        room.sendAnnouncement("[Espectador] ".concat(gerentesTag, " ").concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_4), room.getPlayerList().filter(function (p) { return p.team == 0; })[index].id, 0xF5F5F5, "bold");
                    }
                    else if (admins[player.id] === 1) {
                        room.sendAnnouncement("[Espectador] ".concat(adminsTag, " ").concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_4), room.getPlayerList().filter(function (p) { return p.team == 0; })[index].id, 0xF5F5F5, "bold");
                    }
                    else if (mods[player.id] === 1) {
                        room.sendAnnouncement("[Espectador] ".concat(modsTag, " ").concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_4), room.getPlayerList().filter(function (p) { return p.team == 0; })[index].id, 0xF5F5F5, "bold");
                    }
                    else {
                        room.sendAnnouncement("[Espectador] ".concat(rankTag[player.id], " ").concat(player.name, ": ").concat(message_4), room.getPlayerList().filter(function (p) { return p.team == 0; })[index].id, 0xF5F5F5, "bold");
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
        var conn = exports.playerConnections.get(player.id);
        var auth = exports.playerAuth.get(player.id);
        dbConnection_1.con.query("SELECT * FROM mutes WHERE name = ? OR conn = ? OR auth = ?", [player.name, conn, auth], function (err, result) {
            if (err)
                throw err;
            if (result.length > 0) {
                for (var _i = 0, result_3 = result; _i < result_3.length; _i++) {
                    var mute = result_3[_i];
                    // Reduzir tamanho da data.
                    var muteEndTime = new Date(mute.time);
                    var formattedMuteEndTime = muteEndTime.toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                    });
                    var now = Date.now();
                    if (now < new Date(muteEndTime).getTime()) {
                        isMuted[player.id] = true;
                        room.sendAnnouncement("\uD83E\uDE78 ".concat(player.name, " Voc\u00EA est\u00E1 mutado at\u00E9 ").concat(formattedMuteEndTime, ", motivo: ").concat(result[0].reason, "."), player.id, 0xFF0000, "bold", 2);
                    }
                    else {
                        isMuted[player.id] = false;
                        room.sendChat(message);
                    }
                }
            }
        });
        // Se tiver mutado, não enviar mensagem.
        if (!isMuted[player.id] === false)
            return false;
        // Cor do chat.
        var staffTag = "";
        var staffColor = "";
        var staffFont = "";
        var userColor = "";
        var userFont = "";
        var userLogged = "";
        // room.sendAnnouncement(`${confirm.includes(player.id) ? "[✔️]" : "[❌]"}${tirouTagRank.includes(player.id) ? '' : rankTag} ${tirouTagVip.includes(player.id) ? '' : vipTag} ${player.name}: ${message}`, null, cordochat[player.name] ? '0x' + cordochat[player.name] : (corChat != "" ? '0x' + corChat : 0xE0E0E0), fonte != "" ? fonte : null, 1);
        if (superadmin[player.id] === 1) {
            staffTag = CeoTag;
            staffColor = config.cargos_cores.ceo;
            staffFont = "bold";
        }
        else if (gerentes[player.id] === 1) {
            staffTag = gerentesTag;
            staffColor = config.cargos_cores.gerente;
            staffFont = "bold";
        }
        else if (admins[player.id] === 1) {
            staffTag = adminsTag;
            staffColor = config.cargos_cores.admin;
            staffFont = "bold";
        }
        else if (mods[player.id] === 1) {
            staffTag = modsTag;
            staffColor = config.cargos_cores.mod;
            staffFont = "bold";
        }
        else {
            if (!loggedInPlayers[player.id] === true) {
                userColor = config.cargos_cores.membro;
                userFont = "normal";
                userLogged = "[❌]";
            }
            else {
                userColor = config.cargos_cores.membro;
                userFont = "normal";
                userLogged = "[✅]";
            }
        }
        room.sendAnnouncement("".concat(userLogged, " ").concat(rankTag[player.id]).concat(vips[player.id] === 1 ? " " + vipTag : "").concat(premiums[player.id] === 1 ? " " + premiumTag : "").concat(legends[player.id] === 1 ? " " + legendTag : "").concat(staffTag !== "" ? " " + staffTag : "", " ").concat(player.name, ": ").concat(message), null, staffColor === "" ? userColor : staffColor, staffFont === "" ? userFont : staffFont);
        return false;
    };
    var Goal = {
        assist: null,
        scorer: null,
        reset: function () {
            this.assist = null;
            this.scorer = null;
        },
        setPlayer: function (player) {
            if (this.scorer === null || this.scorer.id != player.id) {
                this.assist = this.scorer;
                this.scorer = player;
            }
        }
    };
    function pointDistance(p1, p2) {
        var d1 = p1.x - p2.x;
        var d2 = p1.y - p2.y;
        return Math.sqrt(d1 * d1 + d2 * d2);
    }
    // Criar função do kickOff
    var kickOff = false;
    room.onGameTick = function () {
        // Kickoff check
        var redTeam = activePlayers.filter(function (p) { return p.team === 1; });
        var blueTeam = activePlayers.filter(function (p) { return p.team === 2; });
        if (redTeam.length >= 1 && blueTeam.length >= 1) {
            if (kickOff == false) {
                if (room.getScores().time != 0) {
                    kickOff = true;
                    // Calcular a chance de vitória.
                    var team1EloNum = Number(team1Elo);
                    var team2EloNum = Number(team2Elo);
                    var totalElo = team1EloNum + team2EloNum;
                    var team1Chance = (team1EloNum / totalElo) * 100;
                    var team2Chance = (team2EloNum / totalElo) * 100;
                    room.sendAnnouncement("\uD83D\uDCCA Previs\u00E3o de Vit\u00F3ria: \uD83D\uDD34 ".concat(team1Chance.toFixed(2), "% chance de vencer contra \uD83D\uDD35 ").concat(team2Chance.toFixed(2), "% chance de vencer."), null, 0xFFFFFF, "bold", 0);
                    if (redTeam.length >= 2 && blueTeam.length >= 2) {
                        gk = isGk();
                        // Enviar a mensagem apenas para os jogadores em campo
                        var playersGaming = room.getPlayerList().filter(function (p) { return p.team > 0; });
                        for (var _i = 0, playersGaming_1 = playersGaming; _i < playersGaming_1.length; _i++) {
                            var player_2 = playersGaming_1[_i];
                            if (player_2.team === 1) { // Jogador da equipe vermelha
                                room.sendAnnouncement("🔴 GK do red: " + gk[0].name + ", se for necessário trocar digite !gk", player_2.id, 0xFFFFFF, "bold", 0);
                            }
                            else if (player_2.team === 2) { // Jogador da equipe azul
                                room.sendAnnouncement("🔵 GK do blue: " + gk[1].name + ", se for necessário trocar digite !gk", player_2.id, 0xFFFFFF, "bold", 0);
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
    };
    function isGk() {
        var players = room.getPlayerList();
        if (!players.length)
            return []; // Retorna vazio caso não haja jogadores
        // Inicialize min e max com base no primeiro jogador com uma posição definida.
        var min = players.find(function (p) { return p.position !== null; });
        var max = min;
        if (!min)
            return []; // Retorna vazio se não houver posições de jogadores definidas.
        players.forEach(function (player) {
            if (player.position !== null) {
                if (player.position.x < min.position.x)
                    min = player;
                if (player.position.x > max.position.x)
                    max = player;
            }
        });
        return [min, max]; // Retorna os jogadores mais à esquerda e à direita
    }
    function handleAssistsAndGoals() {
        var players = room.getPlayerList();
        var ballPosition = room.getBallPosition();
        var ballRadius = 6.4;
        var playerRadius = 15;
        var triggerDistance = ballRadius + playerRadius + 0.01;
        for (var i = 0; i < players.length; i++) {
            var player_3 = players[i];
            if (player_3.position == null)
                continue;
            var distanceToBall = pointDistance(player_3.position, ballPosition);
            if (distanceToBall < triggerDistance) {
                Goal.setPlayer(player_3);
            }
        }
    }
    room.onPlayerBallKick = function (player) {
        Goal.setPlayer(player);
    };
    function updatePlayerStatistic(statName, playerId, value) {
        if (!playerStatistics[playerId]) {
            playerStatistics[playerId] = {
                goals: 0,
                assists: 0,
                ag: 0
            };
        }
        playerStatistics[playerId][statName] += value;
    }
    room.onTeamGoal = function (team) {
        var _a;
        var OG = ((_a = Goal.scorer) === null || _a === void 0 ? void 0 : _a.team) != team; // OG = true if it’s an own goal.
        // Se não for um gol contra, atualize a contagem de gols do jogador
        // Se não for um gol contra, atualize a contagem de gols do jogador
        if (!OG && Goal.scorer !== null) {
            var roomId = process.env.room_id;
            if (roomId) {
                handleGoal(Goal.scorer.name, roomId);
            }
            else {
                console.log('room_id não está definido');
            }
        }
        var activePlayers = room.getPlayerList().filter(function (p) {
            return !afkStatus[p.id];
        });
        // Random celebration message for goals
        var frasesGOL = [
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
        var frasesASS = [
            "E QUEM BOTOU A BOLA NO PÉ DELE FOI O",
            "EU AMO ESSE CARA!",
            "PASSE COM A MÃO DE",
            "Assistência fenomenal de"
        ];
        var golcontra = [
            "TROLA Y TROLLA",
            "Pette faz pior...",
            "Animal demais o",
            "INCRIVEL O QUE ESSA LENDA FAZ, MAS SERIA MELHOR SE FOSSE PARA O OUTRO LADO NÉ",
            "PARABÉNS!! AGORA TENTA DO OUTRO LADO...",
            "ERROU O LADO! RUIM DEMAIS,"
        ];
        var randomPhraseGol = frasesGOL[Math.floor(Math.random() * frasesGOL.length)];
        var randomPhraseAss = frasesASS[Math.floor(Math.random() * frasesASS.length)];
        var randomOwnGoalPhrase = golcontra[Math.floor(Math.random() * golcontra.length)];
        if (activePlayers.length >= 2) {
            var ballSpeed = getBallSpeed();
            var color = team === 1 ? 0xEE3A3A : 0x3385FF; // Red for team 1, blue for team 2
            if (OG && Goal.scorer !== null) {
                updatePlayerStatistic("ag", Goal.scorer.id.toString(), 1);
                room.sendAnnouncement("\u26BD ".concat(randomOwnGoalPhrase, " ").concat(Goal.scorer.name, "!!"), null, color, "bold");
                console.log("".concat(Goal.scorer.name, ", scored an own goal."));
            }
            else if (Goal.scorer !== null) {
                updatePlayerStatistic("goals", Goal.scorer.id.toString(), 1);
                if (Goal.assist !== null && Goal.assist.team == team) {
                    updatePlayerStatistic("assists", Goal.assist.id.toString(), 1);
                    room.sendAnnouncement("\u26BD ".concat(randomPhraseGol, " ").concat(Goal.scorer.name, "!! ").concat(randomPhraseAss, " ").concat(Goal.assist.name, "!"), null, color, "bold");
                    console.log("".concat(Goal.scorer.name, " scored a goal with assistance from ").concat(Goal.assist.name, "."));
                }
                else {
                    room.sendAnnouncement("\u26BD ".concat(randomPhraseGol, " ").concat(Goal.scorer.name, " (").concat(ballSpeed.toPrecision(4).toString(), " km/h)!"), null, color, "bold");
                    console.log("".concat(Goal.scorer.name, " scored a goal."));
                }
            }
        }
        // Additional game logic here
        // Reset goals
        Goal.reset();
    };
    function getBallSpeed() {
        var ballProp = room.getDiscProperties(0);
        return Math.sqrt(Math.pow(ballProp.xspeed, 2) + Math.pow(ballProp.yspeed, 2)) * speedCoefficient;
    }
    var speedCoefficient = 100 / (5 * (Math.pow(0.99, 60) + 1));
    // Função para resetar estátisticas locais.
    function resetPlayerStatistics() {
        for (var playerId in playerStatistics) {
            playerStatistics[playerId].goals = 0;
            playerStatistics[playerId].assists = 0;
            playerStatistics[playerId].ag = 0;
        }
    }
    //                      Quando o jogo começa                    //
    room.onGameStart = function () {
        // Verifique se há 3 jogadores em cada time
        var team1Players = room.getPlayerList().filter(function (p) { return p.team === 1; });
        var team2Players = room.getPlayerList().filter(function (p) { return p.team === 2; });
        if (team1Players.length === 3 && team2Players.length === 3) {
            matchStartTime = new Date();
            room.pauseGame(true);
            // Obtenha a lista de espectadores
            var spectatorPlayers_1 = room.getPlayerList().filter(function (p) { return p.team === 0; });
            // Envie a mensagem para cada espectador
            spectatorPlayers_1.forEach(function (spectator) {
                room.sendAnnouncement("\uD83D\uDCB0 Jogo pausado por 5 segundos para as apostas.", spectator.id, 0x10F200, "bold", 2);
            });
            setTimeout(function () {
                room.pauseGame(false);
            }, 5000);
            // Envie a mensagem para cada espectador
            spectatorPlayers_1.forEach(function (spectator) {
                room.sendAnnouncement("💰 Para apostar em um JOGADOR digite !bet [@jogador] [valor] [quantos gols irá fazer]", spectator.id, 0x10F200, "bold", 0);
                room.sendAnnouncement("💰 Para apostar em um TIME digite !bet [red/blue] [valor]", spectator.id, 0x10F200, "bold", 0);
                room.sendAnnouncement("💰 Após iniciada a partida, você tem 20 segundos para apostar", spectator.id, 0x10F200, "bold", 0);
            });
            // Agendar o envio da mensagem após 15 segundos
            setTimeout(function () {
                // Envie a mensagem para cada espectador
                spectatorPlayers_1.forEach(function (spectator) {
                    room.sendAnnouncement("💰 Apostas encerradas!", spectator.id, 0x10F200, 'bold');
                });
            }, 20000); // 15000 milissegundos equivalem a 20 segundos
        }
        endGameVariable = false;
        gameState = State.PLAY;
        // Atividade
        team1Players.forEach(function (p) {
            activities[p.id] = Date.now();
        });
        team2Players.forEach(function (p) {
            activities[p.id] = Date.now();
        });
        // Se estiverem 6 jogadores em jogo (3 em cada equipe mandar esta mensagem)
        if (team1Players.length === getMaxTeamSize() && team2Players.length === getMaxTeamSize()) {
            // room.sendAnnouncement(`📊 Tem ${getMaxTeamSize() * 2} jogadores em campo, o resultado irá contar para as estatísticas/status!`, null, 0x00FF00, "bold", 0);
            room.pauseGame(true);
            setTimeout(function () {
                room.pauseGame(false);
            }, 10);
        }
        room.startRecording();
        atualizaElosTimes();
    };
    function consultaElo(player) {
        return new Promise(function (resolve, reject) {
            dbConnection_1.con.query("SELECT elo FROM stats WHERE player_id = (SELECT id FROM players WHERE LOWER(name) = LOWER(?)) AND room_id = ?", [player.name, process.env.room_id], function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result[0].elo);
                }
            });
        });
    }
    function atualizaElosTimes() {
        return __awaiter(this, void 0, void 0, function () {
            var team1Players, team2Players, _i, team1Players_1, player_4, elo, err_1, _a, team2Players_1, player_5, elo, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        team1Players = room.getPlayerList().filter(function (p) { return p.team === 1; });
                        team2Players = room.getPlayerList().filter(function (p) { return p.team === 2; });
                        if (!(team1Players.length >= 1 && team2Players.length >= 1)) return [3 /*break*/, 12];
                        _i = 0, team1Players_1 = team1Players;
                        _b.label = 1;
                    case 1:
                        if (!(_i < team1Players_1.length)) return [3 /*break*/, 6];
                        player_4 = team1Players_1[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, consultaElo(player_4)];
                    case 3:
                        elo = _b.sent();
                        team1Elo += elo;
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _b.sent();
                        console.error(err_1);
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        _a = 0, team2Players_1 = team2Players;
                        _b.label = 7;
                    case 7:
                        if (!(_a < team2Players_1.length)) return [3 /*break*/, 12];
                        player_5 = team2Players_1[_a];
                        _b.label = 8;
                    case 8:
                        _b.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, consultaElo(player_5)];
                    case 9:
                        elo = _b.sent();
                        team2Elo += elo;
                        return [3 /*break*/, 11];
                    case 10:
                        err_2 = _b.sent();
                        console.error(err_2);
                        return [3 /*break*/, 11];
                    case 11:
                        _a++;
                        return [3 /*break*/, 7];
                    case 12: return [2 /*return*/];
                }
            });
        });
    }
    function getRoomCode() {
        if (exports.roomName == null)
            return 'SALA';
        var parts = exports.roomName.split("|");
        if (parts.length > 2) {
            var namePart = parts[2].split(" ")[1]; // Supondo que "x3" esteja sempre seguido por um espaço
            return namePart;
        }
        else {
            return 'SALA';
        }
    }
    function sendRecordToDiscord(recording) {
        var channel = client_1.default.channels.cache.get(exports.roomReplaysChannel);
        if (!channel) {
            console.error('Canal não encontrado!');
            return;
        }
        var recordingBuffer = Buffer.from(recording);
        var fileName = "".concat(getRoomCode(), "-").concat(getDate(), ".hbr2");
        channel.send({
            files: [{
                    attachment: recordingBuffer,
                    name: fileName
                }]
        })
            .catch(console.error);
    }
    room.onGameStop = function () {
        handleEndOfGame(winningTeam);
        sendRecordToDiscord(room.stopRecording());
        // Limpar GK's
        gk = [null, null];
        executed = false;
        // Limpar o kickoff
        kickOff = false;
        endGameVariable = true;
        gameState = State.STOP;
        var players = room.getPlayerList();
        for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
            var player_6 = players_1[_i];
            handleRanks(player_6); // Definir avatares.
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
            allowAFK = false;
            setTimeout(function () {
                allowAFK = true;
            }, 2000);
            if (players.length == 2 * getMaxTeamSize()) {
                inChooseMode = false;
                resetBtn();
                for (var i = 0; i < getMaxTeamSize(); i++) {
                    setTimeout(function () {
                        randomBtn();
                    }, 400 * i);
                }
                setTimeout(function () {
                    room.startGame();
                }, 2000);
            }
            else {
                if (winningTeam == Team.RED) {
                    blueToSpecBtn();
                }
                else if (winningTeam == Team.BLUE) {
                    redToSpecBtn();
                    blueToRedBtn();
                }
                else {
                    resetBtn();
                }
                setTimeout(function () {
                    topBtn();
                }, 1000);
            }
        }
        else {
            if (players.length == 2) {
                if (winningTeam == Team.BLUE) {
                    room.setPlayerTeam(exports.teamB[0].id, Team.RED);
                    room.setPlayerTeam(exports.teamR[0].id, Team.BLUE);
                    // swapUniform();
                }
                setTimeout(function () {
                    room.startGame();
                }, 2000);
            }
            else if (players.length == 3 || players.length >= 2 * getMaxTeamSize() + 1) {
                if (winningTeam == Team.RED) {
                    blueToSpecBtn();
                }
                else {
                    redToSpecBtn();
                    blueToRedBtn();
                }
                setTimeout(function () {
                    topBtn();
                }, 200);
                setTimeout(function () {
                    room.startGame();
                }, 2000);
            }
            else if (players.length == 4) {
                resetBtn();
                setTimeout(function () {
                    randomBtn();
                    setTimeout(function () {
                        randomBtn();
                    }, 500);
                }, 500);
                setTimeout(function () {
                    room.startGame();
                }, 2000);
            }
            else if (players.length == 5 || players.length >= 2 * getMaxTeamSize() + 1) {
                if (winningTeam == Team.RED) {
                    blueToSpecBtn();
                }
                else {
                    redToSpecBtn();
                    blueToRedBtn();
                }
                setTimeout(function () {
                    topBtn();
                }, 200);
                activateChooseMode();
            }
            else if (players.length == 6) {
                resetBtn();
                setTimeout(function () {
                    randomBtn();
                    setTimeout(function () {
                        randomBtn();
                        setTimeout(function () {
                            randomBtn();
                        }, 500);
                    }, 500);
                }, 500);
                setTimeout(function () {
                    room.startGame();
                }, 2000);
            }
        }
    };
    function handleGoal(player, room_id) {
        dbConnection_1.con.query("INSERT INTO goals (player, goals, room_id) VALUES (?, 1, ?) ON DUPLICATE KEY UPDATE goals = goals + 1", [player, room_id], function (err) {
            if (err)
                throw err;
            console.log("Gol marcado por ".concat(player));
        });
    }
    function handleEndOfGame(winningTeam, losingTeam) {
        console.log(`handleEndOfGame chamado com winningTeam=${winningTeam} e losingTeam=${losingTeam}`);
    
        // Seleciona as apostas da tabela betplayer
        dbConnection_1.con.query("SELECT * FROM betplayer WHERE room_id = ?", [process.env.room_id], function (err, playerBets) {
            if (err) throw err;
    
            console.log(`Encontradas ${playerBets.length} apostas de jogadores`);
    
            playerBets.forEach(function (bet) {
                console.log(`Processando aposta do jogador ${bet.player_id} no jogador ${bet.bet_on}`);
    
                dbConnection_1.con.query("SELECT goals FROM goals WHERE player = ?", [bet.bet_on], function (err, result) {
                    var _a;
                    if (err) throw err;
                    var playerGoals = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.goals) || 0;
    
                    console.log(`Jogador ${bet.bet_on} fez ${playerGoals} gol(s)`);
    
                    handlePlayerBet(bet, playerGoals);
                });
            });
    
            // Limpa a tabela betplayer após 25 segundos
            setTimeout(function() {
                dbConnection_1.con.query("DELETE FROM betplayer WHERE room_id = ?", [process.env.room_id], function (err) {
                    if (err) throw err;
                    console.log("Tabela betplayer limpa 25 segundos após o término do jogo.");
                });
            }, 25000);
        });
    
        // Seleciona as apostas da tabela betteam
        dbConnection_1.con.query("SELECT * FROM betteam WHERE room_id = ?", [process.env.room_id], function (err, teamBets) {
            if (err) throw err;
    
            console.log(`Encontradas ${teamBets.length} apostas de equipe`);
    
            teamBets.forEach(function (bet) {
                console.log(`Processando aposta do jogador ${bet.player_id} no time ${bet.team}`);
    
                handleTeamBet(bet, winningTeam);
            });
    
            // Limpa a tabela betteam após 25 segundos
            setTimeout(function() {
                dbConnection_1.con.query("DELETE FROM betteam WHERE room_id = ?", [process.env.room_id], function (err) {
                    if (err) throw err;
                    console.log("Tabela betteam limpa 25 segundos após o término do jogo.");
                });
            }, 25000);
        });
    
        // Limpa a tabela goals
        dbConnection_1.con.query("DELETE FROM goals WHERE room_id = ?", [process.env.room_id], function (err) {
            if (err) throw err;
            console.log("Tabela goals limpa após o término do jogo.");
        });
    
        function handlePlayerBet(bet, playerGoals) {
            console.log(`handlePlayerBet chamado com bet=${JSON.stringify(bet)} e playerGoals=${playerGoals}`);
    
            if (playerGoals === bet.goals) {
                console.log(`Jogador ${bet.player_id} ganhou a aposta! Atualizando saldo...`);
                updatePlayerBalance(bet, bet.value * 2);
                sendAnnouncement(`🎉 Parabéns ${bet.player_id}, você apostou que ${bet.bet_on} faria ${bet.goals} gol(s) e venceu!`, bet.player_id);
            } else {
                console.log(`Jogador ${bet.player_id} perdeu a aposta.`);
                sendAnnouncement(`😢 ${bet.player_id}, infelizmente sua aposta que ${bet.bet_on} faria ${bet.goals} gol(s) não foi vencedora.`, bet.player_id);
            }
        }
    
        function handleTeamBet(bet, winningTeam) {
            console.log(`handleTeamBet chamado com bet=${JSON.stringify(bet)} e winningTeam=${winningTeam}`);
    
            if (!bet.team) {
                console.log(`Aposta do jogador ${bet.player_id} não tem um time definido.`);
                return;
            }
    
            if ((winningTeam === 1 && bet.team === 'red') || (winningTeam === 2 && bet.team === 'blue')) {
                console.log(`Jogador ${bet.player_id} ganhou a aposta no time! Atualizando saldo...`);
                updatePlayerBalance(bet, bet.value * 2);
                sendAnnouncement(`🎉 Parabéns ${bet.player_id}, você ganhou ${bet.value * 2} atacoins por apostar no time ${winningTeam === 1 ? "RED" : "BLUE"}!`, bet.player_id);
            } else {
                console.log(`Jogador ${bet.player_id} perdeu a aposta no time.`);
                sendAnnouncement(`😢 ${bet.player_id}, infelizmente sua aposta no time ${bet.team.toUpperCase()} não foi vencedora.`, bet.player_id);
            }
        }
    
        function updatePlayerBalance(bet, winningAmount) {
            console.log(`updatePlayerBalance chamado com bet=${JSON.stringify(bet)} e winningAmount=${winningAmount}`);
    
            dbConnection_1.con.query("UPDATE players SET balance = balance + ? WHERE id = ?", [winningAmount, bet.player_id], function (err) {
                if (err) throw err;
            });
        }
    
        function sendAnnouncement(message, playerId) {
            console.log(`sendAnnouncement chamado com message=${message} e playerId=${playerId}`);
    
            dbConnection_1.con.query("SELECT name FROM players WHERE id = ?", [playerId], function (err, result) {
                if (err) throw err;
                var playerName = result[0].name;
                room.sendAnnouncement(message.replace(playerId, playerName), playerId, 0x00FF00, "bold", 2);
            });
        }
    }    
      
    //                                                            //
    //                                                            //
    //                Quando equipe ganha                         //
    //                                                            //
    //                                                            //
    room.onTeamVictory = function (scores) {
        // Sacar winningTeam & losingTeam
        trackWinningTeam();
        // Definir ActivePlayers
        activePlayers = room.getPlayerList().filter(function (p) {
            return !afkStatus[p.id];
        });
        var playersOnTeam = activePlayers.filter(function (p) { return p.team === 1 || p.team === 2; });
        if (playersOnTeam.length >= getMaxTeamSize() * 2) { // Número de jogadores necessários nas equipes para contar para as stats.
            distribuirStats(playerStatistics);
            // WinStreak
            dbConnection_1.con.query('SELECT games FROM streak', function (err, result) {
                if (err) {
                    console.error(err);
                    return;
                }
                if (result.length === 0) {
                    console.error("Tabela streak sem resultado.");
                    return;
                }
                var games = result[0].games;
                // Comparar streak atual com o recorde.
                if (winstreak > games) {
                    // Dar update da tabela.
                    var playersOnTeam1 = activePlayers.filter(function (p) { return p.team === 1; });
                    var player1 = playersOnTeam1[0].name;
                    var player2 = playersOnTeam1[1].name;
                    var player3 = playersOnTeam1[2].name;
                    var sql = "UPDATE streak SET games = ?, player1 = ?, player2 = ?, player3 = ?";
                    dbConnection_1.con.query(sql, [winstreak, player1, player2, player3], function (err, result) {
                        if (err) {
                            console.error(err);
                        }
                        else if (!TopStreakBatida) {
                            TopStreakBatida = true;
                            room.sendAnnouncement("\uD83C\uDFC6 O recorde de streak da sala foi batido! Parab\u00E9ns a equipe \uD83D\uDD34!", null, 0xFF0000, "bold", 2);
                            console.log("Um novo recorde foi batido, tabela Streak atualizada.");
                        }
                    });
                }
            });
            if (winningTeam === 1) {
                winstreak++;
            }
            else if (winningTeam === 2) {
                winstreak = 1;
                TopStreakBatida = false;
            }
            // Adicionar atacoins para o time vencedor
            for (var _i = 0, _a = activePlayers.filter(function (p) { return p.team === winningTeam; }); _i < _a.length; _i++) {
                var player_7 = _a[_i];
                dbConnection_1.con.query("UPDATE players SET balance = balance + 50 WHERE name = ?", [player_7.name], function (err, result) {
                    if (err)
                        throw err;
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
    };
    room.onPlayerTeamChange = function (player, byPlayer) {
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
        activePlayers = room.getPlayerList().filter(function (p) {
            return !afkStatus[p.id];
        });
        updateTeams();
        if (inChooseMode && resettingTeams == false && !byPlayer) {
            if (Math.abs(exports.teamR.length - exports.teamB.length) == exports.teamS.length) {
                deactivateChooseMode();
                resumeGame();
                var b = exports.teamS.length;
                if (exports.teamR.length > exports.teamB.length) {
                    for (var i = 0; i < b; i++) {
                        setTimeout(function () {
                            if (exports.teamS[0]) {
                                room.setPlayerTeam(exports.teamS[0].id, Team.BLUE);
                            }
                        }, 200 * i);
                    }
                }
                else {
                    for (var i = 0; i < b; i++) {
                        setTimeout(function () {
                            if (exports.teamS[0]) {
                                room.setPlayerTeam(exports.teamS[0].id, Team.RED);
                            }
                        }, 200 * i);
                    }
                }
                return;
            }
            else if ((exports.teamR.length == getMaxTeamSize() && exports.teamB.length == getMaxTeamSize()) || (exports.teamR.length == exports.teamB.length && exports.teamS.length < 2)) {
                deactivateChooseMode();
                resumeGame();
            }
            else if (exports.teamR.length <= exports.teamB.length && redCaptainChoice != "") { // choice remembered
                redCaptainChoice == "top" ? room.setPlayerTeam(exports.teamS[0].id, Team.RED) : redCaptainChoice == "random" ? room.setPlayerTeam(exports.teamS[getRandomInt(exports.teamS.length)].id, Team.RED) : room.setPlayerTeam(exports.teamS[exports.teamS.length - 1].id, Team.RED);
                return;
            }
            else if (exports.teamB.length < exports.teamR.length && blueCaptainChoice != "") {
                blueCaptainChoice == "top" ? room.setPlayerTeam(exports.teamS[0].id, Team.BLUE) : blueCaptainChoice == "random" ? room.setPlayerTeam(exports.teamS[getRandomInt(exports.teamS.length)].id, Team.BLUE) : room.setPlayerTeam(exports.teamS[exports.teamS.length - 1].id, Team.BLUE);
                return;
            }
            else {
                choosePlayer();
            }
        }
        else if (byPlayer) {
            updateRoleOnPlayerIn();
        }
        if (!endGameVariable) {
            atualizaElosTimes();
        }
    };
    function resumeGame() {
        setTimeout(function () {
            room.startGame();
        }, 2000);
        setTimeout(function () {
            room.pauseGame(false);
        }, 1000);
    }
    //                         Função quando o player saí da room                       //
    var capLeft = false;
    room.onPlayerLeave = function (player, scores) {
        delete rankTag[player.id];
        if (exports.teamR.findIndex(function (red) { return red.id == player.id; }) == 0 && inChooseMode && exports.teamR.length <= exports.teamB.length) {
            choosePlayer();
            capLeft = true;
            setTimeout(function () {
                capLeft = false;
            }, 10);
        }
        if (exports.teamB.findIndex(function (blue) { return blue.id == player.id; }) == 0 && inChooseMode && exports.teamB.length < exports.teamR.length) {
            choosePlayer();
            capLeft = true;
            setTimeout(function () {
                capLeft = false;
            }, 10);
        }
        var playerList = room.getPlayerList();
        updateNumberOfPlayers(playerList);
        // Checkar a database se o jogador está logado
        var sql = "SELECT * FROM players WHERE name = ?";
        var values = [player.name];
        dbConnection_1.con.query(sql, values, function (err, result) {
            if (err)
                throw err;
            if (result.length > 0) {
                if (result[0].loggedIn === 1) {
                    activePlayers = room.getPlayerList().filter(function (p) {
                        return !afkStatus[p.id];
                    });
                    var redTeam = activePlayers.filter(function (p) { return p.team === 1; });
                    var blueTeam = activePlayers.filter(function (p) { return p.team === 2; });
                    // Remover jogador da variável local.
                    delete activities[player.id];
                    // Quando um jogador sai tirar o login.
                    var sql_5 = "SELECT game_id FROM players WHERE LOWER(name) = LOWER(?)";
                    var values_5 = [player.name];
                    dbConnection_1.con.query(sql_5, values_5, function (err, result) {
                        if (err)
                            throw err;
                        if (result[0] && result[0].game_id === player.id) { // Resolvido o problema do jogo crashar.
                            var sql_6 = "UPDATE players SET game_id = 0, loggedIn = 0 WHERE LOWER(name) = LOWER(?)";
                            var values_6 = [player.name];
                            dbConnection_1.con.query(sql_6, values_6, function (err) {
                                if (err)
                                    throw err;
                                console.log("".concat(player.name, " saiu da sala."));
                            });
                        }
                    });
                    // Limpar player.auth / player.conn / player.ipv4
                    exports.playerAuth.delete(player.id);
                    exports.playerConnections.delete(player.id);
                    exports.playerIpv4.delete(player.id);
                    // Resetar os valores das variáveis locais. (Não é necessário pois a id é sempre diferente, mas eu gosto de limpar td)
                    afkStatus[player.id] = 0;
                    // Aqui é necessário
                    loggedInPlayers[player.id] = false;
                }
            }
        });
        // Verifica se o jogador que saiu tinha alguma aposta nele
        dbConnection_1.con.query("SELECT * FROM betplayer WHERE bet_on = ? AND bet_type = 'player' AND room_id = ?", [player.name, process.env.room_id], function (err, existingBets) {
            if (err)
                throw err;
            if (existingBets.length > 0) {
                // O jogador que saiu tinha uma aposta nele, então reembolse o apostador
                dbConnection_1.con.query("UPDATE players SET balance = balance + ? WHERE id = ?", [existingBets[0].value, existingBets[0].player_id], function (err) {
                    if (err)
                        throw err;
                    room.sendAnnouncement("\uD83D\uDCB0 Sua aposta no jogador ".concat(player.name, " foi cancelada e seus ").concat(existingBets[0].value, " atacoins foram reembolsados."), existingBets[0].player_id, 0x00FF00, "bold", 2);
                });
                // Remove a aposta da tabela betplayer
                dbConnection_1.con.query("DELETE FROM betplayer WHERE bet_on = ? AND bet_type = 'player' AND room_id = ?", [player.name, process.env.room_id], function (err) {
                    if (err)
                        throw err;
                });
            }
        });
        updateRoleOnPlayerOut();
    };
});
