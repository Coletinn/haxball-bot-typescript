const { ActionRowBuilder, ModalBuilder, Events, TextInputBuilder, TextInputStyle } = require('discord.js');
import { GuildMember } from 'discord.js';
import client from '../../../../Client/client';
const config = require('../../../../../config.json');

export const configCommand = client.on(Events.InteractionCreate, async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'config') {
        const member = interaction.member as GuildMember;
        const desiredRoleId = config.staffId.ceo;
        const hasDesiredRole = member.roles.cache.has(desiredRoleId);

        if (hasDesiredRole) {
            const modal = new ModalBuilder({
                customId: `modal2`,
                title: 'Test'
            });

            const idLogs = new TextInputBuilder({
                customId: 'idLogs',
                label: "Digite o ID do canal de log de mensagens:",
                style: TextInputStyle.Short,
                required: false,
            });

            const replayLogs = new TextInputBuilder({
                customId: 'replayLogs',
                label: "Digite o ID do canal de replays das partidas:",
                style: TextInputStyle.Short,
                required: false,
            });

            const errorsLogs = new TextInputBuilder({
                customId: 'errorsLogs',
                label: "Digite o ID do canal de erros:",
                style: TextInputStyle.Short,
                required: false,
            });

            const statusSala = new TextInputBuilder({
                customId: 'statusSala',
                label: "Digite o ID do canal de status do servidor:",
                style: TextInputStyle.Short,
                required: false,
            });

            const entradasLogs = new TextInputBuilder({
                customId: 'entradasLogs',
                label: "Digite o ID do canal de log de entradas:",
                style: TextInputStyle.Short,
                required: false,
            });

            const logsActionRow = new ActionRowBuilder().addComponents(idLogs);
            const replaysSecondRow = new ActionRowBuilder().addComponents(replayLogs);
            const errorsRow = new ActionRowBuilder().addComponents(errorsLogs);
            const statusSalaRow = new ActionRowBuilder().addComponents(statusSala);
            const entradasLogsRow = new ActionRowBuilder().addComponents(entradasLogs);

            modal.addComponents(logsActionRow, replaysSecondRow, errorsRow, entradasLogsRow, statusSalaRow);

            await interaction.showModal(modal);
        } else {
            await interaction.reply({
                content: 'Você precisa ser um administrador para usar este comando.',
                ephemeral: true,
            });
        }
    }
});
