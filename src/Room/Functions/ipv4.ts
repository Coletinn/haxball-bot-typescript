const { Client, ActionRowBuilder, ModalBuilder, PermissionsBitField, GatewayIntentBits, Events, TextInputBuilder, TextInputStyle, TextBasedChannels, ButtonInteraction, CommandInteraction, ApplicationCommandType } = require('discord.js');
import { GuildMember, EmbedBuilder, PermissionResolvable } from 'discord.js';
import client from '../../Client/client';
import { cores } from '../Config/cores';
import { error } from '../Config/errors';
import { room, playerConnections } from '../../../room';

export function ipv4(player) {
    if(!player) return;

    const conn: any = player.conn;
    const ipv4: any = conn.match(/.{1,2}/g).map(function (v: any) {
        return String.fromCharCode(parseInt(v, 16));
    }).join('');

    return ipv4;
};