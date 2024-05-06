import client from '../../Client/client';
import { room } from '../../../room';
import { Message, PermissionResolvable } from 'discord.js';
import { cores } from '../../Room/Config/cores';
import { error } from '../../Room/Config/errors';

const sendMessage = client.on('messageCreate', async (message: Message) => {
    try {
        if (message.content.startsWith('!send ')) {
            if (message.member && message.member.permissions.has('ADMINISTRATOR' as PermissionResolvable)) {
                const content = message.content.slice(6);

                await room.sendAnnouncement(`DISCORD | ${message.author.username}: ${content}`, null, cores.amarelo, "bold", 2);
                await message.reply('Mensagem enviada com sucesso!');
            } else {
                await message.reply('Você não tem permissão para enviar mensagens.');
            }
        }
    } catch (err) {
        error(`SendMessage`, err);
    }
});

export default sendMessage; 