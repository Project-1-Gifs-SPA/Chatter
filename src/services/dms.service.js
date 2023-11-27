import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createDM = (partner, handle) => {
    return push(ref(db, 'dms'),{})
    .then(response=>{
        return addMembersToDM(partner,handle, response.key)
    });
};


 const addMembersToDM = (partner, handle, id) => {
    const updates = {};

    updates[`dms/${id}/members/${partner}`] = true;
    updates[`dms/${id}/members/${handle}`] = true;
    updates[`dms/${id}/id`] = id;
    updates[`users/${partner}/DMs/${handle}`] = id;
    updates[`users/${handle}/DMs/${partner}`] = id;

    update(ref(db), updates);
    return id;
}

export const addDmMember = (newMember, dmId) => {
    const addDmMember = {};
    addDmMember[`dms/${dmId}/members/${newMember}`] = true;

    return update(ref(db), addDmMember);
}

export const createGroupDM = (partner, handle, newMember, dmId ) => {
    const updates = {};

    updates[`users/${handle}/DMs/${partner[0]}`] = null;
    updates[`users/${handle}/groupDMs/${dmId}`] = true;
    updates[`users/${partner[0]}/DMs/${handle}`] = null;
    updates[`users/${partner[0]}/groupDMs/${dmId}`] = true;
    updates[`users/${newMember}/groupDMs/${dmId}`] = true;

    return update(ref(db), updates);
};

export const getLiveGroupDMs = (listenFn, handle) => {
    return onValue(ref(db, `users/${handle}/groupDMs`)).then((snapshot)=>{
        const data = snapshot.exists() ? snapshot.val() : {};

        listenFn(data);
    });
}

export const getLiveDMs = (listenFn, dmId) => {
    return onValue(ref(db, `dms/${dmId}`), (snapshot)=>{
        const data = snapshot.exists() ? snapshot.val() : {};

        listenFn(data);
    });
}

export const deleteMember = (dmId, member) => {
    const updateMember = {};
    updateMember[`/users/${member}/groupDMs/${dmId}`] = null;
    updateMember[`dms/${dmId}/members/${member}`] = null;

    return update(ref(db), updateMember);
}

export const editDMmessage = (content, dmId, msgId) => {
    return update(
        ref(db,`dms/${dmId}/msgs/${msgId}`),
        {
          body:content
        }
      )
}

export const getDMbyId = (dmId) => {
    return get(ref(db,`dms/${dmId}`))
    .then(snapshot => snapshot.exists() ? snapshot.val() : {});
}