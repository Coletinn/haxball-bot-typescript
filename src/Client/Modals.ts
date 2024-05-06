const { PermissionsBitField, TextBasedChannels, TextChannel } = require('discord.js');
import { EmbedBuilder } from 'discord.js';
import client from './client';
import { error } from '../Room/Config/errors';

import { createChannelMessage,
    roomLogChannel, roomReplaysChannel, roomErrorsChannel, roomEntradasChannel, roomStatusChannel,
    setRoomLogChannel, setRoomReplayChannel, setRoomErrorsChannel, setRoomEntradasChannel, setRoomStatusChannel } from '../../room';

client.on('interactionCreate', async (interaction: any) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'modal2') {
        const fields: { [key: string]: string } = {
            log: interaction.fields.getTextInputValue('idLogs'),
            replays: interaction.fields.getTextInputValue('replayLogs'),
            errors: interaction.fields.getTextInputValue('errorsLogs'),
            entradas: interaction.fields.getTextInputValue('entradasLogs'),
            status: interaction.fields.getTextInputValue('statusSala')
        };

        let responseMessage = '';

        function processField(
            fieldKey: string,
            setChannelFunction: (channelId: string) => void,
            channelName: string,
            currentChannelValue: string | null
        ): void {
            const fieldValue: string = fields[fieldKey];
            const channel: any = client.channels.cache.get(fieldValue);

            if (fieldValue.length > 0) {
                if (channel) {
                    setChannelFunction(fieldValue);
                    responseMessage += createChannelMessage(channelName, fieldValue);
                } else {
                    responseMessage += createChannelMessage(channelName, null);
                }
            } else {
                responseMessage += createChannelMessage(channelName, currentChannelValue);
            }
        }

        processField('log', setRoomLogChannel, 'logs', roomLogChannel);
        processField('replays', setRoomReplayChannel, 'replays', roomReplaysChannel);
        processField('errors', setRoomErrorsChannel, 'erros', roomErrorsChannel);
        processField('entradas', setRoomEntradasChannel, 'entradas/saidas', roomEntradasChannel);
        processField('status', setRoomStatusChannel, 'status sala', roomStatusChannel);

        const embed = new EmbedBuilder()
            .setTitle('Configuração dos Canais')
            .setDescription(responseMessage)
            .setColor('Random');

        await interaction.deferUpdate();
        await interaction.followUp({ embeds: [embed] });
    }
});


client.on('interactionCreate', async (interaction: any) => {
    try {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'send') {
            if (interaction.user && interaction.user.permissions.has(PermissionsBitField.Flags.Administrator)) {
                const content = interaction.options.getString('msg');

                const channel = client.channels.cache.get('SEU_CANAL_ID') as typeof TextBasedChannels;
                if (channel) {
                    channel.send(`DISCORD | ${interaction.user.username}: ${content}`);
                    await interaction.reply({ content: '✅ Mensagem enviada com sucesso!', ephemeral: true });
                } else {
                    await interaction.reply({ content: '❌ Canal não encontrado.', ephemeral: true });
                }
            } else {
                await interaction.reply({ content: 'Você não tem permissão para enviar mensagens.', ephemeral: true });
            }
        }
    } catch (err) {
        error(`SendMessage`, err);
    }
});