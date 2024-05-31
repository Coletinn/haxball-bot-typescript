<<<<<<< HEAD
import { cores } from '../Config/cores';
import { room, teamR, teamB } from '../../../room';
import { buscarUniformePorNome, EquipeUniforme } from '../Config/uniformes';

export async function chooseUni(player: any, words: any) {
    if (player.admin || teamR[0].id === player.id || teamB[0].id === player.id) {
        if (words[1]) {
            let uni: EquipeUniforme | undefined = await buscarUniformePorNome(words[1]);

            if (uni && uni.uniform) {
                let n = words[2] ? parseInt(words[2])-1 : 0; //Pensei num Math.min(n, 1) caso queiramos deixar digitar !Uni trn 3, 4, 5, etc.
                if (n < 0 || n > 1) {
                    room.sendAnnouncement(`${player.name} você deve usar os uniformes entre 1 e 2`, player.id, cores.vermelho, "bold", 2);
                    return false;
                }
                room.setTeamColors(player.team, uni.uniform[n].angle, uni.uniform[n].avatarColor, uni.uniform[n].mainColor);
                room.sendAnnouncement(`${player.name} escolheu o uniforme ${uni.longName} ${n+1}!`, null, cores.vermelho, "bold");
                return false
            } else {
                room.sendAnnouncement(`${player.name} não encontrei nenhum uniforme com esse nome. Digite "!uniformes" para ver todos os uniformes!`, player.id, cores.vermelho, "bold", 2);
                return false;
            }
        } else {
            room.sendAnnouncement(`${player.name} você não expecificou o uniforme corretamente!`, player.id, cores.vermelho, "bold", 2);
            return false;
        }
    }
=======
import { cores } from '../Config/cores';
import { room, teamR, teamB } from '../../../room';
import { buscarUniformePorNome, EquipeUniforme } from '../Config/uniformes';

export async function chooseUni(player: any, words: any) {
    if (player.admin || teamR[0].id === player.id || teamB[0].id === player.id) {
        if (words[1]) {
            let uni: EquipeUniforme | undefined = await buscarUniformePorNome(words[1]);

            if (uni && uni.uniform) {
                let n = words[2] ? parseInt(words[2])-1 : 0; //Pensei num Math.min(n, 1) caso queiramos deixar digitar !Uni trn 3, 4, 5, etc.
                if (n < 0 || n > 1) {
                    room.sendAnnouncement(`${player.name} Você deve usar os uniformes entre 1 e 2.`, player.id, cores.vermelho, "bold", 2);
                    return false;
                }
                room.setTeamColors(player.team, uni.uniform[n].angle, uni.uniform[n].avatarColor, uni.uniform[n].mainColor);
                room.sendAnnouncement(`${player.name} Escolheu o uniforme ${uni.longName} ${n+1}!`, null, cores.vermelho, "bold");
                return false
            } else {
                room.sendAnnouncement(`${player.name} Não encontrei nenhum uniforme com esse nome. Digite "!uniformes" para ver todos os uniformes!`, player.id, cores.vermelho, "bold", 2);
                return false;
            }
        } else {
            room.sendAnnouncement(`${player.name} Você não expecificou o uniforme corretamente!`, player.id, cores.vermelho, "bold", 2);
            return false;
        }
    }
>>>>>>> 20b36bf5495b8c97e8866efdce87966f8a6a9add
}