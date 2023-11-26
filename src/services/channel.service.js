import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';
import { getAllTeamMembers } from './teams.service';

export const addChannel = (teamId, members, channelName) => {

    const formattedMembers = {};
    members.map(member => (formattedMembers[member.handle] = true));

    return push(ref(db, 'channels'), {})
        .then(response => {
            set(ref(db, `channels/${response.key}`),
                {
                    name: channelName,
                    createdOn: Date.now(),
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

export const createDefaultChannel = (teamId, members) => {
    return addChannel(teamId, members, 'General');
}

export const getGeneralChannel = (teamId) => {
    return getChannelInTeamByName(teamId, 'General')
        .then(async answer => answer !== 'No such channel'
            ? answer
            : await createDefaultChannel(teamId, await getAllTeamMembers())
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

export const getChannelInTeamByName = (teamId, channelName) => {
    return getAllChannelsByTeam(teamId)
        .then(async channelIds => {
            const channels = await Promise.all(channelIds.map(channelId => getChannelById(channelId)));
            const filtered = channels.filter(channel => channel.name === channelName ? channel : false);
            return filtered.length ? filtered[0].id : 'No such channel';
        });
}
