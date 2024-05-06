const { Client, ActionRowBuilder, ModalBuilder, PermissionsBitField, GatewayIntentBits, Events, TextInputBuilder, TextInputStyle, TextBasedChannels, ButtonInteraction, CommandInteraction, ApplicationCommandType } = require('discord.js');
import { GuildMember, EmbedBuilder, PermissionResolvable } from 'discord.js';
import client from '../../../../Client/client';
import { cores } from '../../../../Room/Config/cores';
import { error } from '../../../../Room/Config/errors';
import { room } from '../../../../../room';

export const sendCommand = client.on(Events.InteractionCreate, async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'players') {
        const players = room.getPlayerList();

        if (players.length > 0) {
            const modifiedPlayers = players.map((player: any) => {
                let teamName = '';
                if (player.team === 0) {
                    teamName = 'Espectador';
                } else if (player.team === 1) {
                    teamName = 'Red';
                } else if (player.team === 2) {
                    teamName = 'Blue';
                } else {
                    teamName = 'Não definido';
                }

                return {
                    name: player.name,
                    value: `ID: ${player.id}\nTime: ${teamName}`,
                };
            });

            const embed = {
                color: 0x0099ff,
                title: `Jogadores Online: ${players.length}`,
                fields: modifiedPlayers,
            };

            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({ content: 'Não há jogadores na sala no momento.' });
        }
    }
});