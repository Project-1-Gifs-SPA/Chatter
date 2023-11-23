import { ref, push, get, set, query, equalTo, orderByChild, update, endAt, startAt, onValue, limitToFirst, serverTimestamp } from 'firebase/database';
import { db } from '../config/firebase-config';


export const sendMessage = (channelId, handle, msg, picURL) => {

    return push(ref(db, `channels/${channelId}/msgs`),{})
    .then(response => {

        set(ref(db,`channels/${channelId}/msgs/${response.key}`), {
            body:msg,
            id: response.key,
            owner:handle,
            createdOn: serverTimestamp(),
            avatar: picURL
        });
    })
}

export const getLiveMessages = (listenFn,channelId) => {
    const q = query(
        ref(db, `/channels/${channelId}/msgs`),
        orderByChild('createdOn'),
        limitToFirst(50)
    )

    return onValue(q, listenFn);
}


export const getChat = (channelId) => {
    return get(ref(db, `channels/${channelId}/msgs`))
    .then(snapshot =>{
        const data = snapshot.exists() ? snapshot.val() : [];
        return data;
    })
}

// export const sendMessageTest = (teamId, handle, msg, picURL) => { ////delete when testing is done!

//     return push(ref(db, `teams/${teamId}/msgs`),{})
//     .then(response => {

//         set(ref(db,`teams/${teamId}/msgs/${response.key}`), {
//             body:msg,
//             id: response.key,
//             owner:handle,
//             createdOn: serverTimestamp(),
//             avatar: picURL,
//         });
//     })
// }


// export const getLiveMessagesTest = (listenFn,teamId) => {  //delete when testing is done!
//     const q= query(
//         ref(db, `/teams/${teamId}/msgs`),
//         orderByChild('createdOn'),
//         limitToFirst(50)
//     )
//     return onValue(q, listenFn)
// }

// export const getChatTest = (teamId) => {
//     return get(ref(db, `teams/${teamId}/msgs`))
//     .then(snapshot =>{
//         const data = snapshot.exists() ? snapshot.val() : [];
//         return Object.values(data);
//     })
// }