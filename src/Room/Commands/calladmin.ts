const { Client, ActionRowBuilder, ModalBuilder, PermissionsBitField, GatewayIntentBits, Events, TextInputBuilder, TextInputStyle, TextBasedChannels, ButtonInteraction, CommandInteraction, ApplicationCommandType } = require('discord.js');
const config = require('../../../config.json');

import { GuildMember, EmbedBuilder, PermissionResolvable } from 'discord.js';
import client from '../../Client/client';
import { cores } from '../../Room/Config/cores';
import { error } from '../../Room/Config/errors';
import { room, playerConnections, playerAuth, roomName } from '../../../room';

var lastCallAdminTime: any = 0;
var callCount: any = 0;
var bloquear_comando: any = [];

export function calladmin(player: any, message: any) {
    const words = message.split(" ");

    if (bloquear_comando.includes(player.name) == false) {
        const input = words;
        const report = input.slice(1).join(' ');
        const hour = new Date();
        const formattedTime = hour.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        const conn = playerConnections.get(player.id);
        const auth = playerAuth.get(player.id);
        const ipv4 = conn.match(/.{1,2}/g).map(function (v: any) {
            return String.fromCharCode(parseInt(v, 16));
        }).join('');

        if (report.length == 0) {
            room.sendAnnouncement(`${player.name} Você não expecificou um motivo... \nExemplo: !calladmin Adm vem banir um racista`, player.id, cores.vermelho, 'bold', 2);
            return false;
        }

        bloquear_comando.push(player.name);

        setTimeout(() => {
            var remover_player: any = bloquear_comando.indexOf(player.name) + bloquear_comando.splice(remover_player, 1)
        }, 120000)

        if (config.webhooks.calladmin && config.webhooks.calladmin !== "") {
            fetch(config.webhooks.calladmin, {
                method: 'POST',
                body: JSON.stringify({
                    content: `||@here|| 📢 CallAdmin: \n\n> - **Nick:** ${player.name} \n> - **Motivo:** ${report} \n> - **Horário:** ${formattedTime} \n> - **Informações:** \`\`\`Conn: ${conn}, Auth: ${auth}, Ipv4: ${ipv4}\`\`\` `,
                    username: roomName,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => res);

            room.sendAnnouncement("[PV] Calladmin enviado com sucesso!", player.id, cores.verde, 'bold', 2);
            room.sendAnnouncement(`[PV] Motivo: ${report}.`, player.id, cores.verdeLimao, 'bold');
        }

        return false;
    } else if (bloquear_comando.includes(player.name) == true) {
        room.sendAnnouncement("Você ja chamou os administradores, aguarde 2 minutos para poder chamá-los novamente.", player.id, cores.vermelho, 'bold', 2)
    }
}