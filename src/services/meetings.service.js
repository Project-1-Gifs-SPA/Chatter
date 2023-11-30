import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';


export const createMeeting = (handle, participants, topic, start,end, ) => {
    return push(ref(db, 'meetings'),{})
    .then(response => {
        
        const members={};
        participants.map(participant=> members[participant]=true)
        
        set(ref(db,`meetings/${response.key}`),
            {
                topic: topic,
                members,
                id:response.key,
                owner: handle,
                start,
                end,
            });
        return update(ref(db),{
            [`users/${handle}/meetings/${response.key}`]: true,
        })
        .then(()=> response.key);

    });
};

export const getMeetingById = (meetingId) => {
    return get(ref(db, `meetings/${meetingId}`))
    .then(snapshot => snapshot.exists() ? snapshot.val() : {});
}

export const addMemberToMeeting = (meetingId, handle) =>{
    const addMember = {};
    addMember[`meetings/${meetingId}/members/${handle}`] = true;
    addMember[`users/${handle}/meetings/${meetingId}`] = true;

    return update(ref(db), addMember);
}


export const addMeetingRoomId = (meetingId, roomId) => {
    const updateRoom  = {};
    updateRoom[`meetings/${meetingId}/room`] = roomId;

    return update(ref(db), updateRoom);
}

export const fromMeetingsDocument = (snapshot) => {
    const meetingsDocument =  snapshot.val();


    return Object.key(meetingsDocument).map(key=>{
        const meeting =meetingsDocument[key];

        return{
            ...meeting,
            id: key,
            members: meeting.members? Object.keys(meeting.members) : [],
        }

    })

}

export const getAllMeetings = () => {
    return get(ref(db,'meetings'))
    .then((snapshot)=>{
    const data = snapshot.exists() ? snapshot : [];

    return fromMeetingsDocument(data);
});
}

export const getMeetingsByHandle = (handle) => {
    
}


export const getAllMeetingsByHandle = (handle) => {
    return get(ref(db,`users/${handle}/meetings`))
    .then(snapshot=>{
        const data = snapshot.exists() ? Object.keys(snapshot.val()) : [];

        return data;
    })
}



export const getLiveAllMeetings = (listenFn) => {
    return onValue(
        ref(db, 'meetings'),
        snapshot => {
            const data = snapshot.exists() ? Object.values(snapshot.val()) : {};
            listenFn(data);
        }
    )
}


export const getLiveMeetingMembers = (listenFn, meetingId) => {
    return onValue(
        ref(db, `meetings/${meetingId}/members`),
        snapshot => {
            const data = snapshot.exists() ? Object.keys(snapshot.val()) : [];

            listenFn(data);
        }
    )
}

export const deleteMeeting = (meetingId) => {
    const deleteMeeting = {};
    deleteMeeting[`meetings/${meetingId}`] = null;

    return update(ref(db), deleteMeeting);
}