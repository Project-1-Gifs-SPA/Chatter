import { get, onValue, push, ref, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createDM = (partner, handle) =>
  push(ref(db, 'dms'), {})
    .then(response => addMembersToDM(partner, handle, response.key))
    .catch(e => console.error(e));

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
  addDmMember[`users/${newMember}/groupDMs/${dmId}`] = true;

  return update(ref(db), addDmMember);
}

export const createGroupDM = (partner, handle, newMember, dmId) => {
  const updates = {};

  updates[`users/${handle}/DMs/${partner}`] = null;
  updates[`users/${handle}/groupDMs/${dmId}`] = true;
  updates[`users/${partner}/DMs/${handle}`] = null;
  updates[`users/${partner}/groupDMs/${dmId}`] = true;
  updates[`users/${newMember}/groupDMs/${dmId}`] = true;
  updates[`dms/${dmId}/members/${newMember}`] = true;

  return update(ref(db), updates);
};

export const getLiveGroupDMs = (listenFn, handle) =>
  onValue(
    ref(db, `users/${handle}/groupDMs`), (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : {};

      listenFn(data);
    });

export const getLiveUserDMs = (listenFn, handle) =>
  onValue(
    ref(db, `users/${handle}/DMs`), (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : {};

      listenFn(data);
    });

export const getDMById = (dmId) =>
  get(ref(db, `dms/${dmId}`));

export const getLiveDMs = (listenFn, dmId) =>
  onValue(
    ref(db, `dms/${dmId}`), (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : {};

      listenFn(data);
    });

export const getLiveGroupDMsMembers = (listenFn, dmId) =>
  onValue(ref(db, `dms/${dmId}/members`), (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : {};

    listenFn(data);
  });

export const deleteGroupMember = (dmId, member) => {
  const updateMember = {};
  updateMember[`/users/${member}/groupDMs/${dmId}`] = null;
  updateMember[`dms/${dmId}/members/${member}`] = null;

  return update(ref(db), updateMember);
}

export const editDMmessage = (content, dmId, msgId) =>
  update(ref(db, `dms/${dmId}/msgs/${msgId}`),
    {
      body: content
    }
  );

export const getDMbyId = (dmId) => get(ref(db, `dms/${dmId}`))
  .then(snapshot => snapshot.exists() ? snapshot.val() : {})
  .catch(e => console.error(e));

export const getLiveDmMembers = (listenFn, dmId) =>
  onValue(
    ref(db, `dms/${dmId}/members`),
    snapshot => {
      const data = snapshot.exists() ? snapshot.val() : {};
      const result = Object.keys(data);

      listenFn(result);
    }
  );

export const addDMstatusEdited = (dmId, msgId) => {
  const DmStatus = {};
  DmStatus[`dms/${dmId}/msgs/${msgId}/edited`] = true;

  return update(ref(db), DmStatus);
}

export const addDmReaction = (reaction, userHandle, dmId, msgId) => {
  const dmReaction = {};
  dmReaction[`dms/${dmId}/msgs/${msgId}/reactions/${reaction}/${userHandle}`] = true;

  return update(ref(db), dmReaction);
}

export const removeDMReaction = (reaction, userHandle, dmId, msgId) => {
  const dmReaction = {};
  dmReaction[`dms/${dmId}/msgs/${msgId}/reactions/${reaction}/${userHandle}`] = null;

  return update(ref(db), dmReaction);
}

export const setDmSeenBy = (dmId, user) => {
  const updates = {};
  if (!dmId) return;

  updates[`dms/${dmId}/seenBy/${user}`] = true;

  return update(ref(db), updates);
};

export const setNotSeenDm = (dmId) => {
  const updates = {};
  if (!dmId) return;

  updates[`dms/${dmId}/seenBy`] = null;

  return update(ref(db), updates);
}

export const getLiveIsDMSeen = (listenFn, dmId) =>
  onValue(
    ref(db, `dms/${dmId}/seenBy`),
    snapshot => {
      const data = snapshot.exists() ? snapshot.val() : {};
      const result = Object.keys(data);

      listenFn(result);
    }
  );
