import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';



const fromTeamsDocument = (snapshot) => {
    const teamsDocument = snapshot.val();

    return Object.keys(teamsDocument).map(key=> {
        const team = teamsDocument[key];

        return{
            ...team,
            id: key,
            createdOn: new Date(team.createdOn),
            members: team.members? Object.keys(team.members) : [],
            channels: team.channels? Object.keys(team.channels): [],
        };
    });
}


export const addTeam = (handle, name) => {
    return push(ref(db, 'teams'), {})
    .then(response=>{
        const members = {};
        members[handle] = true;
        set(ref(db,`teams/${response.key}`),
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
        .then(()=>{
            return response.key;
        });
    });
   
}

export const getLiveTeamInfo = (listenFn, teamId) => {
    return onValue(
        ref(db, `teams/${teamId}`),
        snapshot=> {
            const data = snapshot.exists() ? snapshot.val() : {};
            listenFn(data);
        });
};

export const getAllTeamMembers = (teamId) => {
    return get(ref(db,`teams/${teamId}/members`))
    .then(snapshot=>{
        if(!snapshot.exists()){
            return [];
        }
        return Object.keys(snapshot.val());
    })
}

export const getAllTeams = () => {
    return get(ref(db, 'teams'))
    .then(snapshot=>{
        if(!snapshot.exists()){
            return [];
        }

        return fromTeamsDocument(snapshot);
    });
};

export const findTeamByName = (name) => {
    return get(query(ref(db,'teams'), orderByChild('name'), equalTo(name)));
};





