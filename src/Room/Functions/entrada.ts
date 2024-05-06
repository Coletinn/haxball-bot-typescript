import client from '../../Client/client';
import { roomName } from '../../../room';
import { roomEntradasChannel } from '../../../room';

export function entrada(player: any) {
    if (!player) return;

    var name: any = player.name;
    var auth: any = player.auth;
    var conn: any = player.conn;
    var time = new Date();
    var formattedBanEndTime = time.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });

    var ipv4 = conn.match(/.{1,2}/g).map(function (v: any) {
        return String.fromCharCode(parseInt(v, 16));
    }).join('');

    var content: any = `${name} Entrou na sala!` + "\n" + "```" + "📝 Informações do jogador 📝" + "\n\n" +

        `${roomName} ` + "👑" + "\n\n" +
        "- Nick: " + name + "\n" +
        "- Conn: " + conn + "\n" +
        "- Auth: " + auth + "\n" +
        "- Ipv4 " + (ipv4) + "\n" +
        "- Data: " + `${formattedBanEndTime}` + "```";

    if (roomEntradasChannel) {
        client.send(roomEntradasChannel, content);
    }
};