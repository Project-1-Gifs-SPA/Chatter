import { get, limitToFirst, onValue, orderByChild, push, query, ref, serverTimestamp, set, update } from 'firebase/database';
import { db } from '../config/firebase-config';


export const sendMessage = (channelId, handle, msg, picURL) =>
  push(ref(db, `channels/${channelId}/msgs`), {})
    .then(response => set(ref(db, `channels/${channelId}/msgs/${response.key}`),
      {
        body: msg,
        id: response.key,
        owner: handle,
        createdOn: serverTimestamp(),
        avatar: picURL
      }))
    .catch(e => console.error(e));

export const getLiveMessages = (listenFn, channelId) => {
  const q = query(
    ref(db, `/channels/${channelId}/msgs`),
    orderByChild('createdOn'),
    limitToFirst(50)
  )
  return onValue(q, listenFn);
};

export const getChat = (channelId) =>
  get(ref(db, `channels/${channelId}/msgs`))
    .then(snapshot => snapshot.exists() ? snapshot.val() : [])
    .catch(e => console.error(e));

export const sendDirectMessage = (dmId, handle, msg, picURL) =>
  push(ref(db, `dms/${dmId}/msgs`), {})
    .then(response => set(ref(db, `dms/${dmId}/msgs/${response.key}`),
      {
        body: msg,
        id: response.key,
        owner: handle,
        createdOn: serverTimestamp(),
        avatar: picURL
      }))
    .catch(e => console.error(e));

export const getDMChat = (dmId) =>
  get(ref(db, `dms/${dmId}/msgs`))
    .then(snapshot => snapshot.exists() ? snapshot.val() : {})
    .catch(e => console.error(e));

export const getLiveDirectMessages = (listenFn, dmId) => {
  const q = query(
    ref(db, `/dms/${dmId}/msgs`),
    orderByChild('createdOn'),
    limitToFirst(50)
  )
  return onValue(q, listenFn)
};

export const getLiveGroupDmMembers = (listenFn, dmId) =>
  onValue(ref(`dms/${dmId}/members`), listenFn);

export const sendMeetingMessage = (meetingId, handle, msg, picURL) =>
  push(ref(db, `meetings/${meetingId}/msgs`), {})
    .then(response => set(ref(db, `meetings/${meetingId}/msgs/${response.key}`),
      {
        body: msg,
        id: response.key,
        owner: handle,
        createdOn: serverTimestamp(),
        avatar: picURL
      })
    )
    .catch(e => console.error(e));

export const getLiveMeetingMessages = (listenFn, meetingId) => {
  const q = query(
    ref(db, `/meetings/${meetingId}/msgs`),
    orderByChild('createdOn'),
    limitToFirst(50)
  )

  return onValue(q, listenFn);
};

export const getMeetingChat = (meetingId) =>
  get(ref(db, `meetings/${meetingId}/msgs`))
    .then(snapshot => snapshot.exists() ? snapshot.val() : [])
    .catch(e => console.error(e));

export const setChannelSeenBy = (channelId, user) => {
  const updates = {};
  if (!channelId) return;

  updates[`channels/${channelId}/seenBy/${user}`] = true;
  return update(ref(db), updates);
};

export const setNotSeenChannel = (channelId, teamId) => {
  const updates = {};

  updates[`channels/${channelId}/seenBy`] = null;
  updates[`teams/${teamId}/seenBy`] = null;
  return update(ref(db), updates);
}

export const setTeamSeenBy = (teamId, user) => {
  const updates = {};

  updates[`teams/${teamId}/seenBy/${user}`] = true;
  return update(ref(db), updates);
}

export const setTeamsNotSeenBy = (teamId, user) => {
  const updates = {};

  updates[`teams/${teamId}/seenBy/${user}`] = null;
  return update(ref(db), updates);
}

export const sendPictureMessage = (channelId, handle, msg, picURL) =>
  push(ref(db, `channels/${channelId}/msgs`), {})
    .then(response =>
      set(ref(db, `channels/${channelId}/msgs/${response.key}`),
        {
          body: msg,
          pic: picURL,
          id: response.key,
          owner: handle,
          createdOn: serverTimestamp(),
        })
    )
    .catch(e => console.error(e));

export const sendPictureDirectMessage = (dmId, handle, msg, picURL) =>
  push(ref(db, `dms/${dmId}/msgs`), {})
    .then(response =>
      set(ref(db, `dms/${dmId}/msgs/${response.key}`),
        {
          body: msg,
          pic: picURL,
          id: response.key,
          owner: handle,
          createdOn: serverTimestamp(),
        })
    )
    .catch(e => console.error(e));

export const sendMeetingPictureMessage = (meetingId, handle, msg, picURL) =>
  push(ref(db, `meetings/${meetingId}/msgs`), {})
    .then(response =>
      set(ref(db, `meetings/${meetingId}/msgs/${response.key}`),
        {
          body: msg,
          pic: picURL,
          id: response.key,
          owner: handle,
          createdOn: serverTimestamp(),
        })
    )
    .catch(e => console.error(e));
