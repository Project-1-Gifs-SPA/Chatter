import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';
import { getAllTeamMembers } from './teams.service';

export const addChannel = (teamId, members, channelName) => {

    const formattedMembers = {};
    members.map(member => (formattedMembers[member.handle] = true));
    // console.table(formattedMembers);

    return push(ref(db, 'channels'), {})
        .then(response => {
            console.log(response);
            console.table(response);
            console.log(channelName);
            console.log(members);
            console.table(members);
            console.log(formattedMembers);
            console.table(formattedMembers);
            console.log(response.key);
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

export const removeChannel = (teamId, channelName) => {

}

export const createDefaultChannel = (teamId, members) => {
    if(!teamId) return;
    return addChannel(teamId, members, 'General');
}

export const getGeneralChannel = (teamId) => {
    return getChannelInTeamByName(teamId, 'General')
        .then(async answer =>  answer !== 'No such channel'
                ? answer
                : await createDefaultChannel(teamId, await getAllTeamMembers())
        );
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
            // const channels = {};
            // await channelIds.map(async channelId => {
            //     const answer = await getChannelById(channelId);
            //     channels[answer.name] = answer;
            //     console.log(answer);
            //     console.log(channels[answer.name]);
            //     console.log(channels[channelName]);
            // });
            // console.log(channels[channelName]);
            console.log(channelIds);
            console.log(channels);
            console.table(channels);
            const filtered = channels.filter(channel => channel.name === channelName ? channel : false);
            console.log(filtered);
            // console.log(filtered ? filtered[0].id : 'No such channel');
            return filtered.length ? filtered[0].id : 'No such channel';
            // console.log(channelName);
            // console.log(`${channels}[${channelName}]`);
            // console.log(Object.keys(channels));
            // console.log(channels[channelName]);
            // return channels[channelName] ? channels[channelName] : 'No such channel';
        });
}

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
        ref(db,`channels/${channelId}/msgs/${msgId}`),
        {
          body:content
        }
      )
}

export const addChannelMsgStatusEdited = (channelId, msgId) => {
    const ChannelMsgStatus = {};
    ChannelMsgStatus[`channels/${channelId}/msgs/${msgId}/edited`] = true;

    return update(ref(db), ChannelMsgStatus);
}

export const addChannelReaction = (reaction,userHandle, channelId, msgId) => {
    const channelReaction = {};
    channelReaction[`channels/${channelId}/msgs/${msgId}/reactions/${reaction}/${userHandle}`] = true;
    return update(ref(db), channelReaction);
}

export const removeChannelReaction = (reaction,userHandle, channelId, msgId) => {
    const channelReaction = {};
    channelReaction[`channels/${channelId}/msgs/${msgId}/reactions/${reaction}/${userHandle}`] = null;
    return update(ref(db), channelReaction);
}