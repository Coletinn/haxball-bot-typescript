import client from '../../Client/client';
import { roomErrorsChannel } from '../../../room';
const config = require('../../../config.json');

export function error(cmd: any | null, error: any | null) {
    if (cmd === null || error === null) return;

    if (roomErrorsChannel != null) {
        client.send(roomErrorsChannel, `||<@&${config.staffId.ceo}>|| Ocorreu um erro em "${cmd}": \n\n \`\`\`${error}\`\`\``);
        console.error(`Erro em "${cmd}": ${error}`);
    }
};