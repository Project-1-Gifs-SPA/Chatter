import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';
import { getUserByHandle } from './users.service';


export const createMeeting = (handle, participants, topic, start,end, teamId ) => {
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
                team: teamId
            });
        return update(ref(db),{
            [`users/${handle}/meetings/${response.key}`]: true,
            [`teams/${teamId}/meetings/${response.key}`]: true,
        })
        .then(()=>{
            if(participants.length!==1){
             return  Promise.all(participants.map(participantHandle=> addMemberToMeeting(response.key, participantHandle)));
            }
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


    return Object.keys(meetingsDocument).map(key=>{
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


export const getAllMeetingsByHandle = (handle) => {
    return get(ref(db,`users/${handle}/meetings`))
    .then(snapshot=>{
        const data = snapshot.exists() ? Object.keys(snapshot.val()) : [];

        return data;
    })
}

export const getLiveMeetingsByHandle = (listenFn, handle) => {

    return onValue(
        ref(db, `users/${handle}/meetings`),

        snapshot=>{
            const data = snapshot.exists() ? snapshot.val() : {};
            listenFn(Object.keys(data));
        }
    )
}


export const getLiveMeetingInfo = (listenFn, meetingId) => {
    return onValue(
        ref(db, `meetings/${meetingId}`),
        snapshot => {
            const data = snapshot.exists() ? snapshot.val() : {};
            listenFn(data);
        });
};


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

export const getMeetingMembers = (meetingId) => {
    return get(ref(db, `meetings/${meetingId}/members`))
    .then(snapshot=>{
        const data = snapshot.exists() ? snapshot.val() : {};

        return Object.keys(data);
    })
    .catch(e=>console.log(e))

}

export const deleteMeeting = (meetingId, teamId) => {

    getMeetingMembers(meetingId)
    .then(membersArr => {
        console.log(membersArr)

        const getMembers = membersArr.map(member=>{
            
        return  getUserByHandle(member)
            .then(snapshot=> snapshot.exists()? snapshot.val(): {})
        
        })
        
        return Promise.all(getMembers)
        .then(responseArr=>{

            // console.log(responseArr)
            const removeMeeting = {};
            responseArr.map(user=> removeMeeting[`users/${user.handle}/meetings/${meetingId}`] = null )

            return update(ref(db), removeMeeting)
        })
        .then(() => {

            const deleteMeeting = {};
            deleteMeeting[`meetings/${meetingId}`] = null;
            deleteMeeting[`teams/${teamId}/meetings/${meetingId}`] = null;
        
            return update(ref(db), deleteMeeting);
        })
        .catch(e=>console.log(e))
       
    })
    
}

export const addRecordingToMeeting =(meetingId, recordingURL) => {
    const addRecording = {};
    addRecording[`meetings/${meetingId}/recording`] = recordingURL;

    return update(ref(db), addRecording)
}

export const addMeetingDescription = (meetingId, description) => {
    const addDescription = {};
    addDescription[`meetings/${meetingId}/description`] = description;

    return update(ref(db), addDescription)
}

export const removeMemberFromMeeting  = (meetingId, handle) => {
    const removeMember = {};
    removeMember[`meetings/${meetingId}/members/${handle}`] = null;
    removeMember[`users/${handle}/meetings/${meetingId}`] = null;

    return update(ref(db), removeMember);
}