import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';

export const addChannel = (teamId, members, name) => {
    return push(ref(db, 'channels'), {})
        .then(response => {
            set(ref(db, `channels/${response.key}`),
                {
                    name,
                    createdOn: Date.now(),
                    members: {
                        ...members,
                        // handle: true,
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

export const removeChannel = () => {

}

export const createDefaultChannel = (teamid) => {
    return addChannel(teamid, 'General');
}

export const setChannelUsers = (channelName, members) => {
    return set(ref(db, `channels/${channelName}/members`),
        {
            ...members,
        }
    );
}

export const getTeamChannels = () => {

}