import { get, set, ref, query, equalTo, orderByChild, update, onValue } from 'firebase/database';
import { db } from '../config/firebase-config';


export const getUserByHandle = (handle) => {

  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (handle, uid, email, firstName, lastName, phoneNumber) => {

  return set(ref(db, `users/${handle}`), { handle, uid, email, createdOn: Date.now(), firstName, lastName, phoneNumber, })
};

export const getUserData = (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const writeUserData = (handle, firstName, lastName) => {

  update(ref(db, `users/${handle}`), {
    firstName: firstName,
    lastName: lastName,
  })
  .catch(error => console.error(error))
}

export const updateUserPhoto = (handle, photoURL) => {
  const changePicture = {};
  changePicture[`/users/${handle}/photoURL`] = photoURL;

  return update(ref(db), changePicture);
}
