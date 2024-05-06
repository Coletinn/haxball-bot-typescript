import client from '../../Client/client';
import { room, goalName, passName } from '../../../room';
import { Message, PermissionResolvable } from 'discord.js';

const { AttachmentBuilder, Client, Events, GatewayIntentBits } = require('discord.js');
const Canvas = require('canvas');
const { request } = require('undici');
const path = require('path');
const channelId = "1163277068197441636";

let gol: any;
let assis: any;
let gc: any;
let gs: any;
let time: any;

export function data(golSet?: any, assisSet?: any, gcSet?: any, gsSet?: any, timeSet?: any) {
    gol = golSet ? golSet : false || gol;
    assis = assisSet ? assisSet : false || assis;
    gc = gcSet ? gcSet : false || gc;
    gs = gsSet ? gsSet : false || gs;
    time = timeSet ? timeSet : false || time;

    createGoalImage();
}

export function createGoalImage() {
    client.on('messageCreate', async (message: Message) => {
        try {
            const channel = client.channels.cache.get(channelId);

            if (channel) {
                const imageUrl = '../../../Assets/Images/goal.png';
                const image = await Canvas.loadImage(imageUrl);

                const canvas = Canvas.createCanvas(image.width, image.height);
                const context = canvas.getContext('2d');

                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0);
                context.font = `bold 300px Bebas Neue`;
                context.fillStyle = '#FFFFFF';
                context.textAlign = 'center';
                context.strokeStyle = 'black';
                context.lineWidth = 15;

                var x = canvas.width / 2.8;
                var y = canvas.height / 3;

                const texto = 'GOOOOOOOOOOL';
                context.strokeText(texto, x, y);
                context.fillText(texto, x, y);

                y += 500;
                if (gc) {
                    context.font = `bold 150px Impact`;
                    context.strokeText(gc, x, y);
                    context.fillText(gc, x, y);
                }

                y += 500;
                if (gc && assis) {
                    context.font = `bold 200px Sans Bold`;
                    context.strokeText(`Gol de: ${gc.toUpperCase()} - Assis: ${assis.toUpperCase()}`, x, y);
                    context.fillText(`Gol de: ${gc.toUpperCase()} - Assis: ${assis.toUpperCase()}`, x, y);
                } else if (gc) {
                    context.font = `bold 200px Sans Bold`;
                    context.strokeText(`Gol de: ${gc.toUpperCase()}`, x, y);
                    context.fillText(`Gol de: ${gc.toUpperCase()}`, x, y);
                }

                var attachment = new AttachmentBuilder(await canvas.toBuffer('image/png'), { name: 'goal.png' });

                channel.send({ files: [attachment] });
            } else {
                console.error('Canal não encontrado com o ID fornecido:', channelId);
            }
        } catch (error) {
            console.error('Erro ao criar e enviar a imagem de gols:', error);
        }
    });
}