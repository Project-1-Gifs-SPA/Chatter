import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';
import { getAllTeamMembers } from './teams.service';

export const addChannel = (teamId, channelName, isPublic, members) => {

    console.table(members);

    const formattedMembers = {};
    isPublic
        ? getAllTeamMembers(teamId).then(teamMembers => teamMembers.map(teamMember => (formattedMembers[teamMember] = true)))
        : members.map(memberHandle => (formattedMembers[memberHandle] = true));

    console.log(formattedMembers);

    return push(ref(db, 'channels'), {})
        .then(response => {
            set(ref(db, `channels/${response.key}`),
                isPublic
                    ? {
                        name: channelName,
                        createdOn: Date.now(),
                        isPublic: true,
                        members: {
                            ...formattedMembers,
                        },
                        id: response.key,
                    }
                    : {
                        name: channelName,
                        createdOn: Date.now(),
                        isPublic: false,
                        members: {
                            ...formattedMembers,
                        },
                        id: response.key,
                    });
            return update(ref(db), {
                [`teams/${teamId}/channels/${response.key}`]: true,
            })
                .then(() => {
                    return response.key;
                });
        });
}

export const removeChannel = (teamId, channelId) => {
    console.log(set(ref(db, `teams/${teamId}/channels/${channelId}`), {}));
    console.log(set(ref(db, `channels/${channelId}`), {}));
}

export const createDefaultChannel = (teamId) => {
    return addChannel(teamId, 'General', true);
}

export const getGeneralChannel = (teamId) => {
    return getChannelInTeamByName(teamId, 'General')
        .then(answer => answer !== 'No such channel'
            ? answer
            : createDefaultChannel(teamId)
                .then(channel => channel)
        );
}

export const setChannelUsers = (channelId, users) => {
    return set(ref(db, `channels/${channelId}/members`),
        {
            ...users,
        }
    );
}

export const addChannelUser = (channelId, newUser) => {
    return setChannelUsers(channelId, { ...getChannelById(channelId).members, newUser })
}

export const getLiveChannelsByTeam = (teamId) => {
    return onValue(
        ref(db, `teams/${teamId}/channels`),
        snapshot => Object.keys(snapshot.exists() ? snapshot.val() : {})
    );
}

export const getAllChannelsByTeam = (teamId) => {
    return get(ref(db, `teams/${teamId}/channels`))
        .then(snapshot => Object.keys(snapshot.exists() ? snapshot.val() : {})); // always true
}

export const getChannelById = (channelId) => {
    return get(ref(db, `channels/${channelId}`))
        .then(snapshot => snapshot.exists() ? snapshot.val() : {});
}

// export const getChannelInTeamByName = (teamId, channelName) => {
//     return getAllChannelsByTeam(teamId)
//         .then(channelIds => Promise.all(channelIds.map(channelId => getChannelById(channelId))
//             .then(channels => {
//                 const filtered = channels.filter(channel => channel.name === channelName ? channel : false);
//                 return filtered.length ? filtered[0].id : 'No such channel';
//             })));
// }

export const getChannelInTeamByName = (teamId, channelName) =>
    getAllChannelsByTeam(teamId)
        .then(channelIds => Promise.all(channelIds.map(channelId => getChannelById(channelId)))
            .then(channels => {
                const filtered = channels.filter(channel => channel.name === channelName)
                return filtered.length ? filtered[0].id : 'No such channel';
            }));

// export const getChannelInTeamByName = (teamId, channelName) =>
//     getAllChannelsByTeam(teamId)
//         .then(async channelIds => {
//             const channels = await Promise.all(channelIds.map(channelId => getChannelById(channelId)));
//             const filtered = channels.filter(channel => channel.name === channelName ? channel : false);
//             return filtered.length ? filtered[0].id : 'No such channel';
//         });

export const getChannelsInTeamByUser = (teamId, userHandle) =>
    getAllChannelsByTeam(teamId)
        .then(channelIds =>
            Promise.all(channelIds.map(channelId => getChannelById(channelId)))
                .then(channels => channels.filter(channel => channel.members.includes(userHandle) ? channel : false))
        );

export const getChannelIdsInTeamByUser = (teamId, userHandle) => getAllChannelsByTeam(teamId)
    .then(channelIds => Promise.all(channelIds.map(channelId => getChannelById(channelId)))
        .then(channels => channels.filter(channel => channel?.members
            ? channel.members[userHandle] || channel.isPublic
                ? channel : false
            : false).map(channel => channel.id)));
