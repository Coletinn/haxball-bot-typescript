const { Client, ActionRowBuilder, ModalBuilder, PermissionsBitField, GatewayIntentBits, Events, TextInputBuilder, TextInputStyle, TextBasedChannels, ButtonInteraction, CommandInteraction, ApplicationCommandType } = require('discord.js');
import { GuildMember, EmbedBuilder, PermissionResolvable } from 'discord.js';
import client from '../../../../Client/client';
import { cores } from '../../../../Room/Config/cores';
import { error } from '../../../../Room/Config/errors';
import { room } from '../../../../../room';

export const sendCommand = client.on(Events.InteractionCreate, async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'send') {
        const member = interaction.member as GuildMember;

        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const { options } = interaction;
            const msgOption = options.get('msg');

            if (msgOption) {
                const messageToSend = msgOption.value;
                room.sendAnnouncement(`DISCORD | ${member.user.username}: ${messageToSend}`, null, cores.amarelo, "bold", 2);
                interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true });
            }
        } else {
            interaction.reply({ content: `❌ Você não tem permissão para utilizar esse comando!`, ephemeral: true });
        }
    }
});