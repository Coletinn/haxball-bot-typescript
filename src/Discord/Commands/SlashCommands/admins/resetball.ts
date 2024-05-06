const { Client, ActionRowBuilder, ModalBuilder, PermissionsBitField, GatewayIntentBits, Events, TextInputBuilder, TextInputStyle, TextBasedChannels, ButtonInteraction, CommandInteraction, ApplicationCommandType } = require('discord.js');
import { GuildMember, EmbedBuilder, PermissionResolvable } from 'discord.js';
import client from '../../../../Client/client';
import { cores } from '../../../../Room/Config/cores';
import { error } from '../../../../Room/Config/errors';
import { discord, room } from '../../../../../room';

export const clearBansCommand = client.on(Events.InteractionCreate, async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'resetball') {
        const member = interaction.member as GuildMember;

        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            if (!room.getScores())
                return interaction.reply({ content: `❌ O jogo não começou.`, ephemeral: true });

            room.setDiscProperties(0, { xspeed: 0, yspeed: 0 });

            room.sendAnnouncement(`✅ O administrador ${member.user.username} reiniciou a partida! \n 🚧 Em caso de abuso de comando, reporte no nosso servidor: ${discord}`, null, cores.verdeLimao, "bold", 2);
            interaction.reply({ content: `✅ Bola reiniciada para a posição inicial!` })
        } else {
            interaction.reply({ content: `❌ Você não tem permissão para utilizar esse comando!`, ephemeral: true });
        }
    }
});