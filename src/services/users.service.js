import { get, set, ref, query, equalTo, orderByChild, update, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';


export const getUserByHandle = (handle) => {

  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (handle, uid, email, firstName, lastName, phoneNumber, availability) => {

  return set(ref(db, `users/${handle}`), { handle, uid, email, createdOn: Date.now(), firstName, lastName, phoneNumber, availability, })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const writeUserData = (handle, firstName, lastName, phoneNumber) => {

  update(ref(db, `users/${handle}`), {
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber
  })
  .catch(error => console.error(error))
}

export const updateUserPhoto = (handle, photoURL) => {
  const changePicture = {};
  changePicture[`/users/${handle}/photoURL`] = photoURL;

  return update(ref(db), changePicture);
}

export const changeUserStatus = (handle, status) => {

  update(ref(db, `users/${handle}`), {
    availability: status
  })
  .catch(error => console.error(error))
}

export const getLiveUserInfo = (listener, handle) => {
  return onValue(
    ref(db, `users/${handle}`),
    snapshot => {
      const data = snapshot.exists() ? snapshot.val() : {};

      listener(data);
    });
};

const fromUsersDocument = snapshot => {
  const usersDocument = snapshot.val();

  return Object.keys(usersDocument).map(key=>{
    const user = usersDocument[key];

    return {
      ...user,
      uid:key,
      createdOn: new Date(user.createdOn),
      likedPosts: user.likedPosts ? Object.keys(user.likedPosts) : []
    }
  })
}

export const getAllUsers = () => {

  return get(ref(db,'users'))
  .then(snapshot=>{
    if(!snapshot.exists()){
      return [];
    }

    return fromUsersDocument(snapshot);
  })
};

export const getUsersBySearchTerm = (users, searchParam, searchTerm) => {

  return searchTerm === ''
    ? []
    : users.filter((user) => typeof user[searchParam] === 'string'
        ? user[searchParam].toLowerCase().includes(searchTerm)
        : false
    );
};
