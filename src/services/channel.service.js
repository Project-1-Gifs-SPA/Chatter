import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';
import { getAllTeamMembers } from './teams.service';

export const addChannel = (teamId, channelName, isPublic, owner, creator, members) => {

    const formattedMembers = {};
    formattedMembers[owner] = true;
    formattedMembers[creator] = true;
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

// export const createDefaultChannel = (teamId) => addChannel(teamId, 'General', true);

export const createDefaultChannel = (teamId, members) => {
    if (!teamId) return;
    return addChannel(teamId, 'General', true, members);
}

// return get(ref(db, `teams/${teamId}/channels`))
//     .then(async snapshot => {
//         const channelIds = Object.keys(snapshot.exists() ? snapshot.val() : [await createDefaultChannel(teamId, await getAllTeamMembers(teamId))]);
//         const channels = channelIds.map(async (channelId) => await getChannelById(channelId));
//         console.table(channelIds);
//         console.table(channels);

//         return channels.length === 1
//             ? channels[0]
//             : channels.filter(channel => channel.name === 'General' ? channel : false)[0];
//     });


// Object.keys(channelIds)
//     .filter(channelId => getChannelById(channelId)
//         .then(channel => channel.name === 'General' ? channel : null)

export const getGeneralChannel = (teamId) => getChannelInTeamByName(teamId, 'General')
    .then(answer => answer !== 'No such channel'
        ? answer
        : getAllTeamMembers(teamId)
            .then(teamMembers => createDefaultChannel(teamId, teamMembers))
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

export const getAllChannelsByTeam = (teamId) => get(ref(db, `teams/${teamId}/channels`))
    .then(snapshot => Object.keys(snapshot.exists() ? snapshot.val() : {})); // always true

export const getAllPublicChannelsByTeam = (teamId) => getAllChannelsByTeam(teamId)
    .then(snapshot => Promise.all(snapshot.map(channelId => getChannelById(channelId)))
        // .then(answer => answer.val())
        .then(channels => channels.filter(channel => channel.isPublic)));

export const getAllPrivateChannelsByTeam = (teamId) => getAllChannelsByTeam(teamId)
    .then(snapshot => Promise.all(Object.keys(snapshot.exists() ? snapshot.val() : {})
        .map(channelId => getChannelById(channelId)))
        .then(answer => answer.val())
        .then(channels => channels.filter(channel => !channel.isPublic)));

export const getChannelById = (channelId) => get(ref(db, `channels/${channelId}`))
    .then(snapshot => snapshot.exists() ? snapshot.val() : {});

export const getChannelInTeamByName = (teamId, channelName) => getAllChannelsByTeam(teamId)
    .then(channelIds => Promise.all(channelIds.map(channelId => getChannelById(channelId)))
        .then(channels => {
            const filtered = channels.filter(channel => channel.name === channelName)
            return filtered.length ? filtered[0].id : 'No such channel';
        }));

export const getChannelsInTeamByUser = (teamId, userHandle) => getAllChannelsByTeam(teamId)
    .then(channelIds => Promise.all(channelIds.map(channelId => getChannelById(channelId)))
        .then(channels => channels.filter(channel => Object.keys(channel.members).includes(userHandle) ? channel : false))
    );

export const getChannelIdsInTeamByUser = (teamId, userHandle) => getAllChannelsByTeam(teamId)
    .then(channelIds => Promise.all(channelIds.map(channelId => getChannelById(channelId)))
        .then(channels => channels.filter(channel => channel?.members
            ? channel.members[userHandle] || channel.isPublic // remove `|| channel.isPublic` to not show if member left, when person is added in team add them in every public channel
                ? channel : false
            : false)
            .map(channel => channel.id)));

// export const getAllChannelsByTeam = (teamId) => {
//     return get(ref(db, `teams/${teamId}/channels`))
//         .then(snapshot => Object.keys(snapshot.exists() ? snapshot.val() : {})); // always true
// }

// export const getChannelById = (channelId) => {
//     return get(ref(db, `channels/${channelId}`))
//         .then(snapshot => snapshot.exists() ? snapshot.val() : {});
// }
// export const getChannelInTeamByName = (teamId, channelName) => {
//     return getAllChannelsByTeam(teamId)
//         .then(async channelIds => {
//             const channels = await Promise.all(channelIds.map(channelId => getChannelById(channelId)));
//             // const channels = {};
//             // await channelIds.map(async channelId => {
//             //     const answer = await getChannelById(channelId);
//             //     channels[answer.name] = answer;
//             //     console.log(answer);
//             //     console.log(channels[answer.name]);
//             //     console.log(channels[channelName]);
//             // });
//             // console.log(channels[channelName]);
//             console.log(channelIds);
//             console.log(channels);
//             console.table(channels);
//             const filtered = channels.filter(channel => channel.name === channelName ? channel : false);
//             console.log(filtered);
//             // console.log(filtered ? filtered[0].id : 'No such channel');
//             return filtered.length ? filtered[0].id : 'No such channel';
//             // console.log(channelName);
//             // console.log(`${channels}[${channelName}]`);
//             // console.log(Object.keys(channels));
//             // console.log(channels[channelName]);
//             // return channels[channelName] ? channels[channelName] : 'No such channel';
//         });
// }

// export const getChannelInTeamByName = (teamId, channelName) => {
//     return getAllChannelsByTeam(teamId)
//         .then(async channelIds => {
//             const channels = await channelIds.map(async channelId => {
//                 const answer = await getChannelById(channelId);
//                 return answer;
//             });
//             const filtered = channels.filter(channel => channel.name === channelName ? channel : false);
//             console.log(channels.id);
//             console.log(channelIds);
//             console.log(channels);
//             console.log(filtered);
//             console.log(filtered ? filtered[0] : 'No such channel');
//             return filtered.length ? filtered[0] : 'No such channel';
//         });
// }

export const editChannelMessage = (content, channelId, msgId) => {
    return update(
        ref(db, `channels/${channelId}/msgs/${msgId}`),
        {
            body: content
        }
    )
}

export const addChannelMsgStatusEdited = (channelId, msgId) => {
    const ChannelMsgStatus = {};
    ChannelMsgStatus[`channels/${channelId}/msgs/${msgId}/edited`] = true;

    return update(ref(db), ChannelMsgStatus);
}

export const addChannelReaction = (reaction, userHandle, channelId, msgId) => {
    const channelReaction = {};
    channelReaction[`channels/${channelId}/msgs/${msgId}/reactions/${reaction}/${userHandle}`] = true;
    return update(ref(db), channelReaction);
}

export const removeChannelReaction = (reaction, userHandle, channelId, msgId) => {
    const channelReaction = {};
    channelReaction[`channels/${channelId}/msgs/${msgId}/reactions/${reaction}/${userHandle}`] = null;
    return update(ref(db), channelReaction);
}

export const getLiveChannelSeenBy = (listenFn, channelId) => {
    return onValue(
        ref(db, `channels/${channelId}/seenBy`),
        snapshot => {
            const data = snapshot.exists() ? snapshot.val() : {};
            const result = Object.keys(data);

            listenFn(result);
        }
    )
}

export const getLiveChannelMembers = (listenFn, channelId) => {
    return onValue(
        ref(db, `channels/${channelId}/members`),
        snapshot => {
            const data = snapshot.exists() ? snapshot.val() : {};
            const result = Object.keys(data);

            listenFn(result);
        }
    )
}


export const getLiveChannelInfo = (listenFn, channelId) => {
    return onValue(
        ref(db, `channels/${channelId}`),
        snapshot => {
            const data = snapshot.exists() ? snapshot.val() : {};
            listenFn(data);
        });
};


export const getLiveChannelsByTeam = (listenFn, teamId) =>{
return onValue(
    ref(db, `teams/${teamId}/channels`),
    snapshot => {
        const data = snapshot.exists() ? Object.keys(snapshot.val()) : [];
        listenFn(data);
    })
}


export const filterChannelsByUser = (channels, userHandle) => {
    return Promise.all(channels.map(channelId => getChannelById(channelId)))
        .then(channels => channels.filter(channel => Object.keys(channel.members).includes(userHandle) ? channel : false))
}
    