require('dotenv').config();

import { room, numberOfPlayers } from '../../room';

const { Client, ActionRowBuilder, ModalBuilder, GatewayIntentBits, TextInputBuilder, TextInputStyle, TextBasedChannels, ButtonInteraction, CommandInteraction, ApplicationCommandType } = require('discord.js');
const figlet = require("figlet");

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMembers
    ],
});

client.send = function (channelId: any, content: any, embed: boolean | null) {
    const channel = client.channels.cache.get(channelId);
    
    if (channel) {
        if (embed === true) {
            if (Array.isArray(content)) {
                channel.send({ embeds: content });
            } else {
                console.error('O conteúdo do embed não é um array:', content);
            }
        } else {
            channel.send(content);
        }
    } else {
        console.error('Canal não encontrado com o ID fornecido:', channelId);
    }
};


client.once('ready', async () => {
    setInterval(() => {
        const activities = [
            `${client.users.cache.size} membros no Discord!`,
            `${numberOfPlayers} jogadores na sala da UBH!`,
            `Bot criado por: OBL & Junplid`,
            `Bot criado por: Junplid & OBL`,
        ];
        const randomIndex = Math.floor(Math.random() * activities.length);
        const newActivity = activities[randomIndex];

        client.user.setActivity(newActivity);
    }, 5000);

    figlet.text(`Estou online como: ${client.user.tag}`, function (err: any, data: any) {
        console.log(data);
    });
});


client.on('ready', async () => {
    const commands: any = [
        {
            name: 'kick',
            description: 'Kick um jogador da sala.',
            type: ApplicationCommandType.ChatInput,
            options: [
                {
                    type: ApplicationCommandType.Message,
                    name: 'user',
                    description: 'O jogador para kickar',
                    required: true,
                },
                {
                    type: ApplicationCommandType.Message,
                    name: 'reason',
                    description: 'Motivo do kick',
                    required: true,
                },
            ],
        },
        {
            name: 'send',
            description: 'Envia uma mensagem na sala.',
            type: ApplicationCommandType.ChatInput,
            options: [
                {
                    type: ApplicationCommandType.Message,
                    name: 'msg',
                    description: 'Digite a mensagem a ser enviada na sala',
                    required: true,
                },
            ],
        },
        {
            name: 'registrar',
            description: 'Se registre na sala da UBH',
            type: ApplicationCommandType.ChatInput,
            options: [
                {
                    type: ApplicationCommandType.Message,
                    name: 'nick',
                    description: 'Digite o nome que você usará na sala.',
                    required: true,
                },
                {
                    type: ApplicationCommandType.Message,
                    name: 'senha',
                    description: 'Digite a senha para fazer login na sala.',
                    required: true,
                },
            ],
        },
        {
            name: 'config',
            description: 'Configure o bot no servidor.',
        },
        {
            name: 'players',
            description: 'Veja os jogadores online.',
        },
        /* {
            name: 'passwordsvips',
            description: 'Veja as senhas atuais dos vips.',
        }, */
        {
            name: 'resetball',
            description: 'Reinicie a posição da bola na partida da sala.',
        },
        {
            name: 'clearbans',
            description: 'Limpa os banimentos temporários da sala.',
        },
    ];

    const guilds = client.guilds.cache;
    var command: any;

    guilds.forEach(async (guild: any) => {
        command = await guild.commands.set(commands);

        if (command) {
            console.log(`Slash commands created.`);
        }
    });

});


export default client;