### Features

- [x] Conexão à Database
- [x] Sistema Login/Registo por password
- [x] Sistema de Login automático após o 1º login
- [x] Password encriptada em BCrypt
- [x] Comando para mudar a password
- [x] Anti Double-Login com o mesmo nome
- [x] Apenas colocar jogadores com login completo em jogo
- [x] Sistema AFK
- [x] Sistema de SuperAdmin
- [x] Proteção contra inatividade a meio do jogo
- [x] Sistema de Jogo 1v1 / 2v2 / 3v3 completo
- [x] Sistema de Ban e Mute
- [x] Sistema de Gols, assistências, gols-contras, etc
- [x] Sistema de Elo + Ranks
- [x] Uma lista quase interminável de comandos
- [x] Sistema que faz a previsão de vitória de ambas as equipas com base no elo dos jogadores que compõem as mesmas
- [x] Team chat
- [x] Staff chat
- [x] Mensagens Privadas 
- [x] Sistema de WinStreak
- [x] Sistema de GK's & CS
- [x] Sistema de Logs
- [x] Muito mais... 

## Requisitos
- MySQL 8.0 ou superior.
- Node.js 16.x
- HeidiSQL ou qualquer programa que te permita editar uma database.

## Como usar?

1º Criar uma database usando o MySQL.

2º Importar o ficheiro `Database Limpa.sql` para a tua database no MySQL.

2º Modificar o ficheiro `.env` com os dados da tua database e o ficheiro `room.ts` com a respetiva token e nome da sala.

3º Executar o arquivo: `Instalar.bat`.

4º De seguida executar o arquivo: `Iniciar.bat`.

## Comandos de usuário

- !help: Exibe a lista de comandos disponíveis.
- !registo: Faz !registo seguido pela tua password `(ex. !registrar password )`
- !login: Faz !login na sala seguido pela tua password `(ex. !login password )`
- !changepw: Faz !changepw seguido de passwordantiga passwordnova `(ex. !changepw senha senha123 )`
- !afk: Coloca-te e tira-te de AFK.
- !about: Mostra-te informações sobre a sala.
- !discord: Dá-te o discord oficial da HaxRooms.
- !stats: Mostra-te as tuas estátisticas ou as de outro jogador. `(!stats)` ou `(!stats NOME)`
- !rank: Mostra-te os ranks que podes obter na sala.
- t: Faz t Mensagem para enviar uma mensagem para a tua equipa (Red ou Blue).
- !streak: Mostra-te a streak atual da sala.
- !topstreak: Mostra-te o recorde de streak da sala.
- !sub: És substituído caso estejas nos primeiros 5 segundos de um jogo.
- !prev: Dá-te a previsão de vitória para o jogo atual.
- #: Envia mensagem privada para o jogador à tua escolha através da sua ID. `(ex. #50 teste)`
- !bb: Faz logout da sala ( é o mesmo que simplesmente sair ).

## Comandos de SuperAdmin

- !ban: Faz !ban razão tempo nome | `(ex: !ban teste 7d OBL)` | tempo: 1d = 1 dia | 1h = 1 hora | 1m = 1 minuto | 1s = 1 segundo.
- !unban: Se o jogador estiver banido tira-lhe o ban | `(ex: !unban OBL)`
- !mute: Faz !mute razão tempo nome | `(ex: !mute teste 7d OBL)` | tempo: 1d = 1 dia | 1h = 1 hora | 1m = 1 minuto | 1s = 1 segundo.
- !unmute: Se o jogador estiver mutado tira-lhe o mute | `(ex: !unmute OBL)`
- . : Comando para falares no chat da staff `(ex: . Sou lindo)` (É necessário colocar sempre um espaço entre o . e a mensagem)
