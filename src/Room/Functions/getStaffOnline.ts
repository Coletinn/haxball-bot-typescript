import client from '../../Client/client';
const config = require('../../../config.json');

const staff: { [key: string]: string } = {
    ceo: config.staffId.ceo,
    gerente: config.staffId.gerente,
    admin: config.staffId.admin,
    mod: config.staffId.mod,
};

export function getStaffOnlineInfo() {
    const onlineCounts: any = {};

    for (const role in staff) {
        const roleId = staff[role];
        const roleObj = client.guilds.cache.get("1160229759226224771").roles.cache.get(roleId);

        if (roleObj) {
            const membersWithRole = roleObj.members.filter((member: any) => (
                (member.presence.status === 'online' || member.presence.status === 'dnd') &&
                member.roles.cache.has(roleId)
            ));
            onlineCounts[role] = membersWithRole.size;
        } else {
            onlineCounts[role] = 0;
        }
    }

    let response = 'Staff online: ';
    for (const role in onlineCounts) {
        response += `${role}: ${onlineCounts[role]}, `;
    }
    response = response.slice(0, -2); // Removendo a vírgula extra no final

    return response;
}
