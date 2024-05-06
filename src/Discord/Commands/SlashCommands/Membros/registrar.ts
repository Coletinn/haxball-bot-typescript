const { Client, ActionRowBuilder, ModalBuilder, PermissionsBitField, GatewayIntentBits, Events, TextInputBuilder, TextInputStyle, TextBasedChannels, ButtonInteraction, CommandInteraction, ApplicationCommandType } = require('discord.js');
import { GuildMember, EmbedBuilder, PermissionResolvable, ButtonBuilder } from 'discord.js';
import client from '../../../../Client/client';
import { cores } from '../../../../Room/Config/cores';
import { error } from '../../../../Room/Config/errors';
import { room, registroDiscord, unsavedUsers, buscarUsuarioPorNome } from '../../../../../room';

var userArmazened: any;
var senhaArmazened: any;

export const registrarCommand = client.on(Events.InteractionCreate, async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'registrar') {
        var { options } = interaction;
        var member = interaction.member as GuildMember;
        var nick = options.get('nick');
        var senha = options.get('senha');

        userArmazened = nick?.value;
        senhaArmazened = senha?.value;

        if (senhaArmazened.length <= 3) {
            interaction.reply({ content: `🚫 Você precisa criar uma senha com mais de 3 caracteres!`, ephemeral: true });
        } else {
            var registrado: any = registroDiscord(userArmazened, senhaArmazened);

            const embed1 = new EmbedBuilder()
                .setDescription(`🚧 Um momento... Estamos criando a sua conta!`)
                .setColor('Red');

            await interaction.reply({ embeds: [embed1], ephemeral: true });

            const embed2 = new EmbedBuilder()
                .setDescription(`✅ Conta criada com sucesso!`)
                .addFields(
                    { name: 'Nick', value: `${userArmazened}` },
                    { name: 'Senha', value: `${senhaArmazened}` },
                    { name: 'Chave primária', value: `\`\`\`${registrado.generated}\`\`\`` },
                )
                .setColor('Green')
                .setFooter({ text: `Salve essas informações para fazer login futuramente!` });

            const embedUser = new EmbedBuilder()
                .setDescription(`✅ Conta criada com sucesso!`)
                .addFields(
                    { name: 'Nick', value: `${userArmazened}` },
                    { name: 'Senha', value: `${senhaArmazened}` },
                    { name: 'Chave primária', value: `\`\`\`${registrado.generated}\`\`\`` },
                )
                .setColor('Green')
                .setFooter({ text: `Salve essas informações para fazer login futuramente!` });


            setTimeout(() => {
                interaction.user.send(`Para fazer login na sala, use a chave primária: \`\`\`!logar ${registrado.generated}\`\`\`\n > Assim que você logar com essa chave, você poderá fazer login com a sua senha normalmente.\n > Obs: Registros feitos pelo Discord é alterado a forma de fazer login na conta. Primeiramente você deverá logar na sua conta usando o comando "!logar <chave-primária>" ao invés de usar o comando "!login". Assim que você logar na conta com a chave primária você poderá usar o comando "!login" normalmente nas próximas vezes.`)
            }, 3000);
        }
    }
});
