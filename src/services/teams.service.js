import { equalTo, get, onValue, orderByChild, push, query, ref, set, update } from "firebase/database";
import { db } from "../config/firebase-config";
import { getAllChannelsByTeam, getAllPublicChannelsByTeam, getChannelById } from "./channel.service";

const fromTeamsDocument = (snapshot) => {
  const teamsDocument = snapshot.val();

  return Object.keys(teamsDocument).map((key) => {
    const team = teamsDocument[key];

    return {
      ...team,
      id: key,
      createdOn: new Date(team.createdOn),
      members: team.members ? Object.keys(team.members) : [],
      channels: team.channels ? Object.keys(team.channels) : [],
    };
  });
};

export const addTeam = (handle, name) =>
  push(ref(db, "teams"), {})
    .then((response) => {
      const members = {};
      members[handle] = true;

      set(ref(db, `teams/${response.key}`), {
        name: name,
        createdOn: Date.now(),
        members,
        owner: handle,
        id: response.key,
      });

      return update(ref(db), {
        [`users/${handle}/myTeams/${response.key}`]: true,
      }).then(() => response.key);
    })
    .catch((e) => console.error(e));

export const getTeamName = (teamId) =>
  get(ref(db, `teams/${teamId}/name`))
    .then((snapshot) => (snapshot.exists() ? snapshot.val() : ""))
    .catch((e) => console.error(e));

export const getLiveTeamInfo = (listenFn, teamId) =>
  onValue(ref(db, `teams/${teamId}`), (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : {};
    listenFn(data);
  });

export const getLiveTeamMembers = (listenFn, teamId) =>
  onValue(ref(db, `teams/${teamId}/members`), (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : {};
    const result = Object.keys(data);

    listenFn(result);
  });

export const getLiveAllTeams = (listenFn) =>
  onValue(ref(db, "teams"), (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : {};
    const result = Object.values(data);

    listenFn(result);
  });

export const getAllTeamMembers = (teamId) =>
  get(ref(db, `teams/${teamId}/members`))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return [];
      }
      return Object.keys(snapshot.val());
    })
    .catch((e) => console.error(e));

export const getAllTeams = () =>
  get(ref(db, "teams"))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromTeamsDocument(snapshot);
    })
    .catch((e) => console.error(e));

export const findTeamByName = (name) =>
  get(query(ref(db, "teams"), orderByChild("name"), equalTo(name)));

export const getTeamById = (teamId) => get(ref(db, `teams${teamId}`));

export const addTeamMember = (handle, teamId) => {
  const teamRef = ref(db, `/teams/${teamId}/members/${handle}`);

  return get(teamRef)
    .then((teamSnapshot) => {
      if (teamSnapshot.exists()) {
        return Promise.reject(alert("User is already a member of this team!")); //handle alert with toast notification?
      } else {
        return getAllPublicChannelsByTeam(teamId).then((publicTeams) => {
          const updateTeam = {};
          updateTeam[`/teams/${teamId}/members/${handle}`] = true;
          updateTeam[`/users/${handle}/teams/${teamId}`] = true;
          publicTeams.map(
            (publicTeam) =>
            (updateTeam[
              `/channels/${publicTeam.id}/members/${handle}`
            ] = true)
          );

          return update(ref(db), updateTeam);
        });
      }
    })
    .catch((e) => {
      console.error("Error adding team member:", e.message);
      return Promise.reject("Error adding team member");
    });
};

export const updateTeamPhoto = (teamId, photoURL) => {
  const changePicture = {};
  changePicture[`/teams/${teamId}/photoURL`] = photoURL;

  return update(ref(db), changePicture);
};

export const removeTeamMember = (teamId, handle) => {
  const memberToRemove = {};

  memberToRemove[`/teams/${teamId}/members/${handle}`] = null;
  memberToRemove[`/users/${handle}/teams/${teamId}`] = null;
  return update(ref(db), memberToRemove)
    .then(() =>
      getAllChannelsByTeam(teamId)
        .then((channelsArr) =>
          Promise.all(channelsArr.map((channel) => getChannelById(channel)))
        )
        .then((channelsInfoArr) => {
          const memberToRemove = {};
          channelsInfoArr.map(
            (channel) =>
            (memberToRemove[`/channels/${channel.id}/members/${handle}`] =
              null)
          );

          return update(ref(db), memberToRemove);
        })
    )
    .catch((e) => console.error(e));
};

export const updateTeamName = (teamId, newName) => {
  const nameUpdate = {};
  nameUpdate[`/teams/${teamId}/name`] = newName;

  return update(ref(db), nameUpdate);
};

export const getLiveTeamSeenBy = (listenFn, teamId) =>
  onValue(
    ref(db, `teams/${teamId}/seenBy`), (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : {};
      const result = Object.keys(data);

      listenFn(result);
    });
