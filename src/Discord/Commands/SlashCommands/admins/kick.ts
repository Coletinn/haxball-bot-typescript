const { Client, ActionRowBuilder, ModalBuilder, PermissionsBitField, GatewayIntentBits, Events, TextInputBuilder, TextInputStyle, TextBasedChannels, ButtonInteraction, CommandInteraction, ApplicationCommandType } = require('discord.js');
import { GuildMember, EmbedBuilder, PermissionResolvable } from 'discord.js';
import client from '../../../../Client/client';
import { cores } from '../../../../Room/Config/cores';
import { error } from '../../../../Room/Config/errors';
import { discord, room } from '../../../../../room';

export const kickCommand = client.on(Events.InteractionCreate, async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'kick') {
        var { options } = interaction;
        var member = interaction.member as GuildMember;
        var jogador = options.get('user');
        var motivo = options.get('reason') || "Não especificado";

        if (!jogador) return;
        if (!motivo) return;

        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            let playerKick = room.getPlayerList().filter((p: any) => p.name === jogador) || room.getPlayerList().filter((p: any) => p.id === jogador);
        
            if (playerKick.length > 0) {
                playerKick = playerKick[0]; // Acessa o primeiro jogador do array
                room.kickPlayer(playerKick.id, `Você foi kickado pelo ${interaction.user.username}. Motivo: ${motivo}`, false);
                await room.sendAnnouncement(`${playerKick.name ? playerKick.name : jogador} Foi kickado pelo ${interaction.user.username}. Motivo: ${motivo}`, null, cores.vermelho, "bold", 2);
                interaction.reply({ content: `✅ Jogador ${playerKick.name ? playerKick.name : jogador} kickado com sucesso!` });
            } else {
                interaction.reply({ content: `Não encontrei nenhum jogador com esse nome!` });
            }
        } else {
            interaction.reply({ content: `❌ Você não tem permissão para utilizar esse comando!`, ephemeral: true });
        }
    }
});
