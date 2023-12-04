import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';
import { getAllTeamMembers } from './teams.service';

export const addChannel = (teamId, channelName, isPublic, members) => {

    const formattedMembers = {};
    isPublic
        ? getAllTeamMembers(teamId).then(teamMembers => teamMembers.map(teamMember => (formattedMembers[teamMember] = true)))
        : members.map(memberHandle => (formattedMembers[memberHandle] = true));

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
    set(ref(db, `teams/${teamId}/channels/${channelId}`), {});
    set(ref(db, `channels/${channelId}`), {});
}

export const createDefaultChannel = (teamId) => addChannel(teamId, 'General', true);

export const getGeneralChannel = (teamId) => getChannelInTeamByName(teamId, 'General')
    .then(answer => answer !== 'No such channel'
        ? answer
        : createDefaultChannel(teamId)
            .then(channel => channel)
    );

export const setChannelUsers = (channelId, users) => set(ref(db, `channels/${channelId}/members`),
    {
        ...users,
    }
);

export const addChannelUser = (channelId, user) => getChannelById(channelId)
    .then(channel => setChannelUsers(channelId, { ...channel.members, user }));

export const removeChannelUser = (channelId, user) => getChannelById(channelId)
    .then(channel => {
        const fixedusers = {};
        Object.keys(channel.members).filter(member => member !== user).map(member => fixedusers[member] = true);
        setChannelUsers(channelId, fixedusers);
    });

export const getLiveChannelsByTeam = (teamId) => onValue(
    ref(db, `teams/${teamId}/channels`),
    snapshot => Object.keys(snapshot.exists() ? snapshot.val() : {})
);

export const getAllChannelsByTeam = (teamId) => get(ref(db, `teams/${teamId}/channels`))
    .then(snapshot => Object.keys(snapshot.exists() ? snapshot.val() : {})); // always true

export const getAllPublicChannelsByTeam = (teamId) => getAllChannelsByTeam(teamId)
    .then(snapshot => Promise.all(Object.keys(snapshot.exists() ? snapshot.val() : {})
        .map(channelId => getChannelById(channelId)))
        .then(answer => answer.val())
        .then(channels => channels.filter(channel => channel.isPublic)));

export const getAllPrivateChannelsByTeam = (teamId) => getAllChannelsByTeam(teamId)
    .then(snapshot => Promise.all(Object.keys(snapshot.exists() ? snapshot.val() : {})
        .map(channelId => getChannelById(channelId)))
        .then(answer => answer.val())
        .then(channels => channels.filter(channel => !channel.isPublic)));

export const getChannelById = (channelId) => get(ref(db, `channels/${channelId}`))
    .then(snapshot => snapshot.exists() ? snapshot.val() : {});

export const getChannelInTeamByName = (teamId, channelName) =>
    getAllChannelsByTeam(teamId)
        .then(channelIds => Promise.all(channelIds.map(channelId => getChannelById(channelId)))
            .then(channels => {
                const filtered = channels.filter(channel => channel.name === channelName)
                return filtered.length ? filtered[0].id : 'No such channel';
            }));

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
