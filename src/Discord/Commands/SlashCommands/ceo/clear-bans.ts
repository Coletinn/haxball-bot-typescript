const { Events } = require('discord.js');
import { GuildMember } from 'discord.js';
import client from '../../../../Client/client';
import { cores } from '../../../../Room/Config/cores';
import { room } from '../../../../../room';
const config = require('../../../../../config.json');

export const clearBansCommand = client.on(Events.InteractionCreate, async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'clearbans') {
        const member = interaction.member as GuildMember;
        const desiredRoleId = config.staffId.ceo;
        const hasDesiredRole = member.roles.cache.has(desiredRoleId);

        if (hasDesiredRole) {
            room.clearBans();
            room.sendAnnouncement(`✅ O administrador ${member.user.username} limpou os banimentos da sala!`, null, cores.verdeLimao, "bold", 2);
            interaction.reply({ content: `✅ Bans limpos!` });
        } else {
            interaction.reply({ content: `❌ Você não tem permissão para utilizar esse comando!`, ephemeral: true });
        }
    }
});
