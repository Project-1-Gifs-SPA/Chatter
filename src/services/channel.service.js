import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';

export const addChannel = (teamId, members, name) => {

    const formattedMembers = members.map(member => ({ [member]: true }));
    console.table(formattedMembers);

    return push(ref(db, 'channels'), {})
        .then(response => {
            set(ref(db, `channels/${response.key}`),
                {
                    name,
                    createdOn: Date.now(),
                    members: {
                        ...formattedMembers, /* create function */
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
    return addChannel(teamId, members, 'General');
}

export const setChannelUsers = (channelName, members) => {
    return set(ref(db, `channels/${channelName}/members`),
        {
            ...members,
        }
    );
}

export const getLiveChannelsByTeam = (teamId) => {
    return onValue(
        ref(db, `teams/${teamId}/channels`),
        snapshot => Object.keys(snapshot.exists() ? snapshot.val() : {})
    );
}

export const getChannelById = (channelId) => {
    return get(ref(db, `channels/${channelId}`))
        .then(snapshot => snapshot.exists() ? snapshot.val() : {});
}
