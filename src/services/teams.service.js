import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';

const fromTeamsDocument = (snapshot) => {
    const teamsDocument = snapshot.val();

    return Object.keys(teamsDocument).map(key => {
        const team = teamsDocument[key];

        return {
            ...team,
            id: key,
            createdOn: new Date(team.createdOn),
            members: team.members ? Object.keys(team.members) : [],
            channels: team.channels ? Object.keys(team.channels) : [],
        };
    });
}

export const addTeam = (handle, name) => {
    return push(ref(db, 'teams'), {})
        .then(response => {
            const members = {};
            members[handle] = true;
            set(ref(db, `teams/${response.key}`),
                {
                    name: name,
                    createdOn: Date.now(),
                    members,
                    owner: handle,
                    id: response.key,
                });
            return update(ref(db), {
                [`users/${handle}/myTeams/${response.key}`]: true,
            })
                .then(() => {
                    return response.key;
                });
        });
}

export const getTeamName = (teamId) => {
    return get(ref(db, `teams/${teamId}/name`))
        .then(snapshot => {
            if (!snapshot.exists()) {
                return '';
            }

            return snapshot.val();
        });
}

export const getLiveTeamInfo = (listenFn, teamId) => {
    return onValue(
        ref(db, `teams/${teamId}`),
        snapshot => {
            const data = snapshot.exists() ? snapshot.val() : {};
            listenFn(data);
        });
};

export const getLiveTeamMembers = (listenFn, teamId) => {
    return onValue(
        ref(db, `teams/${teamId}/members`),
        snapshot => {
            const data = snapshot.exists() ? snapshot.val() : {};
            const result = Object.keys(data);

            listenFn(result);
        }
    )
}

export const getLiveAllTeams = (listenFn) => {
    return onValue(
        ref(db, 'teams'),
        snapshot => {
            const data = snapshot.exists() ? snapshot.val() : {};
            const result = Object.values(data);

            listenFn(result);
        }
    )
}

export const getAllTeamMembers = (teamId) => {
    return get(ref(db, `teams/${teamId}/members`))
        .then(snapshot => {
            if (!snapshot.exists()) {
                return [];
            }
            return Object.keys(snapshot.val());
        })
}

export const getAllTeams = () => {
    return get(ref(db, 'teams'))
        .then(snapshot => {
            if (!snapshot.exists()) {
                return [];
            }

            return fromTeamsDocument(snapshot);
        });
};

export const findTeamByName = (name) => {
    return get(query(ref(db, 'teams'), orderByChild('name'), equalTo(name)));
};


export const getTeamById = (teamId) => get(ref(db, `teams${teamId}`));

export const addTeamMember = (handle, teamId) => {
    const teamRef = ref(db, `/teams/${teamId}/members/${handle}`);

    return get(teamRef)
        .then((teamSnapshot) => {
            if (teamSnapshot.exists()) {
                return Promise.reject(alert ("User is already a member of this team!"));
            } else {
                const updateTeam = {};
                updateTeam[`/teams/${teamId}/members/${handle}`] = true;
                updateTeam[`/users/${handle}/teams/${teamId}`] = true;

                return update(ref(db), updateTeam);
            }
        })
        .catch((error) => {
            console.error("Error adding team member:", error);
            return Promise.reject("Error adding team member");
        });
}



export const updateTeamPhoto = (teamId, photoURL) => {
    const changePicture = {};
    changePicture[`/teams/${teamId}/photoURL`] = photoURL;
  
    return update(ref(db), changePicture);
  }